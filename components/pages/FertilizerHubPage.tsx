import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useLanguage } from '../LanguageProvider';
import { getFertilizerComparison, getNutrientGuide } from '../../services/geminiService';
import { FertilizerDirectComparisonResult, FertilizerNutrientGuide } from '../../types';
import { NUTRIENT_TYPES } from '../../constants';

// --- ICONS ---
const ToolIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const SummaryIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const GuideIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;

// --- SKELETON COMPONENTS ---

const ComparisonSkeleton: React.FC = () => (
    <div className="mt-8 animate-pulse space-y-8">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        <Card className="p-0">
            <div className="space-y-px">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                <div className="h-12 bg-gray-100 dark:bg-gray-800"></div>
                <div className="h-12 bg-gray-100 dark:bg-gray-800"></div>
                <div className="h-12 bg-gray-100 dark:bg-gray-800"></div>
                <div className="h-12 bg-gray-100 dark:bg-gray-800"></div>
                <div className="h-12 bg-gray-100 dark:bg-gray-800"></div>
                <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-b-lg"></div>
            </div>
        </Card>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
);

const GuideSkeleton: React.FC = () => (
    <Card className="mt-6 animate-pulse">
        <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
        </div>
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
             <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-3"></div>
             <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
             <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
        </div>
    </Card>
);

// --- MAIN PAGE ---

const FertilizerHubPage: React.FC = () => {
    const { t } = useLanguage();
    
    // State for Comparison Tool
    const [fertilizer1, setFertilizer1] = useState('Urea');
    const [fertilizer2, setFertilizer2] = useState('DAP');
    const [comparisonResult, setComparisonResult] = useState<FertilizerDirectComparisonResult | null>(null);
    const [isComparing, setIsComparing] = useState(false);
    const [comparisonError, setComparisonError] = useState<string | null>(null);

    // State for Nutrient Guide
    const [selectedNutrient, setSelectedNutrient] = useState<string | null>(null);
    const [nutrientGuide, setNutrientGuide] = useState<FertilizerNutrientGuide | null>(null);
    const [isGuideLoading, setIsGuideLoading] = useState(false);
    const [guideError, setGuideError] = useState<string | null>(null);

    const handleComparisonSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fertilizer1 || !fertilizer2) return;
        setIsComparing(true);
        setComparisonError(null);
        setComparisonResult(null);

        try {
            const result = await getFertilizerComparison(fertilizer1, fertilizer2);
            if (result.comparison.length < 2) {
                throw new Error("Could not get a valid comparison from the AI.");
            }
            setComparisonResult(result);
        } catch (err: any) {
            setComparisonError(t(err.message) || 'An unknown error occurred.');
        } finally {
            setIsComparing(false);
        }
    };

    const handleNutrientSelect = async (nutrient: string) => {
        if (selectedNutrient === nutrient && nutrientGuide) {
            // If the same nutrient is clicked again, collapse the view.
            setSelectedNutrient(null);
            setNutrientGuide(null);
            return;
        }
        setSelectedNutrient(nutrient);
        setIsGuideLoading(true);
        setGuideError(null);
        setNutrientGuide(null);

        try {
            const result = await getNutrientGuide(nutrient);
            setNutrientGuide(result);
        } catch (err: any) {
            setGuideError(t(err.message) || 'An unknown error occurred.');
        } finally {
            setIsGuideLoading(false);
        }
    };

    const comparisonFeatures = [
        { key: 'nutrientContent', label: t('fertilizer.results.nutrientContent')},
        { key: 'price', label: t('fertilizer.results.price')},
        { key: 'releaseSpeed', label: t('fertilizer.results.releaseSpeed')},
        { key: 'applicationMethod', label: t('fertilizer.results.application')},
        { key: 'soilImpact', label: t('fertilizer.results.soilImpact')},
        { key: 'bestFor', label: t('fertilizer.results.bestFor')},
    ] as const;
    
    return (
        <div className="space-y-16 max-w-5xl mx-auto">
            <header className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">{t('fertilizer.title')}</h1>
            </header>

            {/* Comparison Tool Section */}
            <section aria-labelledby="comparison-tool-title">
                <div className="text-center">
                    <h2 id="comparison-tool-title" className="text-3xl font-bold mb-4 flex items-center justify-center text-gray-900 dark:text-white">
                        <ToolIcon />
                        {t('fertilizer.tool.title')}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        {t('fertilizer.tool.desc')}
                    </p>
                </div>

                <Card>
                    <form onSubmit={handleComparisonSubmit} className="space-y-4 md:space-y-0 md:flex md:items-end md:gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex-1">
                            <label htmlFor="fertilizer1" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('fertilizer.tool.input1_label')}</label>
                            <input type="text" id="fertilizer1" value={fertilizer1} onChange={e => setFertilizer1(e.target.value)} placeholder={t('fertilizer.tool.input1_placeholder')} className="mt-1 w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                        </div>
                         <div className="flex-1">
                            <label htmlFor="fertilizer2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('fertilizer.tool.input2_label')}</label>
                            <input type="text" id="fertilizer2" value={fertilizer2} onChange={e => setFertilizer2(e.target.value)} placeholder={t('fertilizer.tool.input2_placeholder')} className="mt-1 w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                        </div>
                        <Button type="submit" disabled={isComparing} className="w-full md:w-auto px-8 py-3 shrink-0">
                            {isComparing ? t('fertilizer.tool.loading') : t('fertilizer.tool.button')}
                        </Button>
                    </form>

                    {isComparing && <ComparisonSkeleton />}
                    {comparisonError && <div className="mt-6 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4"><p className="text-red-700 dark:text-red-300 font-semibold">{t('error')}:</p><p className="text-red-600 dark:text-red-400">{comparisonError}</p></div>}
                    
                    {comparisonResult && (
                        <div className="mt-8 space-y-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{t('fertilizer.results.title', { name1: comparisonResult.comparison[0].productName, name2: comparisonResult.comparison[1].productName })}</h3>
                            <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-sm text-left text-gray-500 dark:text-gray-400"><thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300"><tr><th scope="col" className="px-6 py-3 rounded-l-lg w-1/4">{t('fertilizer.results.feature')}</th><th scope="col" className="px-6 py-3 text-center">{comparisonResult.comparison[0].productName}</th><th scope="col" className="px-6 py-3 rounded-r-lg text-center">{comparisonResult.comparison[1].productName}</th></tr></thead><tbody>{comparisonFeatures.map(({ key, label }) => (<tr key={key} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700"><th scope="row" className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap dark:text-white">{label}</th><td className="px-6 py-4">{comparisonResult.comparison[0][key]}</td><td className="px-6 py-4">{comparisonResult.comparison[1][key]}</td></tr>))}</tbody></table></div>
                            <Card className="bg-green-50 dark:bg-gray-700/50"><h3 className="text-2xl font-bold mb-4 flex items-center text-gray-900 dark:text-white"><SummaryIcon />{t('fertilizer.recommendation.title')}</h3><div className="space-y-2 text-gray-700 dark:text-gray-300"><p className="text-lg"><span className="font-semibold text-gray-800 dark:text-gray-200">{t('fertilizer.recommendation.winner')}: </span><span className="font-bold text-green-700 dark:text-green-300">{comparisonResult.recommendation.winner}</span></p><p className="pt-2 border-t border-green-200 dark:border-gray-600">{comparisonResult.recommendation.reasoning}</p></div></Card>
                        </div>
                    )}
                </Card>
            </section>

            {/* Nutrient Guide Section */}
            <section aria-labelledby="nutrient-guide-title">
                <div className="text-center">
                     <h2 id="nutrient-guide-title" className="text-3xl font-bold mb-4 flex items-center justify-center text-gray-900 dark:text-white">
                        <GuideIcon />
                        {t('fertilizer.guide.title')}
                    </h2>
                     <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        {t('fertilizer.guide.desc')}
                    </p>
                </div>

                <Card>
                    <div className="flex flex-wrap justify-center gap-3 p-4">
                        {NUTRIENT_TYPES.map(nutrient => (
                            <button key={nutrient} onClick={() => handleNutrientSelect(nutrient)} className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${selectedNutrient === nutrient ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}>
                                {isGuideLoading && selectedNutrient === nutrient ? t('fertilizer.guide.button.loading') : nutrient}
                            </button>
                        ))}
                    </div>
                    
                    {isGuideLoading && <GuideSkeleton />}
                    {guideError && <div className="mt-6 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4"><p className="text-red-700 dark:text-red-300 font-semibold">{t('error')}:</p><p className="text-red-600 dark:text-red-400">{guideError}</p></div>}
                    
                    {nutrientGuide && !isGuideLoading && (
                        <Card className="mt-6 bg-gray-50 dark:bg-gray-900/50">
                            <h3 className="text-2xl font-bold text-primary-700 dark:text-primary-300 mb-4">{nutrientGuide.nutrientName}</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('fertilizer.guide.role')}</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{nutrientGuide.roleInPlants}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('fertilizer.guide.sources')}</h4>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {nutrientGuide.commonFertilizers.map(f => <span key={f} className="px-3 py-1 text-sm bg-secondary-100 text-secondary-800 dark:bg-secondary-900/50 dark:text-secondary-200 rounded-full">{f}</span>)}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('fertilizer.guide.application')}</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{nutrientGuide.applicationTips}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('fertilizer.guide.symptoms')}</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{nutrientGuide.deficiencySymptoms}</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </Card>
            </section>
        </div>
    );
};

export default FertilizerHubPage;