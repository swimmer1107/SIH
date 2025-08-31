
import { Page, Scheme } from './types';

export const NAV_LINKS = [
  { name: Page.Home, path: '#' },
  { name: Page.Dashboard, path: '#' },
  { name: Page.DiseaseDetection, path: '#' },
  { name: Page.Schemes, path: '#' },
  { name: Page.About, path: '#' },
  { name: Page.Contact, path: '#' },
];

export const CROP_TYPES = ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Soybean', 'Potato', 'Pulses', 'Oilseeds'];
export const SOIL_TYPES = ['Alluvial', 'Black', 'Red', 'Laterite', 'Desert', 'Mountain'];
export const CROP_YEARS = [2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export const NUTRIENT_TYPES = [
    'Nitrogen (N)', 
    'Phosphorus (P)', 
    'Potassium (K)', 
    'Sulphur (S)', 
    'Zinc (Zn)', 
    'NPK Complex', 
    'Organic Manure'
];
