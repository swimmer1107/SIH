


export enum Page {
  Home = 'Home',
  Dashboard = 'Dashboard',
  DiseaseDetection = 'Disease Detection',
  CropRecommendation = 'Crop Recommendation',
  Schemes = 'Schemes & Benefits',
  Satellite = 'Satellite Imagery',
  FertilizerHub = 'Fertilizer Hub',
  About = 'About Us',
  Contact = 'Contact Us',
  Login = 'Login',
  SignUp = 'Sign Up',
}

export interface Scheme {
  title: string;
  description: string;
  eligibility: string;
  link: string;
  category: string;
}

export interface DiseaseResult {
  diseaseName: string;
  confidence: number;
  treatment: string;
  isHealthy: boolean;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface WeatherData {
  day: string;
  temp: string;
  icon: string;
  condition: string;
}

// FIX: Added CropRecommendationResult to be used in CropRecommendationPage.
export interface CropRecommendationResult {
  recommendedCrop: string;
  reasoning: string;
  alternativeCrops: {
    name: string;
    reason: string;
  }[];
  soilManagementTips: string[];
  comparativeAnalysis: {
    cropName: string;
    marketValue: 'High' | 'Moderate' | 'Low';
    waterRequirement: 'High' | 'Moderate' | 'Low';
    pestResistance: 'High' | 'Moderate' | 'Low';
    notes: string;
  }[];
}

export interface SatelliteAnalysisResult {
  healthScore: number;
  ndvi: number;
  moisture: number;
  stressAreas: string[];
  area: number;
}

export interface Coordinates {
    lat: number;
    lon: number;
    name: string;
    country: string;
    state?: string;
}

export interface FertilizerAnalysis {
    productName: string;
    nutrientContent: string;
    price: string;
    releaseSpeed: 'Fast' | 'Slow' | 'Moderate';
    applicationMethod: string;
    soilImpact: string;
    bestFor: string;
}

export interface FertilizerDirectComparisonResult {
    comparison: FertilizerAnalysis[];
    recommendation: {
        winner: string;
        reasoning: string;
    };
}

export interface FertilizerNutrientGuide {
    nutrientName: string;
    roleInPlants: string;
    commonFertilizers: string[];
    applicationTips: string;
    deficiencySymptoms: string;
}