
export enum Page {
  Home = 'Home',
  Dashboard = 'Dashboard',
  DiseaseDetection = 'Disease Detection',
  CropRecommendation = 'Crop Recommendation',
  Schemes = 'Schemes & Benefits',
  Satellite = 'Satellite Imagery',
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