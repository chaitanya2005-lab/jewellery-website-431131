import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  addDoc,
  doc as firestoreDoc,
  deleteDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { handleFirestoreError, OperationType } from './firestore-errors';
import { User, Appointment, Order } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserAddresses: (addresses: string[]) => Promise<void>;
  addSavedAddress: (address: string) => Promise<void>;
  appointments: Appointment[];
  orders: Order[];
  allUsersList: User[]; // Admin usage
  allAppointmentsList: Appointment[]; // Admin usage
  allOrdersList: Order[]; // Admin usage
  isAdmin: boolean;
  bookAppointment: (apt: Omit<Appointment, 'id' | 'userId' | 'status'>) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'userId' | 'status' | 'date' | 'trackingNumber'>) => Promise<Order>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Admin Lists
  const [allUsersList, setAllUsersList] = useState<User[]>([]);
  const [allAppointmentsList, setAllAppointmentsList] = useState<Appointment[]>([]);
  const [allOrdersList, setAllOrdersList] = useState<Order[]>([]);

  const isAdmin = userData?.isAdmin || false;

  // Track Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data() as User;
            setUserData({ ...data, isLoggedIn: true });
          } else {
            // Document might not exist if created elsewhere, create fallback
            const fallbackData: User = {
              uid: user.uid,
              email: user.email || '',
              name: user.displayName || user.email?.split('@')[0] || 'Patron',
              phone: '',
              savedAddresses: [],
              isAdmin: user.email === 'chaitanyanarwade000@gmail.com',
              isLoggedIn: true
            };
            await setDoc(userDocRef, fallbackData);
            setUserData(fallbackData);
          }
        } catch (error) {
          console.error("Error loading user details: ", error);
          // Load from fallback
          setUserData({
            uid: user.uid,
            email: user.email || '',
            name: user.email?.split('@')[0] || 'Patron',
            isLoggedIn: true,
            isAdmin: user.email === 'chaitanyanarwade000@gmail.com',
            savedAddresses: []
          });
        }
      } else {
        setUserData(null);
        setAppointments([]);
        setOrders([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fetch logged-in user's specific records in real-time
  useEffect(() => {
    if (!currentUser) return;

    // Realtime appointments
    const aptsQuery = query(collection(db, 'appointments'), where('userId', '==', currentUser.uid));
    const unsubscribeApts = onSnapshot(aptsQuery, (snapshot) => {
      const fetched: Appointment[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Appointment);
      });
      // Sort newest date & time or creation first
      fetched.sort((a, b) => b.date.localeCompare(a.date));
      setAppointments(fetched);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'appointments');
    });

    // Realtime orders
    const ordersQuery = query(collection(db, 'orders'), where('userId', '==', currentUser.uid));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const fetched: Order[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Order);
      });
      fetched.sort((a, b) => b.date.localeCompare(a.date));
      setOrders(fetched);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => {
      unsubscribeApts();
      unsubscribeOrders();
    };
  }, [currentUser]);

  // Fetch Admin lists if user is admin
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      setAllUsersList([]);
      setAllAppointmentsList([]);
      setAllOrdersList([]);
      return;
    }

    // Realtime Users
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const fetched: User[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ ...doc.data() } as User);
      });
      setAllUsersList(fetched);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    // Realtime Appointments
    const unsubscribeAllApts = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      const fetched: Appointment[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Appointment);
      });
      fetched.sort((a, b) => b.date.localeCompare(a.date));
      setAllAppointmentsList(fetched);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'appointments');
    });

    // Realtime Orders
    const unsubscribeAllOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const fetched: Order[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Order);
      });
      fetched.sort((a, b) => b.date.localeCompare(a.date));
      setAllOrdersList(fetched);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => {
      unsubscribeUsers();
      unsubscribeAllApts();
      unsubscribeAllOrders();
    };
  }, [currentUser, isAdmin]);

  // Login
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  // Signup
  const signup = async (email: string, password: string, name: string, phone: string) => {
    try {
      const cleanPhone = phone.trim();

      // 1. Check for duplicate phone number in Firestore
      if (cleanPhone) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phone', '==', cleanPhone));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          throw new Error('This phone number is already registered under another premium patron.');
        }
      }

      const credential = await createUserWithEmailAndPassword(auth, email, password);
      // Create user document in Firestore
      const isUserAdmin = email === 'chaitanyanarwade000@gmail.com';
      const newUserData: User = {
        uid: credential.user.uid,
        email,
        name,
        phone: cleanPhone,
        savedAddresses: [],
        isAdmin: isUserAdmin,
        isLoggedIn: true
      };
      
      const userDocRef = doc(db, 'users', credential.user.uid);
      await setDoc(userDocRef, newUserData);
      setUserData(newUserData);
    } catch (error: any) {
      if (error instanceof Error && error.message.includes('already registered')) {
        throw error;
      }
      handleFirestoreError(error, OperationType.WRITE, `users`);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      throw error;
    }
  };

  // Reset Password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  // Update Addresses
  const updateUserAddresses = async (addresses: string[]) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(userDocRef, { savedAddresses: addresses });
      if (userData) {
        setUserData({ ...userData, savedAddresses: addresses });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  // Add Saved Address
  const addSavedAddress = async (address: string) => {
    if (!currentUser) return;
    const currentAddresses = userData?.savedAddresses || [];
    if (!currentAddresses.includes(address)) {
      const updated = [...currentAddresses, address];
      await updateUserAddresses(updated);
    }
  };

  // Book Appointment
  const bookAppointment = async (apt: Omit<Appointment, 'id' | 'userId' | 'status'>) => {
    if (!currentUser) throw new Error("Must be logged in to book an appointment");
    const id = 'apt_' + Date.now();
    const fullApt: Appointment = {
      ...apt,
      id,
      userId: currentUser.uid,
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'appointments', id), fullApt);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `appointments/${id}`);
    }
  };

  // Update Appointment (Reschedule, Cancel, Complete)
  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    const docRef = doc(db, 'appointments', id);
    try {
      await updateDoc(docRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  // Cancel Appointment
  const cancelAppointment = async (id: string) => {
    const docRef = doc(db, 'appointments', id);
    try {
      await updateDoc(docRef, { status: 'Cancelled' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  // Create Order
  const createOrder = async (order: Omit<Order, 'id' | 'userId' | 'status' | 'date' | 'trackingNumber'>) => {
    if (!currentUser) throw new Error("Must be logged in to place an order");
    const id = 'ord_' + Math.floor(Math.random() * 900000 + 100000);
    const trackingNumber = 'UDY-' + Math.floor(Math.random() * 90000000 + 10000000);
    const fullOrder: Order = {
      ...order,
      id,
      userId: currentUser.uid,
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'Placed',
      trackingNumber,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'orders', id), fullOrder);
      return fullOrder;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${id}`);
      throw error;
    }
  };

  // Update Order (Admin updates status etc.)
  const updateOrder = async (id: string, updates: Partial<Order>) => {
    const docRef = doc(db, 'orders', id);
    try {
      await updateDoc(docRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        loading,
        login,
        signup,
        logout,
        resetPassword,
        updateUserAddresses,
        addSavedAddress,
        appointments,
        orders,
        allUsersList,
        allAppointmentsList,
        allOrdersList,
        isAdmin,
        bookAppointment,
        updateAppointment,
        cancelAppointment,
        createOrder,
        updateOrder
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
