
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/canvasUtils';

interface CropModalProps {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImage: { data: string; mimeType: string }) => void;
}

const CropModal: React.FC<CropModalProps> = ({ imageSrc, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: any) => setCrop(crop);
  const onZoomChange = (zoom: number) => setZoom(zoom);

  const onCropAreaChange = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(cropped);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col h-[80vh]">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bungee text-xl text-orange-600">Crop Face</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative flex-1 bg-slate-800">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropAreaChange}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-bold text-slate-400 uppercase">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-orange-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <button
            onClick={handleSave}
            className="w-full bg-orange-600 text-white font-bungee py-4 rounded-2xl hover:bg-orange-700 transition-colors shadow-lg"
          >
            CONFIRM CROP
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
