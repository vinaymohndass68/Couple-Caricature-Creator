
import React, { useState, useEffect } from 'react';
import FileUploader from './components/FileUploader';
import ResultCard from './components/ResultCard';
import { generateCaricature } from './services/gemini';
import { GenerationResult, ImageSource } from './types';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [wifeImage, setWifeImage] = useState<ImageSource | null>(null);
  const [husbandImage, setHusbandImage] = useState<ImageSource | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      try {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } catch (e) {
        setHasApiKey(false);
      }
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      // Assume success per documentation race condition mitigation
      setHasApiKey(true);
    } catch (e) {
      console.error("Failed to open key selection", e);
    }
  };

  const handleGenerate = async () => {
    if (!wifeImage || !husbandImage) return;

    setLoading(true);
    setError(null);
    try {
      const output = await generateCaricature(wifeImage, husbandImage);
      setResult(output);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#fbbf24', '#f59e0b']
      });
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setError("Please re-select your API key to continue.");
        setHasApiKey(false);
      } else {
        setError("The caricature artist is a bit busy. Please try again in a moment!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWifeImage(null);
    setHusbandImage(null);
    setResult(null);
    setError(null);
  };

  const loadingMessages = [
    "Analyzing facial features...",
    "Sketching big heads with likeness...",
    "Matching hair and eye styles...",
    "Adding comedy to the scene...",
    "Polishing the digital paint...",
    "Finalizing the couple dynamic..."
  ];

  const [currentMsgIndex, setCurrentMsgIndex] = React.useState(0);

  React.useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  if (hasApiKey === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-24 h-24 bg-orange-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl rotate-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
             </svg>
          </div>
          <h1 className="font-bungee text-4xl">Connect to Pro</h1>
          <p className="text-slate-400 font-medium">
            To generate high-fidelity caricatures that match your face perfectly, you need to connect a Gemini API key from a paid GCP project.
          </p>
          <div className="p-4 bg-slate-800 rounded-2xl text-xs text-slate-400 text-left border border-slate-700">
            <strong>Note:</strong> Visit the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-orange-500 underline">billing documentation</a> to set up a paid project.
          </div>
          <button 
            onClick={handleConnectKey}
            className="w-full py-6 bg-orange-600 hover:bg-orange-500 rounded-3xl font-bungee text-xl transition-all shadow-xl shadow-orange-900/20 active:scale-95"
          >
            SELECT API KEY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-12 selection:bg-orange-200">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-block bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 shadow-lg transform -rotate-2">
          Gemini 3 Pro Powered
        </div>
        <h1 className="font-bungee text-5xl md:text-7xl text-slate-800 drop-shadow-sm mb-2 leading-none">
          CARI<span className="text-orange-600">CATURE</span>
          <br />
          <span className="text-orange-500">CRAZE</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4">
          Uncompromising Likeness & Comedy
        </p>
      </header>

      <main className="w-full flex flex-col items-center max-w-4xl">
        {!result ? (
          <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-4 border-white w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50 rounded-full -ml-32 -mb-32 opacity-50 blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-around items-center space-y-12 md:space-y-0 md:space-x-8 mb-16">
              <FileUploader 
                id="wife-upload"
                label="Wife's Face"
                preview={wifeImage ? `data:${wifeImage.mimeType};base64,${wifeImage.data}` : null}
                onImageSelected={(data, mimeType) => setWifeImage({ data, mimeType })}
              />
              
              <div className="hidden md:flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 font-black text-xl">
                  &
                </div>
              </div>

              <FileUploader 
                id="husband-upload"
                label="Husband's Face"
                preview={husbandImage ? `data:${husbandImage.mimeType};base64,${husbandImage.data}` : null}
                onImageSelected={(data, mimeType) => setHusbandImage({ data, mimeType })}
              />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {error && (
                <div className="bg-red-50 text-red-500 px-6 py-3 rounded-2xl font-bold mb-6 flex items-center space-x-2 animate-in slide-in-from-bottom-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!wifeImage || !husbandImage || loading}
                className={`w-full max-w-md py-6 rounded-3xl font-bungee text-2xl shadow-2xl transition-all active:scale-95 transform ${
                  !wifeImage || !husbandImage || loading
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-slate-900 hover:-translate-y-1 shadow-orange-200'
                }`}
              >
                {loading ? 'GENERATING...' : 'CREATE CARICATURE!'}
              </button>
              
              {!wifeImage || !husbandImage ? (
                <p className="mt-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                  Step 1: Upload & Crop both faces
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <ResultCard result={result} onReset={handleReset} />
        )}
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[100] flex flex-col items-center justify-center text-white px-6">
          <div className="relative w-40 h-40 mb-12">
            <div className="absolute inset-0 border-[12px] border-orange-500/20 rounded-[3rem]"></div>
            <div className="absolute inset-0 border-[12px] border-orange-500 border-t-transparent rounded-[3rem] animate-spin"></div>
            <div className="absolute inset-8 border-4 border-white/20 rounded-2xl animate-pulse"></div>
          </div>
          <h2 className="font-bungee text-4xl mb-6 text-white text-center">Artist at Work</h2>
          <div className="bg-white/10 px-8 py-4 rounded-full backdrop-blur-md">
            <p className="text-xl font-bold text-orange-400 italic text-center min-w-[200px]">
              {loadingMessages[currentMsgIndex]}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto py-12 text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">
        Created with Gemini 3 Pro & Love <br/>
        &copy; 2025 Caricature Craze
      </footer>

      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
