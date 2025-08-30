import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { getCropRecommendation, CropRecommendationParams } from '../../services/geminiService';
import { CropRecommendationResult } from '../../types';
import { INDIAN_STATES } from '../../constants';
import { useLanguage } from '../LanguageProvider';

// Icons for the results display
const CheckCircleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LightBulbIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary-500 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;

const ResultSkeleton: React.FC = () => (
    <Card className="mt-8 animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
        </div>
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        </div>
    </Card>
);

type Rating = 'High' | 'Moderate' | 'Low';
type Metric = 'marketValue' | 'waterRequirement' | 'pestResistance';

const getRatingClass = (metric: Metric, value: Rating): string => {
    const valueMap: { [key in Rating]: 'green' | 'yellow' | 'red' } = { High: 'green', Moderate: 'yellow', Low: 'red' };
    const goodIsHigh: Metric[] = ['marketValue', 'pestResistance'];

    let color: 'green' | 'yellow' | 'red' = 'yellow';
    if (goodIsHigh.includes(metric)) {
        color = valueMap[value];
    } else { // goodIsLow, e.g., waterRequirement
        const invertedMap: { [key in Rating]: 'green' | 'yellow' | 'red' } = { High: 'red', Moderate: 'yellow', Low: 'green' };
        color = invertedMap[value];
    }

    const classes = {
        green: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
        yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
        red: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
    };
    return `px-2 py-0.5 text-xs font-semibold rounded-full inline-block text-center min-w-[70px] ${classes[color]}`;
};


const ComparisonView: React.FC<{ analysis: CropRecommendationResult['comparativeAnalysis'] }> = ({ analysis }) => {
    const { t } = useLanguage();
    return (
        <div>
            <h3 className="text-xl font-bold mb-4 dark:text-white">{t('crop.result.comparison')}</h3>
            {/* Table for larger screens */}
            <div className="hidden md:block">
                <Card className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('crop.comparison.crop')}</th>
                                <th scope="col" className="px-6 py-3">{t('crop.comparison.marketValue')}</th>
                                <th scope="col" className="px-6 py-3">{t('crop.comparison.water')}</th>
                                <th scope="col" className="px-6 py-3">{t('crop.comparison.pest')}</th>
                                <th scope="col" className="px-6 py-3">{t('crop.comparison.notes')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analysis.map(crop => (
                                <tr key={crop.cropName} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap dark:text-white">{crop.cropName}</th>
                                    <td className="px-6 py-4"><span className={getRatingClass('marketValue', crop.marketValue)}>{crop.marketValue}</span></td>
                                    <td className="px-6 py-4"><span className={getRatingClass('waterRequirement', crop.waterRequirement)}>{crop.waterRequirement}</span></td>
                                    <td className="px-6 py-4"><span className={getRatingClass('pestResistance', crop.pestResistance)}>{crop.pestResistance}</span></td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{crop.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
            {/* Cards for smaller screens */}
            <div className="md:hidden space-y-4">
                {analysis.map(crop => (
                    <Card key={crop.cropName}>
                        <h4 className="text-lg font-bold dark:text-white">{crop.cropName}</h4>
                        <div className="mt-3 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-600 dark:text-gray-300">{t('crop.comparison.marketValue')}</span>
                                <span className={getRatingClass('marketValue', crop.marketValue)}>{crop.marketValue}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-600 dark:text-gray-300">{t('crop.comparison.water')}</span>
                                <span className={getRatingClass('waterRequirement', crop.waterRequirement)}>{crop.waterRequirement}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-600 dark:text-gray-300">{t('crop.comparison.pest')}</span>
                                <span className={getRatingClass('pestResistance', crop.pestResistance)}>{crop.pestResistance}</span>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 border-t pt-3 dark:border-gray-600">{crop.notes}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const CropRecommendationPage: React.FC = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<CropRecommendationParams>({
        state: 'Maharashtra',
        district: 'Pune',
        soilColor: 'Black',
        soilTexture: 'Sticky (Clay)',
        rainfall: 'Moderate (750-1150mm)',
    });
    const [result, setResult] = useState<CropRecommendationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const recommendation = await getCropRecommendation(formData);
            setResult(recommendation);
        } catch (err: any) {
            setError(t(err.message) || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const commonInputClasses = "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md";
    const commonLabelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('crop.title')}</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                    {t('crop.subtitle')}
                </p>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="state" className={commonLabelClasses}>{t('crop.form.state')}</label>
                            <select id="state" name="state" value={formData.state} onChange={handleInputChange} className={commonInputClasses} required>
                                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="district" className={commonLabelClasses}>{t('crop.form.district')}</label>
                            <input type="text" name="district" id="district" value={formData.district} onChange={handleInputChange} className={commonInputClasses} required />
                        </div>
                        <div>
                            <label htmlFor="soilColor" className={commonLabelClasses}>{t('crop.form.soilColor')}</label>
                            <select id="soilColor" name="soilColor" value={formData.soilColor} onChange={handleInputChange} className={commonInputClasses} required>
                                <option>Black</option>
                                <option>Red</option>
                                <option>Brown / Loamy</option>
                                <option>Light Brown / Sandy</option>
                                <option>Grey</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="soilTexture" className={commonLabelClasses}>{t('crop.form.soilTexture')}</label>
                            <select id="soilTexture" name="soilTexture" value={formData.soilTexture} onChange={handleInputChange} className={commonInputClasses} required>
                                <option>Sticky (Clay)</option>
                                <option>Gritty (Sandy)</option>
                                <option>Smooth / Powdery (Silt)</option>
                                <option>Balanced (Loam)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="rainfall" className={commonLabelClasses}>{t('crop.form.rainfall')}</label>
                            <select id="rainfall" name="rainfall" value={formData.rainfall} onChange={handleInputChange} className={commonInputClasses} required>
                                <option>Low / Arid (&lt; 750mm)</option>
                                <option>Moderate (750-1150mm)</option>
                                <option>High (&gt; 1150mm)</option>
                                <option>Very High / Tropical (&gt; 2000mm)</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-2 flex justify-center">
                        <Button type="submit" disabled={isLoading} className="w-full md:w-auto px-12">
                            {isLoading ? t('crop.button.loading') : t('crop.button.submit')}
                        </Button>
                    </div>
                </form>
            </Card>

            {isLoading && <ResultSkeleton />}

            {error && (
                <Card className="mt-8 border-l-4 border-red-500 dark:bg-red-900/20">
                    <p className="text-red-700 dark:text-red-300 font-semibold">{t('error')}:</p>
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </Card>
            )}

            {result && (
                <Card className="mt-8">
                    <h2 className="text-2xl font-bold mb-2 dark:text-white">{t('crop.result.title')}</h2>
                    <div className="bg-primary-50 dark:bg-gray-700/50 p-6 rounded-xl border border-primary-200 dark:border-gray-700">
                        <p className="text-sm font-semibold uppercase tracking-wide text-primary-800 dark:text-primary-300">{t('crop.result.bestCrop')}</p>
                        <p className="text-4xl font-extrabold text-primary-600 dark:text-primary-400 mt-1">{result.recommendedCrop}</p>
                        <p className="mt-4 text-gray-700 dark:text-gray-300">{result.reasoning}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                        <div>
                           <h3 className="text-lg font-semibold mb-3 flex items-center dark:text-white"><CheckCircleIcon /> {t('crop.result.alternatives')}</h3>
                           <div className="space-y-3">
                                {result.alternativeCrops.map(crop => (
                                    <div key={crop.name} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{crop.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{crop.reason}</p>
                                    </div>
                                ))}
                           </div>
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold mb-3 flex items-center dark:text-white"><LightBulbIcon /> {t('crop.result.tips')}</h3>
                           <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                                {result.soilManagementTips.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                ))}
                           </ul>
                        </div>
                    </div>

                    {result.comparativeAnalysis && result.comparativeAnalysis.length > 0 && (
                        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                            <ComparisonView analysis={result.comparativeAnalysis} />
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default CropRecommendationPage;