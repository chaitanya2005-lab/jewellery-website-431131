import React, { useState } from 'react';
import { Sparkles, Upload, FileText, CheckCircle2, Sliders, PenTool, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface CustomPageProps {
  onOpenAppointment: () => void;
}

export default function CustomPage({ onOpenAppointment }: CustomPageProps) {
  const [metal, setMetal] = useState('22K Yellow Gold');
  const [gem, setGem] = useState('Brilliant Solitaire Diamond');
  const [carat, setCarat] = useState(1.0);
  const [ringSize, setRingSize] = useState('7');
  const [inscription, setInscription] = useState('');
  const [fileUploaded, setFileUploaded] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimationResult, setEstimationResult] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileUploaded(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileUploaded(e.target.files[0].name);
    }
  };

  const handleCalculateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEstimating(true);
    setTimeout(() => {
      // Simple formula: base metal ($800) + gem base ($1200 * carat) + custom fee ($250)
      const metalBasePrice = metal.includes('Gold') ? 950 : metal.includes('Platinum') ? 1400 : 450;
      const gemMultiplier = gem.includes('Solitaire') ? 1800 : gem.includes('Diamond') ? 1200 : gem.includes('Emerald') ? 850 : 600;
      const finalEst = metalBasePrice + (gemMultiplier * carat) + 300;
      setEstimationResult(Math.round(finalEst));
      setIsEstimating(false);
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans" id="custompage-root">
      
      {/* 1. HERO DESCRIPTION */}
      <section className="relative py-20 bg-gold-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1600"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gold-950 via-gold-950/95 to-gold-950 z-10" />

        <div className="relative z-20 max-w-3xl mx-auto px-4">
          <span className="text-[10px] tracking-[0.4em] text-gold-300 font-semibold uppercase block mb-2">BESPOKE SERVICES</span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold tracking-widest text-gold-50 uppercase">
            Atelier Customization
          </h1>
          <p className="font-sans text-xs md:text-sm text-gold-100/70 mt-4 leading-relaxed max-w-xl mx-auto font-light">
            Why wear another’s creation when you can sketch your own destiny? Shape your ideal precious ornament through our interactive configurator.
          </p>
        </div>
      </section>

      {/* 2. INTERACTIVE CONFIGURATOR ENGINE */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left panel: Inputs */}
          <div className="lg:col-span-7 bg-white border border-gold-200 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Sliders className="w-5 h-5 text-gold-600" />
              <h2 className="font-serif text-lg md:text-xl text-gold-950 font-bold uppercase tracking-wide">Design Parameters</h2>
            </div>
            
            <form onSubmit={handleCalculateEstimate} className="space-y-6 text-xs">
              
              {/* Metal Selection */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Select Precious Metal Base</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: '22K Yellow Gold', class: 'bg-yellow-100 border-yellow-400' },
                    { name: '18K White Gold', class: 'bg-gray-100 border-gray-200' },
                    { name: '18K Rose Gold', class: 'bg-red-50 border-rose-200' },
                    { name: 'PT950 Platinum', class: 'bg-slate-100 border-slate-300' }
                  ].map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setMetal(m.name)}
                      className={`p-3 text-center border transition-all ${metal === m.name ? 'border-gold-600 bg-gold-950 text-white' : 'border-gray-200 hover:border-gold-300 bg-white text-gray-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full mx-auto mb-1.5 ${m.class}`} />
                      <span className="font-medium">{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gem Type Selection */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">Center Gemstone Profile</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    'Brilliant Solitaire Diamond',
                    'Colombian Deep Emerald',
                    'Royal Kashmiri Sapphire',
                    'Burmese Pigeon Blood Ruby'
                  ].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGem(g)}
                      className={`p-3 text-center border text-[11px] transition-all flex flex-col justify-center h-16 ${gem === g ? 'border-gold-600 bg-gold-950 text-white' : 'border-gray-200 hover:border-gold-300 bg-white text-gray-700'}`}
                    >
                      <span className="font-semibold line-clamp-2 leading-snug">{g}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider for Carats */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  <span>Gemstone Carat weight</span>
                  <span className="text-gold-700 font-mono text-xs">{carat.toFixed(2)} CT</span>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="4.0"
                  step="0.05"
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold-600"
                  value={carat}
                  onChange={(e) => setCarat(parseFloat(e.target.value))}
                />
                <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
                  <span>0.25 CT (Petite)</span>
                  <span>2.00 CT (Majestic)</span>
                  <span>4.00 CT (Imperial Solitaire)</span>
                </div>
              </div>

              {/* Ring / Bracelet Size & Engraving */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Ring size (Universal)</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none"
                    value={ringSize}
                    onChange={(e) => setRingSize(e.target.value)}
                  >
                    {['5', '6', '7', '8', '9', '10', '11'].map(sz => (
                      <option key={sz} value={sz}>Size {sz}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">Bespoke Engraving Text</label>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="e.g. My Queen, 2026"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 font-mono"
                    value={inscription}
                    onChange={(e) => setInscription(e.target.value)}
                  />
                </div>
              </div>

              {/* Drag-and-drop sketch upload */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Reference Sketch or Image (Optional)
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed py-8 px-4 text-center cursor-pointer transition-all ${isDragOver ? 'border-gold-600 bg-gold-50/40' : 'border-gray-200 hover:border-gold-300 bg-gray-50/20'}`}
                >
                  <input
                    type="file"
                    id="sketch-upload"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="sketch-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gold-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-700">Drag & Drop sketch or click to select</p>
                    <p className="text-[10px] text-gray-400 mt-1">Accepts PNG, JPG, or PDF up to 10MB</p>
                  </label>

                  {fileUploaded && (
                    <div className="mt-4 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] inline-flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Uploaded sketch: <strong>{fileUploaded}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Calculate estimate button */}
              <button
                type="submit"
                disabled={isEstimating}
                className="w-full py-3 bg-gold-950 text-white font-serif tracking-widest text-xs uppercase hover:bg-gold-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                {isEstimating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Metal Geometry...</span>
                  </>
                ) : (
                  <span>Calculate Custom Appraisal</span>
                )}
              </button>

            </form>
          </div>

          {/* Right panel: Digital Estimate Canvas */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gold-50/50 border border-gold-300 p-6 md:p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex flex-col items-center">
                <PenTool className="w-8 h-8 text-gold-600 mb-2" />
                <span className="text-[10px] text-gold-600 font-semibold tracking-widest uppercase">REAL-TIME ESTIMATE MODEL</span>
                <h3 className="font-serif text-lg font-bold text-gold-950 uppercase mt-1">Bespoke Blueprint</h3>
                <div className="h-0.5 w-12 bg-gold-400 mt-2.5" />
              </div>

              {/* Blueprint details */}
              <div className="text-left mt-6 space-y-3.5 text-xs text-gray-600">
                <div className="flex justify-between border-b border-gold-100 pb-1.5">
                  <span className="font-medium">Metal Base:</span>
                  <span className="text-gold-900 font-semibold">{metal}</span>
                </div>
                <div className="flex justify-between border-b border-gold-100 pb-1.5">
                  <span className="font-medium">Gemstone Profile:</span>
                  <span className="text-gold-900 font-semibold">{gem}</span>
                </div>
                <div className="flex justify-between border-b border-gold-100 pb-1.5">
                  <span className="font-medium">Calculated Weight:</span>
                  <span className="text-gold-900 font-semibold">{carat.toFixed(2)} Carats</span>
                </div>
                <div className="flex justify-between border-b border-gold-100 pb-1.5">
                  <span className="font-medium">Sizing Allocation:</span>
                  <span className="text-gold-900 font-semibold">Size {ringSize}</span>
                </div>
                {inscription && (
                  <div className="flex justify-between border-b border-gold-100 pb-1.5 font-mono">
                    <span className="font-medium text-gray-400">Engraved Script:</span>
                    <span className="text-gold-800 font-bold italic">"{inscription}"</span>
                  </div>
                )}
              </div>

              {estimationResult ? (
                <div className="mt-8 p-4 bg-white border border-gold-300 shadow-sm rounded-none">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Appraised Price Range</p>
                  <p className="font-serif text-3xl font-extrabold text-gold-900 mt-1">${estimationResult.toLocaleString()} - ${(estimationResult + 450).toLocaleString()}</p>
                  <p className="text-[9px] text-gray-400 mt-1.5">Includes GIA Solitaire Grading and standard crafting charges.</p>
                </div>
              ) : (
                <div className="mt-8 p-6 bg-white/70 border border-gray-100 italic text-xs text-gray-400 text-center">
                  Adjust parameters on the left and click "Calculate Custom Appraisal" to generate a live cost blueprint.
                </div>
              )}

              {/* Book Appointment trigger */}
              <button
                onClick={onOpenAppointment}
                className="w-full mt-6 py-3 bg-gold-900 hover:bg-gold-800 text-white font-serif tracking-widest text-xs uppercase transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-gold-300" />
                <span>Reserve Custom Atelier Meeting</span>
              </button>
            </div>

            {/* Trusted Certificate Seals */}
            <div className="p-4 bg-gray-50 border border-gray-200 space-y-2.5">
              <h4 className="font-serif text-xs font-bold text-gold-950 uppercase tracking-wider">Certified Luxury Guards</h4>
              <p className="text-[10px] text-gray-500 leading-relaxed font-light">
                Every customized gemstone order exceeding 0.50 CT is accompanied by an individual diamond dossier issued by the Gemological Institute of America (GIA), certifying cut, clarity, and laser-inscribed girdle serials.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
