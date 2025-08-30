import React, { useState, useRef, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useLanguage } from '../LanguageProvider';
import { getSatelliteAnalysis } from '../../services/geminiService';
import { getCoordinates } from '../../services/mapService';
import { SatelliteAnalysisResult, Coordinates } from '../../types';

// Declare Leaflet global object for TypeScript
declare const L: any;

// --- ICONS ---
const SatelliteIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.758 4.586a10.001 10.001 0 00-4.697 3.31M19.945 11c.05.32.055.644.055.972 0 5.253-4.247 9.528-9.5 9.528S1 17.225 1 11.972c0-.328.005-.652.055-.972m18.89 0A10.001 10.001 0 0016.242 4.586" />
  </svg>
);
const HealthIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className ?? ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const VegetationIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 10-7.07 0l-1.061 1.06a5 5 0 007.07 7.072l1.06-1.06a5 5 0 000-7.072z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const MoistureIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>;
const AlertIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className ?? ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;


type MapView = 'natural' | 'ndvi' | 'moisture';

// --- COMPONENTS ---
const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; description: string; }> = ({ icon, title, value, description }) => (
    <Card className="h-full">
        <div className="flex items-center">
            <div className="p-2 bg-primary-100 dark:bg-gray-700 rounded-lg mr-4">{icon}</div>
            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        </div>
        <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </Card>
);

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <SatelliteIcon className="h-16 w-16 text-primary-500 animate-pulse" />
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{message}</p>
        <div className="w-full max-w-sm bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
            <div className="bg-primary-600 h-2.5 rounded-full animate-loader-bar"></div>
        </div>
    </div>
);

// --- MAIN PAGE ---
const SatellitePage: React.FC = () => {
  const { t } = useLanguage();
  const [location, setLocation] = useState('Pune, Maharashtra');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<SatelliteAnalysisResult | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [mapView, setMapView] = useState<MapView>('natural');
  const [error, setError] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // To hold the Leaflet map instance

  const loadingMessages = [
      t('satellite.loading.1'),
      t('satellite.loading.2'),
      t('satellite.loading.3'),
      t('satellite.loading.4'),
      t('satellite.loading.5'),
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;
    setIsLoading(true);
    setAnalysisResult(null);
    setCoordinates(null);
    setError(null);

    let intervalId: any;
    try {
        setLoadingMessage(loadingMessages[0]);
        let messageIndex = 1;
        intervalId = setInterval(() => {
            setLoadingMessage(loadingMessages[messageIndex % loadingMessages.length]);
            messageIndex++;
        }, 1500);

        // First, validate the location
        const coords = await getCoordinates(location);

        // Second, ensure the location is in India
        if (coords.country !== 'IN') {
            const fullLocation = `${coords.name}, ${coords.state || coords.country}`;
            setError(t('satellite.error.nonIndianLocation', { location: fullLocation }));
            clearInterval(intervalId);
            setIsLoading(false);
            return;
        }
        
        // Location is valid, now get the AI analysis
        const validatedLocationString = `${coords.name}, ${coords.state || ''}, ${coords.country}`;
        const result = await getSatelliteAnalysis(validatedLocationString);

        setCoordinates(coords);
        setAnalysisResult(result);

    } catch (err: any) {
        setError(t(err.message) || "An unknown error occurred during analysis.");
    } finally {
        clearInterval(intervalId);
        setIsLoading(false);
    }
  };
  
  // Effect to initialize and manage the map lifecycle
  useEffect(() => {
    // This effect handles the creation, updating, and destruction of the Leaflet map.
    
    // If the map container DOM element exists and we have coordinates...
    if (mapContainerRef.current && coordinates) {
      
      // Initialize the map if the ref is null (i.e., first render or after a cleanup).
      if (!mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri'
        }).addTo(mapRef.current);
      }
      
      // Set the view to the new coordinates and add a marker.
      // This runs on both initialization and subsequent updates.
      mapRef.current.setView([coordinates.lat, coordinates.lon], 15);
      
      // Clear any existing markers before adding the new one to prevent duplicates.
      mapRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });
      L.marker([coordinates.lat, coordinates.lon]).addTo(mapRef.current);
    }

    // Cleanup function: This is CRUCIAL for integrating third-party libraries like Leaflet with React.
    // It runs when the component unmounts (which happens when `analysisResult` is set to null during a new search).
    return () => {
      if (mapRef.current) {
        mapRef.current.remove(); // Properly destroy the Leaflet map instance to avoid memory leaks and errors.
        mapRef.current = null;  // Clear the ref so the map can be re-initialized on the next render.
      }
    };
  }, [coordinates]); // This effect depends on the 'coordinates' state.


  const getHealthColor = (score: number) => {
      if (score > 85) return 'text-primary-500';
      if (score > 65) return 'text-yellow-500';
      return 'text-red-500';
  };

  const mapOverlayClass = {
      natural: 'opacity-0',
      ndvi: 'bg-gradient-to-br from-red-500/30 via-yellow-500/30 to-green-500/50 opacity-80 mix-blend-multiply',
      moisture: 'bg-gradient-to-br from-yellow-400/20 to-blue-600/50 opacity-80 mix-blend-multiply',
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('satellite.title')}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            {t('satellite.subtitle')}
        </p>
      </div>

      <Card>
          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full">
                  <label htmlFor="location" className="sr-only">{t('satellite.form.location')}</label>
                  <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder={t('satellite.form.placeholder')}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-transparent text-gray-900 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto px-8 py-3">
                  {isLoading ? t('satellite.button.loading') : t('satellite.button.analyze')}
              </Button>
          </form>
      </Card>

      {isLoading && <Card><Loader message={loadingMessage} /></Card>}
      
      {error && !isLoading && (
        <Card className="border-l-4 border-red-500 dark:bg-red-900/20">
            <p className="text-red-700 dark:text-red-300 font-semibold">{t('error')}:</p>
            <p className="text-red-600 dark:text-red-400">{error}</p>
        </Card>
      )}

      {(analysisResult && coordinates) && !isLoading && (
          <div className="space-y-8">
              <Card>
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-inner">
                        <div ref={mapContainerRef} className="w-full h-full" />
                        <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${mapOverlayClass[mapView]}`}></div>
                        <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-1.5 rounded-lg shadow-lg flex items-center space-x-1 z-[1000]">
                             {['natural', 'ndvi', 'moisture'].map(view => (
                                <button key={view} onClick={() => setMapView(view as MapView)} className={`px-2 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-semibold rounded-md transition-colors ${mapView === view ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                                    {t(`satellite.view.${view}`)}
                                </button>
                             ))}
                        </div>
                        {analysisResult && (
                            <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-2 md:p-3 rounded-lg shadow-lg z-[1000]">
                                <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white">{`${coordinates.name}, ${coordinates.state || ''}`}</h3>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{t('satellite.result.area', { area: analysisResult.area.toFixed(1) })}</p>
                            </div>
                        )}
                  </div>
              </Card>

              {analysisResult && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        icon={<HealthIcon className={getHealthColor(analysisResult.healthScore)} />}
                        title={t('satellite.result.health.title')}
                        value={`${analysisResult.healthScore}%`}
                        description={t('satellite.result.health.desc')}
                    />
                    <StatCard 
                        icon={<VegetationIcon />}
                        title={t('satellite.result.ndvi.title')}
                        value={analysisResult.ndvi.toString()}
                        description={t('satellite.result.ndvi.desc')}
                    />
                    <StatCard 
                        icon={<MoistureIcon />}
                        title={t('satellite.result.moisture.title')}
                        value={`${(analysisResult.moisture * 100).toFixed(0)}%`}
                        description={t('satellite.result.moisture.desc')}
                    />
                  </div>

                  <Card>
                    <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                        <AlertIcon className="mr-3 text-yellow-500"/>
                        {t('satellite.result.stress.title')}
                    </h3>
                    <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                        {analysisResult.stressAreas.map((area, index) => <li key={index}>{area}</li>)}
                    </ul>
                  </Card>
                </>
              )}
          </div>
      )}
       <style>{`
            @keyframes loader-bar-animation {
                0% { transform: translateX(-100%) scaleX(0.1); }
                50% { transform: translateX(0) scaleX(1); }
                100% { transform: translateX(100%) scaleX(0.1); }
            }
            .animate-loader-bar {
                animation: loader-bar-animation 2.8s infinite linear;
                transform-origin: left;
            }
            .leaflet-control-zoom {
                margin-top: 60px !important;
            }
       `}</style>
    </div>
  );
};

export default SatellitePage;