
import React, { useState, useCallback, ChangeEvent, useRef, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { analyzeCropImage } from '../../services/geminiService';
import { DiseaseResult } from '../../types';

const CameraIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


const DiseaseDetectionPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) throw new Error('Invalid data URL');
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  
  const resetState = useCallback(() => {
    setImage(null);
    setFile(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleImageUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      resetState();
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(uploadedFile);
    }
  }, [resetState]);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        resetState();
        setIsCameraOpen(true);
        setStream(stream);
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError("Could not access camera. Please ensure you have a camera and have granted permission.");
      }
    } else {
      setError("Your browser does not support camera access.");
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setStream(null);
  }, [stream]);
  
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const captureImage = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        setFile(dataURLtoFile(dataUrl, `capture-${Date.now()}.jpg`));
      }
      stopCamera();
    }
  }, [videoRef, stopCamera]);

  const handleAnalyze = useCallback(async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
        const base64String = image!.split(',')[1];
        const analysisResult = await analyzeCropImage(base64String, file.type);
        setResult(analysisResult);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
        setIsLoading(false);
    }
  }, [file, image]);

  if (isCameraOpen) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-4">
        <p className="text-white text-lg absolute top-4 animate-pulse">Point your camera at a crop leaf</p>
        <div className="relative w-full max-w-4xl aspect-video overflow-hidden rounded-lg shadow-2xl">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 flex justify-center items-center space-x-6">
          <Button onClick={stopCamera} variant="outline" className="bg-white/20 border-white text-white hover:bg-white/30">Cancel</Button>
          <button onClick={captureImage} className="w-20 h-20 rounded-full bg-white ring-4 ring-white/50 focus:outline-none focus:ring-white transition-transform transform hover:scale-105" aria-label="Take Picture"></button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Crop Disease Detection</h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Upload or take a photo of a crop leaf, and our AI will analyze it for diseases and suggest treatments.
      </p>

      <Card className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700/50">
            {image ? (
              <img src={image} alt="Crop leaf" className="max-h-full max-w-full object-contain rounded-md" />
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p>Image preview will appear here</p>
              </div>
            )}
          </div>
          
          {image ? (
             <div className="flex flex-col sm:flex-row w-full gap-4">
                 <Button onClick={handleAnalyze} disabled={isLoading} className="flex-1">
                    {isLoading ? 'Analyzing...' : 'Analyze Image'}
                 </Button>
                 <Button onClick={resetState} variant="outline" className="flex-1">
                    Try Another
                 </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row w-full gap-4">
                <label htmlFor="file-upload" className="flex-1 cursor-pointer">
                  <div className="w-full text-center px-6 py-3 font-semibold rounded-lg shadow-sm focus:outline-none transition-transform transform hover:scale-105 duration-300 ease-in-out bg-transparent border border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center justify-center">
                    <UploadIcon />
                    Upload from Device
                  </div>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                </label>
                <Button onClick={startCamera} variant="secondary" className="flex-1 flex items-center justify-center">
                    <CameraIcon />
                    Use Camera
                </Button>
            </div>
          )}
        </div>
      </Card>
      
      {error && !isCameraOpen && (
        <Card className="max-w-2xl mx-auto border-l-4 border-red-500">
            <p className="text-red-700 dark:text-red-400 font-semibold">Error:</p>
            <p className="text-red-600 dark:text-red-300">{error}</p>
        </Card>
      )}

      {result && (
        <Card className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>
          {result.isHealthy ? (
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700">
              <h3 className="text-lg font-semibold">Plant Appears Healthy</h3>
              <p>No significant disease detected in the provided image.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Disease Name</h3>
                <p className="text-lg font-semibold text-primary-700 dark:text-primary-300">{result.diseaseName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Confidence</h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-secondary-500 h-2.5 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                </div>
                <p className="text-right text-sm font-semibold">{result.confidence}%</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recommended Treatment</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{result.treatment}</p>
              </div>
            </div>
          )}
        </Card>
      )}

    </div>
  );
};

export default DiseaseDetectionPage;
