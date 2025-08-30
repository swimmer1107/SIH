
export enum Page {
  Home = 'Home',
  Dashboard = 'Dashboard',
  DiseaseDetection = 'Disease Detection',
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