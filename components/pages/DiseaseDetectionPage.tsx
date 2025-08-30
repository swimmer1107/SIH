
import React, { useState, useCallback, ChangeEvent } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { analyzeCropImage } from '../../services/geminiService';
import { DiseaseResult } from '../../types';

const DiseaseDetectionPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(uploadedFile);
      setResult(null);
      setError(null);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const analysisResult = await analyzeCropImage(base64String, file.type);
        setResult(analysisResult);
        setIsLoading(false);
      };
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
      setIsLoading(false);
    }
  }, [file]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Crop Disease Detection</h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Upload a clear photo of a crop leaf, and our AI will analyze it for common diseases and suggest treatments.
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
          <div className="flex flex-col sm:flex-row w-full gap-4">
            <label htmlFor="file-upload" className="flex-1 cursor-pointer">
              <div className="w-full text-center px-6 py-3 font-semibold rounded-lg shadow-sm focus:outline-none transition-transform transform hover:scale-105 duration-300 ease-in-out bg-transparent border border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20">
                Choose Image
              </div>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
            </label>
            <Button onClick={handleAnalyze} disabled={!image || isLoading} className="flex-1">
              {isLoading ? 'Analyzing...' : 'Analyze Image'}
            </Button>
          </div>
        </div>
      </Card>
      
      {error && (
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
