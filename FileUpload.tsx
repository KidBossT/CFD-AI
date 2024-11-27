import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
        ${isDragActive 
          ? 'border-green-400 bg-green-500/10' 
          : 'border-green-500/20 hover:border-green-400/50 hover:bg-black/40'
        }`}
    >
      <input {...getInputProps()} />
      <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragActive ? 'text-green-400' : 'text-gray-500'}`} />
      <p className="text-sm text-gray-300">
        {isDragActive
          ? 'Drop your CFD image here...'
          : 'Drag & drop a CFD image, or click to select'}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Supports PNG, JPG up to 10MB
      </p>
    </div>
  );
};