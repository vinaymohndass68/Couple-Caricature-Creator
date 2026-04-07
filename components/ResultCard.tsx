
import React from 'react';
import { GenerationResult } from '../types';

interface ResultCardProps {
  result: GenerationResult;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = 'caricature.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out this hilarious caricature of us! 😂 ${result.caption}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-orange-400 transform transition-all animate-in fade-in zoom-in duration-500 max-w-lg w-full">
      <div className="relative aspect-square">
        <img src={result.imageUrl} alt="Caricature" className="w-full h-full object-cover" />
      </div>
      
      <div className="p-8 text-center bg-orange-50">
        <h3 className="font-bungee text-2xl mb-4 text-orange-600 leading-tight">
          "{result.caption}"
        </h3>
        
        <div className="flex flex-col space-y-3 mt-8">
          <button 
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.394 0 12.03c0 2.12.554 4.189 1.602 6.006L0 24l6.135-1.61a11.83 11.83 0 005.91 1.586h.005c6.635 0 12.032-5.396 12.035-12.032a11.762 11.762 0 00-3.525-8.508z" />
            </svg>
            <span>SHARE CAPTION ON WHATSAPP</span>
          </button>
          
          <button 
            onClick={handleDownload}
            className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>DOWNLOAD CARICATURE</span>
          </button>

          <button 
            onClick={onReset}
            className="text-orange-500 font-bold py-2 hover:underline"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
