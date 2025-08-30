import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { CROP_TYPES, SOIL_TYPES, CROP_YEARS } from '../../constants';
import { getWeatherForecast } from '../../services/weatherService';
import { WeatherData, Page } from '../../types';
import { useLanguage } from '../LanguageProvider';
import { useTheme } from '../ThemeProvider';

// --- ICONS ---
const YieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const HectareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>;
const IncomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1h4v1m-4 0h-4v-1h4m0-4h-4v1h4m0 4h4v-1h-4m-2.599 5.599A1.992 1.992 0 0012 16v-1m0 1v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16h-4v1h4m0-1h4v1h-4" /></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

// --- REUSABLE COMPONENTS ---
const KpiCard = ({ title, value, icon, unit }: { title: string, value: string, icon: React.ReactNode, unit?: string }) => (
    <Card className="flex items-center p-4">
        <div className="bg-primary-100 dark:bg-gray-700 p-3 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {value} <span className="text-base font-normal">{unit}</span>
            </p>
        </div>
    </Card>
);

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    cropType: 'Rice', soilType: 'Alluvial', landSize: 10,
    location: 'Punjab, India', cropYear: 2019, annualRainfall: 1200,
    fertilizerUsage: 150, pesticideUsage: 2.5,
  });
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: e.target.type === 'number' ? parseFloat(value) : value }));
  };
  
  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setPrediction(null); setWeatherError(null); setWeatherData(null); setIsWeatherLoading(true);
    
    getWeatherForecast(formData.location)
      .then(forecast => setWeatherData(forecast))
      .catch((error: any) => setWeatherError(error.message || 'Could not fetch weather data.'))
      .finally(() => setIsWeatherLoading(false));
    
    setTimeout(() => {
      const baseYields: { [key: string]: number } = {'Rice': 4.5, 'Wheat': 3.8, 'Maize': 6.0, 'Sugarcane': 80, 'Cotton': 2.5, 'Soybean': 2.2, 'Potato': 25, 'Pulses': 1.0, 'Oilseeds': 1.2};
      const soilFactors: { [key: string]: number } = {'Alluvial': 1.1, 'Black': 1.05, 'Red': 0.95, 'Laterite': 0.9, 'Desert': 0.7, 'Mountain': 0.8};
      
      const rainfallFactor = formData.annualRainfall < 800 ? 0.8 : formData.annualRainfall > 2000 ? 0.9 : formData.annualRainfall > 1500 ? 1.05 : formData.annualRainfall > 1000 ? 1.1 : 1.0;
      const fertilizerFactor = formData.fertilizerUsage < 100 ? 0.9 : formData.fertilizerUsage > 250 ? 0.95 : formData.fertilizerUsage > 180 ? 1.05 : formData.fertilizerUsage > 120 ? 1.15 : 1.0;
      const pesticideFactor = formData.pesticideUsage > 5 ? 0.9 : formData.pesticideUsage > 3 ? 0.95 : 1.0;

      const baseYield = baseYields[formData.cropType] || 3.0;
      const soilFactor = soilFactors[formData.soilType] || 1.0;
      const yieldPerHectare = baseYield * soilFactor * rainfallFactor * fertilizerFactor * pesticideFactor * (Math.random() * 0.15 + 0.9);
      const predictedYield = (yieldPerHectare * formData.landSize);
      const pricePerTonne = {'Sugarcane': 3500, 'Potato': 15000, 'Cotton': 60000}[formData.cropType] || 22000;
      const estimatedIncome = predictedYield * pricePerTonne;

      const marketPrices = [
          { city: 'Delhi', price: pricePerTonne * (1 + (Math.random() - 0.5) * 0.1) },
          { city: 'Mumbai', price: pricePerTonne * (1 + (Math.random() - 0.5) * 0.15) },
          { city: 'Kolkata', price: pricePerTonne * (1 + (Math.random() - 0.5) * 0.08) },
      ];

      const alerts = [];
      if (formData.annualRainfall < 1000) alerts.push({ text: 'Low rainfall detected. Consider supplementary irrigation.', type: 'warning'});
      if (formData.fertilizerUsage > 220) alerts.push({ text: 'High fertilizer usage may affect soil health long-term.', type: 'info'});
      else alerts.push({text: 'Fertilizer levels seem optimal. Monitor crop response.', type: 'success'});
      if (formData.pesticideUsage > 4) alerts.push({ text: 'High pesticide usage detected. Explore integrated pest management.', type: 'warning'});

      setPrediction({
        predictedYield: predictedYield.toFixed(2),
        yieldPerHectare: yieldPerHectare.toFixed(2),
        estimatedIncome: estimatedIncome.toFixed(0),
        marketPrices,
        alerts,
        resourceUsage: {
            fertilizer: { user: formData.fertilizerUsage, recommended: 160 },
            pesticide: { user: formData.pesticideUsage, recommended: 2.0 },
        },
      });
      setIsLoading(false);
    }, 1500);
  };
  
  const yieldForecastData = useMemo(() => prediction ? [
      { name: 'Jan-Mar', yield: 0 }, { name: 'Apr-Jun', yield: (prediction.predictedYield * 0.2).toFixed(2) },
      { name: 'Jul-Sep', yield: (prediction.predictedYield * 0.8).toFixed(2) }, { name: 'Oct-Dec', yield: prediction.predictedYield }
    ] : [], [prediction]);

  const soilConditionData = useMemo(() => [
    { subject: 'Nitrogen', A: 75 + Math.random() * 20, fullMark: 100 },
    { subject: 'Phosphorus', A: 80 + Math.random() * 15, fullMark: 100 },
    { subject: 'Potassium', A: 70 + Math.random() * 20, fullMark: 100 },
    { subject: 'pH Level', A: 60 + Math.random() * 15, fullMark: 100 },
    { subject: 'Moisture', A: 85 + Math.random() * 10, fullMark: 100 },
  ], [prediction]);
  
  const commonInputClasses = "mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md";
  const commonLabelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  const renderSkeleton = () => (
    <div className="space-y-6 mt-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t(Page.Dashboard)}</h1>
      
      <Card>
        <form onSubmit={handlePredict} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div><label htmlFor="cropType" className={commonLabelClasses}>{t('dashboard.form.cropType')}</label><select id="cropType" name="cropType" value={formData.cropType} onChange={handleInputChange} className={commonInputClasses}>{CROP_TYPES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label htmlFor="soilType" className={commonLabelClasses}>{t('dashboard.form.soilType')}</label><select id="soilType" name="soilType" value={formData.soilType} onChange={handleInputChange} className={commonInputClasses}>{SOIL_TYPES.map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label htmlFor="landSize" className={commonLabelClasses}>{t('dashboard.form.landSize')}</label><input type="number" name="landSize" id="landSize" value={formData.landSize} onChange={handleInputChange} className={commonInputClasses} step="0.1" min="0" /></div>
            <div><label htmlFor="location" className={commonLabelClasses}>{t('dashboard.form.location')}</label><input type="text" name="location" id="location" value={formData.location} onChange={handleInputChange} className={commonInputClasses} /></div>
            <div><label htmlFor="cropYear" className={commonLabelClasses}>{t('dashboard.form.cropYear')}</label><select id="cropYear" name="cropYear" value={formData.cropYear} onChange={handleInputChange} className={commonInputClasses}>{CROP_YEARS.map(y => <option key={y}>{y}</option>)}</select></div>
            <div><label htmlFor="annualRainfall" className={commonLabelClasses}>{t('dashboard.form.rainfall')}</label><input type="number" name="annualRainfall" id="annualRainfall" value={formData.annualRainfall} onChange={handleInputChange} className={commonInputClasses} step="50" min="0" /></div>
            <div><label htmlFor="fertilizerUsage" className={commonLabelClasses}>{t('dashboard.form.fertilizer')}</label><input type="number" name="fertilizerUsage" id="fertilizerUsage" value={formData.fertilizerUsage} onChange={handleInputChange} className={commonInputClasses} step="10" min="0" /></div>
            <div><label htmlFor="pesticideUsage" className={commonLabelClasses}>{t('dashboard.form.pesticide')}</label><input type="number" name="pesticideUsage" id="pesticideUsage" value={formData.pesticideUsage} onChange={handleInputChange} className={commonInputClasses} step="0.1" min="0" /></div>
          </div>
          <div className="pt-2 flex justify-center">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto px-12">
              {isLoading ? t('dashboard.button.loading') : t('dashboard.button.submit')}
            </Button>
          </div>
        </form>
      </Card>

      {isLoading && renderSkeleton()}

      {prediction && !isLoading && (
        <div className="space-y-6 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KpiCard title={t('dashboard.kpi.yield')} value={prediction.predictedYield} unit={t('dashboard.kpi.yield.unit')} icon={<YieldIcon />} />
            <KpiCard title={t('dashboard.kpi.yieldPerHectare')} value={prediction.yieldPerHectare} unit={t('dashboard.kpi.yieldPerHectare.unit')} icon={<HectareIcon />} />
            <KpiCard title={t('dashboard.kpi.income')} value={`₹ ${Number(prediction.estimatedIncome).toLocaleString('en-IN')}`} icon={<IncomeIcon />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('dashboard.chart.yield.title')}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={yieldForecastData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "rgba(128, 128, 128, 0.3)" : "rgba(128, 128, 128, 0.3)"} /><XAxis dataKey="name" tick={{ fill: isDarkMode ? '#A0AEC0' : '#4A5568' }} /><YAxis tick={{ fill: isDarkMode ? '#A0AEC0' : '#4A5568' }} /><Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#2D3748' : '#FFFFFF', border: '1px solid #4A5568' }} /><Legend wrapperStyle={{ color: isDarkMode ? '#FFFFFF' : '#000000' }} /><Line type="monotone" dataKey="yield" name="Yield (Tonnes)" stroke="#16a34a" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('dashboard.chart.resource.title')}</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                        { name: 'Fertilizer (kg/ha)', [t('yourUsage')]: prediction.resourceUsage.fertilizer.user, [t('recommended')]: prediction.resourceUsage.fertilizer.recommended },
                        { name: 'Pesticide (L/ha)', [t('yourUsage')]: prediction.resourceUsage.pesticide.user, [t('recommended')]: prediction.resourceUsage.pesticide.recommended },
                    ]} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "rgba(128, 128, 128, 0.2)" : "rgba(128, 128, 128, 0.2)"} />
                        <XAxis type="number" tick={{ fill: isDarkMode ? '#A0AEC0' : '#4A5568' }} />
                        <YAxis type="category" dataKey="name" width={120} tick={{ fill: isDarkMode ? '#A0AEC0' : '#4A5568' }} />
                        <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#2D3748' : '#FFFFFF', border: '1px solid #4A5568' }} cursor={{fill: isDarkMode ? '#4A5568' : '#E2E8F0' }} />
                        <Legend wrapperStyle={{ color: isDarkMode ? '#FFFFFF' : '#000000' }} />
                        <Bar dataKey={t('yourUsage')} fill="#fbbf24" />
                        <Bar dataKey={t('recommended')} fill="#16a34a" />
                    </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
               <Card>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{t('dashboard.alerts.title')}</h3>
                    <div className="space-y-3">
                        {prediction.alerts.map((alert: any, index: number) => (
                           <div key={index} className={`p-3 rounded-lg flex items-start ${alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/30' : 'bg-green-50 dark:bg-green-900/30'}`}>
                               <AlertIcon />
                               <p className={`text-sm ${alert.type === 'warning' ? 'text-yellow-800 dark:text-yellow-300' : 'text-green-800 dark:text-green-300'}`}>{alert.text}</p>
                           </div>
                        ))}
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{t('dashboard.market.title')} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{t('dashboard.market.subtitle')}</span></h3>
                    <div className="space-y-2">
                        {prediction.marketPrices.map((market: any, index: number) => (
                            <div key={index} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="font-medium text-gray-700 dark:text-gray-300">{market.city}</span>
                                <span className="font-semibold text-gray-900 dark:text-white">₹ {Math.round(market.price).toLocaleString('en-IN')} / Tonne</span>
                            </div>
                        ))}
                    </div>
                </Card>
               <Card>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('dashboard.weather.title')}</h3>
                <div className="min-h-[120px] flex items-center justify-center">
                    {isWeatherLoading && <p className="text-gray-500 dark:text-gray-400">{t('dashboard.weather.loading')}</p>}
                    {weatherError && <p className="text-red-500 text-center">{weatherError}</p>}
                    {weatherData && (
                        <div className="flex justify-around w-full">
                            {weatherData.map(w => (
                                <div key={w.day} className="text-center p-1">
                                    <p className="font-semibold text-sm">{w.day}</p>
                                    <p className="text-3xl my-1">{w.icon}</p>
                                    <p className="text-md">{w.temp}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
               </Card>
               <Card>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('dashboard.soil.title')}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={soilConditionData}>
                        <PolarGrid stroke={isDarkMode ? "rgba(128, 128, 128, 0.3)" : "rgba(128, 128, 128, 0.3)"} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? '#A0AEC0' : '#4A5568' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: isDarkMode ? '#A0AEC0' : '#4A5568' }} />
                        <Radar name="Condition" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                      </RadarChart>
                  </ResponsiveContainer>
               </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;