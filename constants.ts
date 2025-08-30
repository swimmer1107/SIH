
import { Page, Scheme } from './types';

export const NAV_LINKS = [
  { name: Page.Home, path: '#' },
  { name: Page.Dashboard, path: '#' },
  { name: Page.DiseaseDetection, path: '#' },
  { name: Page.Schemes, path: '#' },
  { name: Page.About, path: '#' },
  { name: Page.Contact, path: '#' },
];

export const CROP_TYPES = ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Soybean', 'Potato'];
export const SOIL_TYPES = ['Alluvial', 'Black', 'Red', 'Laterite', 'Desert', 'Mountain'];

export const GOV_SCHEMES: Scheme[] = [
  {
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "An insurance service for farmers for their yields. It provides comprehensive insurance cover against failure of the crop thus helping in stabilising the income of the farmers.",
    eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible for coverage.",
    link: "#",
    category: "Insurance"
  },
  {
    title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    description: "A central sector scheme with 100% funding from Government of India. It provides income support of Rs. 6,000/- per year in three equal installments to all landholding farmer families.",
    eligibility: "All landholding farmer families, who have cultivable landholding in their names.",
    link: "#",
    category: "Financial Support"
  },
  {
    title: "Kisan Credit Card (KCC) Scheme",
    description: "The Kisan Credit Card (KCC) scheme aims at providing adequate and timely credit support from the banking system under a single window to the farmers for their cultivation & other needs.",
    eligibility: "Farmers - individual/joint borrowers who are owner cultivators.",
    link: "#",
    category: "Credit"
  },
  {
    title: "Soil Health Card Scheme",
    description: "A scheme to provide every farmer with a Soil Health Card, which will carry crop-wise recommendations of nutrients and fertilizers required for the individual farms to help farmers to improve productivity.",
    eligibility: "All farmers in the country.",
    link: "#",
    category: "Soil Health"
  },
    {
    title: "National Agriculture Market (eNAM)",
    description: "A pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities.",
    eligibility: "Farmers, Traders, and Buyers registered with eNAM.",
    link: "#",
    category: "Market Prices"
  },
  {
    title: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    description: "A national mission to improve farm productivity and ensure better utilization of the resources in the country. It focuses on 'Har Khet ko Pani' and 'Per Drop More Crop'.",
    eligibility: "All farmers and agricultural land.",
    link: "#",
    category: "Irrigation"
  }
];
