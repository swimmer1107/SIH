
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { CROP_TYPES, SOIL_TYPES } from '../../constants';

const DashboardPage: React.FC = () => {
  const [formData, setFormData] = useState({
    cropType: 'Rice',
    soilType: 'Alluvial',
    landSize: 10,
    location: 'Punjab, India',
  });
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const baseYield = formData.cropType === 'Rice' ? 4.5 : (formData.cropType === 'Wheat' ? 3.5 : 2.5);
      const predictedYield = (baseYield * formData.landSize * (Math.random() * 0.4 + 0.8)).toFixed(2);
      const estimatedIncome = (parseFloat(predictedYield) * (formData.cropType === 'Rice' ? 20000 : 18000)).toFixed(0);

      setPrediction({
        predictedYield,
        estimatedIncome,
        fertilizer: { N: '120kg/ha', P: '60kg/ha', K: '40kg/ha' },
        irrigation: '5-6 irrigations at critical stages',
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

  const weatherData = [
    { day: 'Today', temp: '32°C', icon: '☀️', condition: 'Sunny' },
    { day: 'Tomorrow', temp: '30°C', icon: '⛅️', condition: 'Partly Cloudy' },
    { day: '+2 Days', temp: '28°C', icon: '🌦️', condition: 'Light Rain' },
    { day: '+3 Days', temp: '31°C', icon: '☀️', condition: 'Sunny' },
    { day: '+4 Days', temp: '29°C', icon: '☁️', condition: 'Cloudy' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prediction Dashboard</h1>
      
      <Card>
        <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          <div>
            <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Crop Type</label>
            <select id="cropType" name="cropType" value={formData.cropType} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
              {CROP_TYPES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="soilType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Soil Type</label>
            <select id="soilType" name="soilType" value={formData.soilType} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
              {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="landSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Land Size (in Hectares)</label>
            <input type="number" name="landSize" id="landSize" value={formData.landSize} onChange={handleInputChange} className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md" />
          </div>
          <div className="lg:col-span-1">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <input type="text" name="location" id="location" value={formData.location} onChange={handleInputChange} className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md" />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Predicting...' : 'Get Prediction'}
          </Button>
        </form>
      </Card>

      {prediction && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
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
          </div>

          <div className="space-y-8">
             <Card>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Weather Forecast</h3>
                <div className="flex justify-between space-x-2">
                    {weatherData.map(w => (
                        <div key={w.day} className="flex-1 text-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                            <p className="font-semibold text-sm">{w.day}</p>
                            <p className="text-4xl my-2">{w.icon}</p>
                            <p className="text-lg">{w.temp}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{w.condition}</p>
                        </div>
                    ))}
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
