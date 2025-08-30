
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { CROP_TYPES, SOIL_TYPES, CROP_YEARS } from '../../constants';
import { getWeatherForecast } from '../../services/weatherService';
import { WeatherData } from '../../types';

const DashboardPage: React.FC = () => {
  const [formData, setFormData] = useState({
    cropType: 'Rice',
    soilType: 'Alluvial',
    landSize: 10,
    location: 'Punjab, India',
    cropYear: 2019,
    annualRainfall: 1200, // in mm
    fertilizerUsage: 150, // in kg/ha
    pesticideUsage: 2.5, // in L/ha
  });
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumberInput = e.target.type === 'number';
    setFormData(prev => ({ ...prev, [name]: isNumberInput ? parseFloat(value) : value }));
  };
  
  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);
    setWeatherError(null);
    setWeatherData(null);
    
    setIsWeatherLoading(true);
    // Fetch weather data, but don't let it block the prediction simulation.
    // Handle success and error states independently.
    try {
        const forecast = await getWeatherForecast(formData.location);
        setWeatherData(forecast);
    } catch (error: any) {
        setWeatherError(error.message || 'Could not fetch weather data.');
    } finally {
        setIsWeatherLoading(false);
    }
    
    // Simulate API call for prediction
    setTimeout(() => {
      const baseYields: { [key: string]: number } = {
        'Rice': 4.5, 'Wheat': 3.8, 'Maize': 6.0, 'Sugarcane': 80, 'Cotton': 2.5, 
        'Soybean': 2.2, 'Potato': 25, 'Pulses': 1.0, 'Oilseeds': 1.2
      };
      const soilFactors: { [key: string]: number } = {
        'Alluvial': 1.1, 'Black': 1.05, 'Red': 0.95, 'Laterite': 0.9, 'Desert': 0.7, 'Mountain': 0.8
      };
      const rainfall = formData.annualRainfall;
      let rainfallFactor = 1.0;
      if (rainfall < 800) rainfallFactor = 0.8;
      else if (rainfall > 2000) rainfallFactor = 0.9;
      else if (rainfall > 1500) rainfallFactor = 1.05;
      else if (rainfall > 1000) rainfallFactor = 1.1;
      const fertilizer = formData.fertilizerUsage;
      let fertilizerFactor = 1.0;
      if (fertilizer < 100) fertilizerFactor = 0.9;
      else if (fertilizer > 250) fertilizerFactor = 0.95;
      else if (fertilizer > 180) fertilizerFactor = 1.05;
      else if (fertilizer > 120) fertilizerFactor = 1.15;
      const pesticide = formData.pesticideUsage;
      let pesticideFactor = 1.0;
      if (pesticide > 5) pesticideFactor = 0.9;
      else if (pesticide > 3) pesticideFactor = 0.95;

      const baseYield = baseYields[formData.cropType] || 3.0;
      const soilFactor = soilFactors[formData.soilType] || 1.0;
      const yieldPerHectare = baseYield * soilFactor * rainfallFactor * fertilizerFactor * pesticideFactor * (Math.random() * 0.15 + 0.9);
      const predictedYield = (yieldPerHectare * formData.landSize).toFixed(2);
      const pricePerTonne = formData.cropType === 'Sugarcane' ? 3000 : 20000;
      const estimatedIncome = (parseFloat(predictedYield) * pricePerTonne).toFixed(0);

      setPrediction({
        predictedYield,
        estimatedIncome,
        fertilizer: { N: `${(formData.fertilizerUsage * 0.5).toFixed(0)}kg/ha`, P: `${(formData.fertilizerUsage * 0.3).toFixed(0)}kg/ha`, K: `${(formData.fertilizerUsage * 0.2).toFixed(0)}kg/ha` },
        irrigation: rainfall < 1000 ? 'Additional irrigation recommended' : 'Sufficient rainfall, monitor soil moisture',
      });
      setIsLoading(false);
    }, 1500);
  };
  
  const yieldForecastData = useMemo(() => prediction ? [
      { name: 'Jan', yield: 0 }, { name: 'Feb', yield: 0 }, { name: 'Mar', yield: 0 },
      { name: 'Apr', yield: 0 }, { name: 'May', yield: 0 }, { name: 'Jun', yield: (prediction.predictedYield * 0.1).toFixed(2) },
      { name: 'Jul', yield: (prediction.predictedYield * 0.4).toFixed(2) }, { name: 'Aug', yield: (prediction.predictedYield * 0.8).toFixed(2) },
      { name: 'Sep', yield: (prediction.predictedYield * 1).toFixed(2) }, { name: 'Oct', yield: prediction.predictedYield },
      { name: 'Nov', yield: 0 }, { name: 'Dec', yield: 0 }
    ] : [], [prediction]);

  const soilConditionData = [
    { subject: 'Nitrogen', A: 85, fullMark: 100 },
    { subject: 'Phosphorus', A: 90, fullMark: 100 },
    { subject: 'Potassium', A: 75, fullMark: 100 },
    { subject: 'pH', A: 65, fullMark: 100 },
    { subject: 'Organic Matter', A: 80, fullMark: 100 },
    { subject: 'Moisture', A: 95, fullMark: 100 },
  ];

  const commonInputClasses = "mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md";
  const commonLabelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prediction Dashboard</h1>
      
      <Card>
        <form onSubmit={handlePredict} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label htmlFor="cropType" className={commonLabelClasses}>Crop Type</label>
              <select id="cropType" name="cropType" value={formData.cropType} onChange={handleInputChange} className={commonInputClasses}>
                {CROP_TYPES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="soilType" className={commonLabelClasses}>Soil Type</label>
              <select id="soilType" name="soilType" value={formData.soilType} onChange={handleInputChange} className={commonInputClasses}>
                {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="landSize" className={commonLabelClasses}>Land Size (Hectares)</label>
              <input type="number" name="landSize" id="landSize" value={formData.landSize} onChange={handleInputChange} className={commonInputClasses} step="0.1" min="0" />
            </div>
            <div>
              <label htmlFor="location" className={commonLabelClasses}>Location</label>
              <input type="text" name="location" id="location" value={formData.location} onChange={handleInputChange} className={commonInputClasses} />
            </div>
            <div>
              <label htmlFor="cropYear" className={commonLabelClasses}>Crop Year</label>
              <select id="cropYear" name="cropYear" value={formData.cropYear} onChange={handleInputChange} className={commonInputClasses}>
                {CROP_YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="annualRainfall" className={commonLabelClasses}>Annual Rainfall (mm)</label>
              <input type="number" name="annualRainfall" id="annualRainfall" value={formData.annualRainfall} onChange={handleInputChange} className={commonInputClasses} step="50" min="0" />
            </div>
            <div>
              <label htmlFor="fertilizerUsage" className={commonLabelClasses}>Fertilizer Usage (kg/ha)</label>
              <input type="number" name="fertilizerUsage" id="fertilizerUsage" value={formData.fertilizerUsage} onChange={handleInputChange} className={commonInputClasses} step="10" min="0" />
            </div>
             <div>
              <label htmlFor="pesticideUsage" className={commonLabelClasses}>Pesticide Usage (L/ha)</label>
              <input type="number" name="pesticideUsage" id="pesticideUsage" value={formData.pesticideUsage} onChange={handleInputChange} className={commonInputClasses} step="0.1" min="0" />
            </div>
          </div>
          <div className="pt-4 flex justify-center">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? 'Processing...' : 'Get Prediction'}
            </Button>
          </div>
        </form>
      </Card>

      {(isLoading || prediction || weatherData || weatherError) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="space-y-8">
             {isLoading && !prediction && (
                <Card>
                    <div className="flex flex-col items-center justify-center h-48">
                        <svg className="animate-spin h-8 w-8 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-600 dark:text-gray-400">Calculating yield prediction...</p>
                    </div>
                </Card>
            )}
            {prediction && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card>
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Predicted Yield</h3>
                    <p className="mt-1 text-3xl font-semibold text-primary-600 dark:text-primary-400">{prediction.predictedYield} Tonnes</p>
                  </Card>
                  <Card>
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Estimated Income</h3>
                    <p className="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">₹ {Number(prediction.estimatedIncome).toLocaleString('en-IN')}</p>
                  </Card>
                </div>
                <Card>
                    <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">Recommendations</h3>
                    <p><strong>Fertilizer:</strong> N: {prediction.fertilizer.N}, P: {prediction.fertilizer.P}, K: {prediction.fertilizer.K}</p>
                    <p><strong>Irrigation:</strong> {prediction.irrigation}</p>
                </Card>
                <Card>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Yield Forecast (Monthly)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={yieldForecastData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="yield" name="Yield (Tonnes)" stroke="#16a34a" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                    </ResponsiveContainer>
                </Card>
              </>
            )}
          </div>

          <div className="space-y-8">
             <Card>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Weather Forecast for {formData.location}</h3>
                <div className="flex items-center justify-center min-h-[150px]">
                    {isWeatherLoading && (
                         <div className="text-center">
                            <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-gray-600 dark:text-gray-400">Fetching live weather...</p>
                         </div>
                    )}
                    {weatherError && <p className="text-red-500 text-center">{weatherError}</p>}
                    {weatherData && (
                        <div className="flex justify-between space-x-2 w-full">
                            {weatherData.map(w => (
                                <div key={w.day} className="flex-1 text-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <p className="font-semibold text-sm">{w.day}</p>
                                    <p className="text-4xl my-2">{w.icon}</p>
                                    <p className="text-lg">{w.temp}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{w.condition}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
             </Card>
             <Card>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Soil Condition</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={soilConditionData}>
                    <PolarGrid stroke="rgba(128, 128, 128, 0.3)" />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar name="Condition" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                    </RadarChart>
                </ResponsiveContainer>
             </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
