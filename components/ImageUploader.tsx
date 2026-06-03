
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };


  return (
    <div 
        className={`border-4 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-emerald-500 bg-gray-700' : 'border-gray-600 hover:border-emerald-600 hover:bg-gray-700/50'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept="image/png, image/jpeg, image/webp, image/tiff"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center justify-center space-y-4 text-gray-400">
        <UploadIcon />
        <p className="text-lg font-semibold">
          <span className="text-emerald-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm">PNG, JPG, WEBP, or TIFF</p>
      </div>
    </div>
  );
};
