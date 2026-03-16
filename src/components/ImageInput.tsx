import React, { useRef, useState, useCallback } from 'react';
import { Camera, Upload, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageInputProps {
  onImageCapture: (base64: string) => void;
  isLoading: boolean;
}

export const ImageInput: React.FC<ImageInputProps> = ({ onImageCapture, isLoading }) => {
  const [mode, setMode] = useState<'idle' | 'camera'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setMode('idle');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setMode('idle');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const base64 = canvasRef.current.toDataURL('image/jpeg');
        onImageCapture(base64);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {mode === 'idle' ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <button
              onClick={startCamera}
              disabled={isLoading}
              className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-stone-200 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group disabled:opacity-50"
            >
              <div className="p-4 bg-emerald-100 rounded-full text-emerald-600 group-hover:scale-110 transition-transform">
                <Camera size={32} />
              </div>
              <span className="mt-4 font-medium text-stone-700">Capture Photo</span>
              <p className="text-sm text-stone-500 mt-1">Use your device camera</p>
            </button>

            <label className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-stone-200 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={isLoading} />
              <div className="p-4 bg-indigo-100 rounded-full text-indigo-600 group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <span className="mt-4 font-medium text-stone-700">Upload Image</span>
              <p className="text-sm text-stone-500 mt-1">Select from gallery</p>
            </label>
          </motion.div>
        ) : (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={stopCamera}
                className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <X size={24} />
              </button>
              <button
                onClick={capturePhoto}
                className="p-6 bg-emerald-500 rounded-full text-white shadow-lg hover:bg-emerald-600 hover:scale-105 transition-all"
              >
                <div className="w-4 h-4 rounded-full border-2 border-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <canvas ref={canvasRef} className="hidden" />
      
      {isLoading && (
        <div className="mt-8 flex flex-col items-center">
          <RefreshCw className="animate-spin text-emerald-500 mb-2" size={32} />
          <p className="text-stone-600 font-medium">Analyzing Nutrients...</p>
        </div>
      )}
    </div>
  );
};
