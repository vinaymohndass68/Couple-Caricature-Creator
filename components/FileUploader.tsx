
import React, { useRef, useState } from 'react';
import CropModal from './CropModal';

interface FileUploaderProps {
  label: string;
  onImageSelected: (data: string, mimeType: string) => void;
  preview: string | null;
  id: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ label, onImageSelected, preview, id }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (cropped: { data: string; mimeType: string }) => {
    onImageSelected(cropped.data, cropped.mimeType);
    setTempImage(null);
  };

  return (
    <div className="flex flex-col items-center space-y-3 w-full max-w-xs">
      <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">{label}</label>
      <div 
        onClick={() => inputRef.current?.click()}
        className={`relative w-48 h-48 border-4 border-dashed rounded-[2.5rem] cursor-pointer flex items-center justify-center overflow-hidden transition-all duration-300 group ${
          preview ? 'border-orange-400 ring-4 ring-orange-100 ring-offset-2' : 'border-slate-300 hover:border-orange-300 bg-white'
        }`}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-[2rem]" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[2rem]">
              <span className="text-white font-bold text-xs">CHANGE PHOTO</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-slate-400 group-hover:text-orange-400 transition-colors">
            <div className="p-4 bg-slate-50 rounded-full mb-2 group-hover:bg-orange-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">TAP TO SELECT</span>
          </div>
        )}
      </div>
      <input
        type="file"
        id={id}
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {tempImage && (
        <CropModal
          imageSrc={tempImage}
          onClose={() => setTempImage(null)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default FileUploader;
