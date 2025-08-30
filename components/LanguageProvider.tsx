import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Page } from '../types';

export type Language = 'en' | 'hi' | 'pa' | 'ta' | 'te';
type Translations = { [key: string]: string };

export const availableLanguages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' }, // Punjabi
  { code: 'ta', name: 'தமிழ்' }, // Tamil
  { code: 'te', name: 'తెలుగు' }, // Telugu
];

const englishTranslations: Translations = {
    // General
    'language.toggle': 'हिन्दी',
    'all': 'All',
    'cancel': 'Cancel',
    'error': 'Error',
    'success': 'Success!',
    
    // Page Titles
    [Page.Home]: 'Home',
    [Page.Dashboard]: 'Prediction Dashboard',
    [Page.DiseaseDetection]: 'Disease Detection',
    [Page.CropRecommendation]: 'Crop Recommendation',
    [Page.Schemes]: 'Schemes & Benefits',
    [Page.Satellite]: 'Satellite Imagery',
    [Page.About]: 'About Us',
    [Page.Contact]: 'Contact Us',
    [Page.Login]: 'Login',
    [Page.SignUp]: 'Sign Up',

    // Header & Sidebar
    'header.title': 'CropGuru',
    'logout': 'Logout',
    'login': 'Login',
    'signup': 'Sign Up',

    // Footer
    'footer.copyright': `© ${new Date().getFullYear()} CropGuru. All rights reserved. Built for SIH 2025 by DEV10.`,

    // Chatbot
    'chatbot.greeting': "Hello! I'm CropGuru's AI assistant. How can I help you with your farming questions today?",
    'chatbot.title': 'CropGuru AI Assistant',
    'chatbot.error': 'Sorry, something went wrong. Please try again.',
    'chatbot.placeholder': 'Ask about crops...',

    // Home Page
    'home.hero.title': 'AI-driven Crop Yield Prediction & Optimization for',
    'home.hero.title.highlight': 'Indian Farmers',
    'home.hero.subtitle': 'Empowering agriculture with data-driven insights for higher yields, better soil health, and sustainable farming practices.',
    'home.hero.button.demo': 'Try Demo Dashboard',
    'home.hero.button.contact': 'Contact Us',
    'home.features.title': 'Why CropGuru?',
    'home.features.subtitle': 'A complete solution for modern farming challenges.',
    'home.feature.farming.title': 'Precision Farming',
    'home.feature.farming.desc': 'Get AI-powered predictions for crop yield and personalized recommendations.',
    'home.feature.chatbot.title': 'AI Chatbot',
    'home.feature.chatbot.desc': 'Your 24/7 farming assistant for all queries on crops, schemes, and more.',
    'home.feature.disease.title': 'Crop Disease Detection',
    'home.feature.disease.desc': 'Upload a photo of a leaf to instantly identify diseases and get solutions.',
    'home.feature.weather.title': 'Weather Forecast',
    'home.feature.weather.desc': 'Accurate, location-based weather predictions to plan your farming activities.',
    'home.impact.yield.title': 'Higher Yield Potential',
    'home.impact.water.title': 'Reduced Water Usage',
    'home.impact.scouting.title': 'Less Scouting Time',

    // Dashboard Page
    'dashboard.form.cropType': 'Crop Type',
    'dashboard.form.soilType': 'Soil Type',
    'dashboard.form.landSize': 'Land Size (Hectares)',
    'dashboard.form.location': 'Location',
    'dashboard.form.cropYear': 'Crop Year',
    'dashboard.form.rainfall': 'Annual Rainfall (mm)',
    'dashboard.form.fertilizer': 'Fertilizer Usage (kg/ha)',
    'dashboard.form.pesticide': 'Pesticide Usage (L/ha)',
    'dashboard.button.loading': 'Analyzing...',
    'dashboard.button.submit': 'Generate Dashboard',
    'dashboard.kpi.yield': 'Predicted Yield',
    'dashboard.kpi.yield.unit': 'Tonnes',
    'dashboard.kpi.yieldPerHectare': 'Yield per Hectare',
    'dashboard.kpi.yieldPerHectare.unit': 'Ton/ha',
    'dashboard.kpi.income': 'Estimated Income',
    'dashboard.chart.yield.title': 'Yield Forecast (Quarterly)',
    'dashboard.chart.resource.title': 'Resource Usage vs. Recommendation',
    'dashboard.alerts.title': 'Farm Alerts & Tasks',
    'dashboard.market.title': 'Market Prices',
    'dashboard.market.subtitle': '(Simulated)',
    'dashboard.weather.title': 'Weather Forecast',
    'dashboard.weather.loading': 'Loading weather...',
    'dashboard.soil.title': 'Soil Condition',
    'yourUsage': 'Your Usage',
    'recommended': 'Recommended',

    // Disease Detection Page
    'disease.title': 'Crop Disease Detection',
    'disease.subtitle': 'Upload or take a photo of a crop leaf, and our AI will analyze it for diseases and suggest treatments.',
    'disease.preview': 'Image preview will appear here',
    'disease.button.analyze': 'Analyze Image',
    'disease.button.analyzing': 'Analyzing...',
    'disease.button.tryAnother': 'Try Another',
    'disease.button.upload': 'Upload from Device',
    'disease.button.camera': 'Use Camera',
    'disease.camera.prompt': 'Point your camera at a crop leaf',
    'disease.result.title': 'Analysis Result',
    'disease.result.healthy': 'Plant Appears Healthy',
    'disease.result.healthy.desc': 'No significant disease detected in the provided image.',
    'disease.result.name': 'Disease Name',
    'disease.result.confidence': 'Confidence',
    'disease.result.treatment': 'Recommended Treatment',
    
    // Crop Recommendation Page
    'crop.title': 'AI Crop Recommendation',
    'crop.subtitle': "Describe your farm's conditions to get an expert recommendation for the best crop to plant.",
    'crop.form.state': 'State',
    'crop.form.district': 'District',
    'crop.form.soilColor': 'Soil Color',
    'crop.form.soilTexture': 'Soil Texture (Feel)',
    'crop.form.rainfall': 'Annual Rainfall',
    'crop.button.loading': 'Getting Recommendation...',
    'crop.button.submit': 'Recommend Crop',
    'crop.result.title': 'Recommendation Result',
    'crop.result.bestCrop': 'Best Crop to Plant',
    'crop.result.alternatives': 'Alternative Crops',
    'crop.result.tips': 'Soil Management Tips',
    'crop.result.comparison': 'Comparative Analysis',
    'crop.comparison.crop': 'Crop',
    'crop.comparison.marketValue': 'Market Value',
    'crop.comparison.water': 'Water Requirement',
    'crop.comparison.pest': 'Pest Resistance',
    'crop.comparison.notes': 'Notes',

    // Schemes Page
    'schemes.title': 'Government Schemes & Benefits',
    'schemes.subtitle': 'Stay updated with the latest government initiatives, subsidies, and alerts to support your farming.',
    'schemes.error.prefix': 'Error Fetching Schemes:',

    // Satellite Page
    'satellite.title': 'Satellite Imagery Analysis',
    'satellite.subtitle': 'Enter your farm location to get real-time analysis of crop health, vegetation, and soil moisture.',
    'satellite.form.location': 'Farm Location',
    'satellite.form.placeholder': 'e.g., Ludhiana, Punjab',
    'satellite.button.analyze': 'Analyze Area',
    'satellite.button.loading': 'Analyzing...',
    'satellite.loading.1': 'Acquiring satellite lock...',
    'satellite.loading.2': 'Processing multispectral imagery...',
    'satellite.loading.3': 'Generating NDVI vegetation index...',
    'satellite.loading.4': 'Calculating soil moisture levels...',
    'satellite.loading.5': 'Finalizing analysis...',
    'satellite.imageAlt': 'Satellite view of a farm',
    'satellite.view.natural': 'Natural',
    'satellite.view.ndvi': 'NDVI',
    'satellite.view.moisture': 'Moisture',
    'satellite.result.area': '{area} Hectares Analyzed',
    'satellite.result.health.title': 'Overall Farm Health',
    'satellite.result.health.desc': 'Based on vegetation and moisture',
    'satellite.result.ndvi.title': 'NDVI Vegetation Index',
    'satellite.result.ndvi.desc': 'Higher value indicates denser vegetation',
    'satellite.result.moisture.title': 'Soil Moisture Index',
    'satellite.result.moisture.desc': 'Estimated water content in topsoil',
    'satellite.result.stress.title': 'Potential Stress Areas',
    'satellite.result.stress.1': 'Potential water stress detected in the northwest quadrant.',
    'satellite.result.stress.2': 'Slightly lower vegetation density observed along the southern edge.',
    'satellite.result.stress.none': 'No significant stress areas detected. Farm appears uniformly healthy.',
    'satellite.error.nonIndianLocation': 'This application is intended for locations in India. Analysis for "{location}" is not supported.',

    // About Page
    'about.title': 'About CropGuru',
    'about.subtitle': 'Revolutionizing agriculture for a sustainable future.',
    'about.mission.title': 'Our Mission',
    'about.mission.desc': 'CropGuru is a project developed by Team DEV10 for the Smart India Hackathon 2025. Our mission is to bridge the technology gap in Indian agriculture by providing small and medium-scale farmers with access to powerful AI-driven tools. We aim to make precision agriculture accessible, affordable, and easy to use, helping farmers increase their yield, reduce waste, and improve their livelihoods.',
    'about.vision.title': 'The Vision',
    'about.vision.desc': "We envision a future where every farmer in India, regardless of their scale of operation, can make data-informed decisions. By leveraging technologies like AI, machine learning, and satellite imagery, CropGuru aims to be a comprehensive digital companion for farmers. Our goal is to scale this platform to support multiple regional languages, integrate with local market prices, and build a strong community of forward-thinking farmers.",
    'about.team.title': 'Meet Team DEV10',
    'about.team.desc': 'We are a passionate team of developers, designers, and agricultural enthusiasts committed to creating impactful solutions. Our diverse skill set allows us to tackle complex problems with creativity and technical expertise. We believe in the power of technology to create positive change and are excited to present CropGuru at SIH 2025.',

    // Contact Page
    'contact.title': 'Get In Touch',
    'contact.subtitle': "We'd love to hear from you! Whether you have a question, feedback, or a partnership proposal, please reach out.",
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.button.submit': 'Send Message',
    'contact.success.title': 'Thank You!',
    'contact.success.desc': 'Your message has been sent. We will get back to you shortly.',

    // Login Page
    'login.title': 'Welcome Back',
    'login.subtitle': 'Sign in to access your dashboard.',
    'login.form.email': 'Email Address',
    'login.form.password': 'Password',
    'login.button.submit': 'Sign In',
    'login.button.loading': 'Signing In...',
    'login.link.prompt': "Don't have an account?",
    'login.link.action': 'Sign Up',
    
    // Sign Up Page
    'signup.title': 'Create an Account',
    'signup.subtitle': 'Join CropGuru to get started.',
    'signup.form.name': 'Full Name',
    'signup.success.message': 'Account created! Please check your email to confirm your sign up.',
    'signup.button.submit': 'Create Account',
    'signup.button.loading': 'Creating Account...',
    'signup.link.prompt': 'Already have an account?',
    'signup.link.action': 'Sign In',

    // Services
    'service.gemini.apiKeyError': 'The AI assistant is not configured. The API key might be invalid or missing in the source code.',
    'service.gemini.connectError': "Sorry, I'm having trouble connecting to my knowledge base. Please try again later.",
    'service.gemini.imageAnalysisConfigError': 'AI image analysis is not configured. The API key is missing or invalid in the source code.',
    'service.gemini.imageAnalysisGeneralError': 'Failed to analyze image. The AI model might be unavailable or the image could not be processed.',
    'service.gemini.schemesConfigError': 'AI scheme fetcher is not configured. The API key is missing or invalid in the source code.',
    'service.gemini.schemesGeneralError': 'Failed to fetch government schemes. The AI model might be unavailable or there was a network issue.',
    'service.gemini.cropRecConfigError': 'AI crop recommendation is not configured. The API key is missing or invalid in the source code.',
    'service.gemini.cropRecGeneralError': 'Failed to get crop recommendation. The AI model might be unavailable or the input data is invalid.',
    'service.gemini.satelliteConfigError': 'AI satellite analysis is not configured. The API key is missing or invalid in the source code.',
    'service.gemini.satelliteGeneralError': 'Failed to get satellite analysis. The AI model might be unavailable or the location is invalid.',
    'service.map.locationNotFound': 'Could not find the specified location. Please check the spelling and try again.',
    'service.map.geocodeFailed': 'Failed to get location coordinates. The mapping service may be temporarily unavailable.',
};

const translations: { [key in Language]: Translations } = {
  en: englishTranslations,
  hi: {
    ...englishTranslations,
    ...{
      // General
      'language.toggle': 'English',
      'all': 'सभी',
      'cancel': 'रद्द करें',
      'error': 'त्रुटि',
      'success': 'सफलता!',

      // Page Titles
      [Page.Home]: 'होम',
      [Page.Dashboard]: 'भविष्यवाणी डैशबोर्ड',
      [Page.DiseaseDetection]: 'रोग पहचान',
      [Page.CropRecommendation]: 'फ़सल सिफ़ारिश',
      [Page.Schemes]: 'योजनाएं और लाभ',
      [Page.Satellite]: 'सैटेलाइट इमेजरी',
      [Page.About]: 'हमारे बारे में',
      [Page.Contact]: 'संपर्क करें',
      [Page.Login]: 'लॉगिन',
      [Page.SignUp]: 'साइन अप करें',
      
      // Header & Sidebar
      'header.title': 'क्रॉपगुरु',
      'logout': 'लॉग आउट',
      'login': 'लॉगिन',
      'signup': 'साइन अप करें',

      // Footer
      'footer.copyright': `© ${new Date().getFullYear()} क्रॉपगुरु। सर्वाधिकार सुरक्षित। SIH 2025 के लिए DEV10 द्वारा निर्मित।`,
      
      // Chatbot
      'chatbot.greeting': 'नमस्ते! मैं क्रॉपगुरु का AI सहायक हूँ। मैं आज आपके खेती-संबंधी सवालों में कैसे मदद कर सकता हूँ?',
      'chatbot.title': 'क्रॉपगुरु AI सहायक',
      'chatbot.error': 'क्षमा करें, कुछ गड़बड़ हो गई। कृपया पुनः प्रयास करें।',
      'chatbot.placeholder': 'फसलों के बारे में पूछें...',

      // Home Page
      'home.hero.title': 'के लिए AI-संचालित फसल उपज भविष्यवाणी और अनुकूलन',
      'home.hero.title.highlight': 'भारतीय किसान',
      'home.hero.subtitle': 'उच्च पैदावार, बेहतर मिट्टी स्वास्थ्य और टिकाऊ कृषि पद्धतियों के लिए डेटा-संचालित अंतर्दृष्टि के साथ कृषि को सशक्त बनाना।',
      'home.hero.button.demo': 'डेमो डैशबोर्ड आज़माएँ',
      'home.hero.button.contact': 'संपर्क करें',
      'home.features.title': 'क्रॉपगुरु क्यों?',
      'home.features.subtitle': 'आधुनिक खेती की चुनौतियों का एक संपूर्ण समाधान।',
      'home.feature.farming.title': 'सटीक खेती',
      'home.feature.farming.desc': 'फसल की उपज के लिए AI-संचालित भविष्यवाणियां और व्यक्तिगत सिफारिशें प्राप्त करें।',
      'home.feature.chatbot.title': 'AI चैटबॉट',
      'home.feature.chatbot.desc': 'फसलों, योजनाओं और अन्य सभी प्रश्नों के लिए आपका 24/7 खेती सहायक।',
      'home.feature.disease.title': 'फसल रोग का पता लगाना',
      'home.feature.disease.desc': 'बीमारियों की तुरंत पहचान करने और समाधान पाने के लिए एक पत्ते की तस्वीर अपलोड करें।',
      'home.feature.weather.title': 'मौसम पूर्वानुमान',
      'home.feature.weather.desc': 'अपनी कृषि गतिविधियों की योजना बनाने के लिए सटीक, स्थान-आधारित मौसम की भविष्यवाणी।',
      'home.impact.yield.title': 'अधिक उपज क्षमता',
      'home.impact.water.title': 'कम पानी का उपयोग',
      'home.impact.scouting.title': 'कम खोज समय',

      // Dashboard Page
      'dashboard.form.cropType': 'फ़सल का प्रकार',
      'dashboard.form.soilType': 'मिट्टी का प्रकार',
      'dashboard.form.landSize': 'भूमि का आकार (हेक्टेयर)',
      'dashboard.form.location': 'स्थान',
      'dashboard.form.cropYear': 'फ़सल वर्ष',
      'dashboard.form.rainfall': 'वार्षिक वर्षा (मिमी)',
      'dashboard.form.fertilizer': 'उर्वरक उपयोग (किग्रा/हेक्टेयर)',
      'dashboard.form.pesticide': 'कीटनाशक उपयोग (ली/हेक्टेयर)',
      'dashboard.button.loading': 'विश्लेषण हो रहा है...',
      'dashboard.button.submit': 'डैशबोर्ड उत्पन्न करें',
      'dashboard.kpi.yield': 'अनुमानित उपज',
      'dashboard.kpi.yield.unit': 'टन',
      'dashboard.kpi.yieldPerHectare': 'प्रति हेक्टेयर उपज',
      'dashboard.kpi.yieldPerHectare.unit': 'टन/हेक्टेयर',
      'dashboard.kpi.income': 'अनुमानित आय',
      'dashboard.chart.yield.title': 'उपज पूर्वानुमान (त्रैमासिक)',
      'dashboard.chart.resource.title': 'संसाधन उपयोग बनाम सिफ़ारिश',
      'dashboard.alerts.title': 'खेत अलर्ट और कार्य',
      'dashboard.market.title': 'बाजार मूल्य',
      'dashboard.market.subtitle': '(नकली)',
      'dashboard.weather.title': 'मौसम पूर्वानुमान',
      'dashboard.weather.loading': 'मौसम लोड हो रहा है...',
      'dashboard.soil.title': 'मिट्टी की स्थिति',
      'yourUsage': 'आपका उपयोग',
      'recommended': 'अनुशंसित',

      // Disease Detection Page
      'disease.title': 'फसल रोग का पता लगाना',
      'disease.subtitle': 'फसल के पत्ते की एक तस्वीर अपलोड करें या लें, और हमारा AI बीमारियों के लिए इसका विश्लेषण करेगा और उपचार सुझाएगा।',
      'disease.preview': 'छवि पूर्वावलोकन यहाँ दिखाई देगा',
      'disease.button.analyze': 'छवि का विश्लेषण करें',
      'disease.button.analyzing': 'विश्लेषण हो रहा है...',
      'disease.button.tryAnother': 'दूसरा प्रयास करें',
      'disease.button.upload': 'डिवाइस से अपलोड करें',
      'disease.button.camera': 'कैमरे का उपयोग करें',
      'disease.camera.prompt': 'अपने कैमरे को फसल के पत्ते पर इंगित करें',
      'disease.result.title': 'विश्लेषण परिणाम',
      'disease.result.healthy': 'पौधा स्वस्थ दिखाई देता है',
      'disease.result.healthy.desc': 'दिए गए चित्र में कोई महत्वपूर्ण रोग नहीं पाया गया।',
      'disease.result.name': 'रोग का नाम',
      'disease.result.confidence': 'आत्मविश्वास',
      'disease.result.treatment': 'अनुशंसित उपचार',

      // Crop Recommendation Page
      'crop.title': 'AI फ़सल सिफ़ारिश',
      'crop.subtitle': 'रोपण के लिए सबसे अच्छी फसल के लिए विशेषज्ञ की सिफारिश प्राप्त करने के लिए अपने खेत की स्थितियों का वर्णन करें।',
      'crop.form.state': 'राज्य',
      'crop.form.district': 'ज़िला',
      'crop.form.soilColor': 'मिट्टी का रंग',
      'crop.form.soilTexture': 'मिट्टी की बनावट (महसूस)',
      'crop.form.rainfall': 'वार्षिक वर्षा',
      'crop.button.loading': 'सिफारिश मिल रही है...',
      'crop.button.submit': 'फसल की सिफारिश करें',
      'crop.result.title': 'सिफारिश परिणाम',
      'crop.result.bestCrop': 'रोपण के लिए सबसे अच्छी फसल',
      'crop.result.alternatives': 'वैकल्पिक फसलें',
      'crop.result.tips': 'मृदा प्रबंधन युक्तियाँ',
      'crop.result.comparison': 'तुलनात्मक विश्लेषण',
      'crop.comparison.crop': 'फ़सल',
      'crop.comparison.marketValue': 'बाजार मूल्य',
      'crop.comparison.water': 'पानी की आवश्यकता',
      'crop.comparison.pest': 'कीट प्रतिरोध',
      'crop.comparison.notes': 'टिप्पणियाँ',

      // Schemes Page
      'schemes.title': 'सरकारी योजनाएं और लाभ',
      'schemes.subtitle': 'अपनी खेती का समर्थन करने के लिए नवीनतम सरकारी पहलों, सब्सिडी और अलर्ट के साथ अपडेट रहें।',
      'schemes.error.prefix': 'योजनाएं प्राप्त करने में त्रुटि:',

      // Satellite Page
      'satellite.title': 'सैटेलाइट इमेजरी विश्लेषण',
      'satellite.subtitle': 'फसल स्वास्थ्य, वनस्पति, और मिट्टी की नमी का वास्तविक समय विश्लेषण प्राप्त करने के लिए अपने खेत का स्थान दर्ज करें।',
      'satellite.form.location': 'खेत का स्थान',
      'satellite.form.placeholder': 'जैसे, लुधियाना, पंजाब',
      'satellite.button.analyze': 'क्षेत्र का विश्लेषण करें',
      'satellite.button.loading': 'विश्लेषण हो रहा है...',
      'satellite.loading.1': 'सैटेलाइट लॉक प्राप्त किया जा रहा है...',
      'satellite.loading.2': 'मल्टीस्पेक्ट्रल इमेजरी को संसाधित किया जा रहा है...',
      'satellite.loading.3': 'NDVI वनस्पति सूचकांक उत्पन्न किया जा रहा है...',
      'satellite.loading.4': 'मिट्टी की नमी के स्तर की गणना की जा रही है...',
      'satellite.loading.5': 'विश्लेषण को अंतिम रूप दिया जा रहा है...',
      'satellite.imageAlt': 'एक खेत का सैटेलाइट दृश्य',
      'satellite.view.natural': 'प्राकृतिक',
      'satellite.view.ndvi': 'NDVI',
      'satellite.view.moisture': 'नमी',
      'satellite.result.area': '{area} हेक्टेयर का विश्लेषण किया गया',
      'satellite.result.health.title': 'समग्र खेत का स्वास्थ्य',
      'satellite.result.health.desc': 'वनस्पति और नमी के आधार पर',
      'satellite.result.ndvi.title': 'NDVI वनस्पति सूचकांक',
      'satellite.result.ndvi.desc': 'उच्च मान घनी वनस्पति को इंगित करता है',
      'satellite.result.moisture.title': 'मिट्टी की नमी सूचकांक',
      'satellite.result.moisture.desc': 'ऊपरी मिट्टी में अनुमानित पानी की मात्रा',
      'satellite.result.stress.title': 'संभावित तनाव क्षेत्र',
      'satellite.result.stress.1': 'उत्तर-पश्चिम चतुर्थांश में संभावित पानी का तनाव पाया गया।',
      'satellite.result.stress.2': 'दक्षिणी किनारे पर थोड़ी कम वनस्पति घनत्व देखी गई।',
      'satellite.result.stress.none': 'कोई महत्वपूर्ण तनाव क्षेत्र नहीं पाया गया। खेत समान रूप से स्वस्थ दिखाई देता है।',
      'satellite.error.nonIndianLocation': 'यह एप्लिकेशन भारत में स्थानों के लिए है। "{location}" के लिए विश्लेषण समर्थित नहीं है।',

      // About Page
      'about.title': 'क्रॉपगुरु के बारे में',
      'about.subtitle': 'एक स्थायी भविष्य के लिए कृषि में क्रांति।',
      'about.mission.title': 'हमारा लक्ष्य',
      'about.mission.desc': 'क्रॉपगुरु, स्मार्ट इंडिया हैकथॉन 2025 के लिए टीम DEV10 द्वारा विकसित एक परियोजना है। हमारा मिशन छोटे और मध्यम स्तर के किसानों को शक्तिशाली AI-संचालित उपकरणों तक पहुँच प्रदान करके भारतीय कृषि में प्रौद्योगिकी अंतर को पाटना है। हमारा उद्देश्य सटीक कृषि को सुलभ, सस्ता और उपयोग में आसान बनाना है, जिससे किसानों को अपनी उपज बढ़ाने, बर्बादी कम करने और अपनी आजीविका में सुधार करने में मदद मिलती है।',
      'about.vision.title': 'दृष्टिकोण',
      'about.vision.desc': 'हम एक ऐसे भविष्य की कल्पना करते हैं जहां भारत में हर किसान, अपने संचालन के पैमाने की परवाह किए बिना, डेटा-सूचित निर्णय ले सकता है। एआई, मशीन लर्निंग और सैटेलाइट इमेजरी जैसी तकनीकों का लाभ उठाकर, क्रॉपगुरु का लक्ष्य किसानों के लिए एक व्यापक डिजिटल साथी बनना है। हमारा लक्ष्य कई क्षेत्रीय भाषाओं का समर्थन करने, स्थानीय बाजार की कीमतों के साथ एकीकृत करने और दूरंदेशी किसानों का एक मजबूत समुदाय बनाने के लिए इस मंच को बढ़ाना है।',
      'about.team.title': 'टीम DEV10 से मिलें',
      'about.team.desc': 'हम डेवलपर्स, डिजाइनरों और कृषि उत्साही लोगों की एक उत्साही टीम हैं जो प्रभावशाली समाधान बनाने के लिए प्रतिबद्ध हैं। हमारा विविध कौशल सेट हमें रचनात्मकता और तकनीकी विशेषज्ञता के साथ जटिल समस्याओं से निपटने की अनुमति देता है। हम सकारात्मक बदलाव लाने के लिए प्रौद्योगिकी की शक्ति में विश्वास करते हैं और SIH 2025 में क्रॉपगुरु को प्रस्तुत करने के लिए उत्साहित हैं।',

      // Contact Page
      'contact.title': 'संपर्क में रहें',
      'contact.subtitle': 'हमें आपसे सुनना अच्छा लगेगा! चाहे आपका कोई प्रश्न हो, प्रतिक्रिया हो, या साझेदारी का प्रस्ताव हो, कृपया संपर्क करें।',
      'contact.form.name': 'पूरा नाम',
      'contact.form.email': 'ईमेल',
      'contact.form.message': 'संदेश',
      'contact.button.submit': 'संदेश भेजें',
      'contact.success.title': 'धन्यवाद!',
      'contact.success.desc': 'आपका संदेश भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे।',

      // Login Page
      'login.title': 'वापसी पर स्वागत है',
      'login.subtitle': 'अपने डैशबोर्ड तक पहुंचने के लिए साइन इन करें।',
      'login.form.email': 'ईमेल पता',
      'login.form.password': 'पासवर्ड',
      'login.button.submit': 'साइन इन करें',
      'login.button.loading': 'साइन इन हो रहा है...',
      'login.link.prompt': 'क्या आपका खाता नहीं है?',
      'login.link.action': 'साइन अप करें',
      
      // Sign Up Page
      'signup.title': 'खाता बनाएं',
      'signup.subtitle': 'आरंभ करने के लिए क्रॉपगुरु से जुड़ें।',
      'signup.form.name': 'पूरा नाम',
      'signup.success.message': 'खाता बन गया! कृपया अपना साइन अप की पुष्टि करने के लिए अपना ईमेल जांचें।',
      'signup.button.submit': 'खाता बनाएं',
      'signup.button.loading': 'खाता बनाया जा रहा है...',
      'signup.link.prompt': 'क्या आपका पहले से एक खाता मौजूद है?',
      'signup.link.action': 'साइन इन करें',

      // Services
      'service.gemini.apiKeyError': 'एआई सहायक कॉन्फ़िगर नहीं है। एपीआई कुंजी अमान्य हो सकती है या स्रोत कोड में गुम हो सकती है।',
      'service.gemini.connectError': 'क्षमा करें, मुझे अपने ज्ञान के आधार से जुड़ने में समस्या हो रही है। कृपया बाद में पुन: प्रयास करें।',
      'service.gemini.imageAnalysisConfigError': 'एआई छवि विश्लेषण कॉन्फ़िगर नहीं है। एपीआई कुंजी स्रोत कोड में गुम या अमान्य है।',
      'service.gemini.imageAnalysisGeneralError': 'छवि का विश्लेषण करने में विफल। एआई मॉडल अनुपलब्ध हो सकता है या छवि को संसाधित नहीं किया जा सका।',
      'service.gemini.schemesConfigError': 'एआई योजना लाने वाला कॉन्फ़िगर नहीं है। एपीआई कुंजी स्रोत कोड में गुम या अमान्य है।',
      'service.gemini.schemesGeneralError': 'सरकारी योजनाओं को लाने में विफल। एआई मॉडल अनुपलब्ध हो सकता है या कोई नेटवर्क समस्या थी।',
      'service.gemini.cropRecConfigError': 'एआई फसल अनुशंसा कॉन्फ़िगर नहीं है। एपीआई कुंजी स्रोत कोड में गुम या अमान्य है।',
      'service.gemini.cropRecGeneralError': 'फसल की सिफारिश प्राप्त करने में विफल। एआई मॉडल अनुपलब्ध हो सकता है या इनपुट डेटा अमान्य है।',
      'service.gemini.satelliteConfigError': 'एआई उपग्रह विश्लेषण कॉन्फ़िगर नहीं है। एपीआई कुंजी स्रोत कोड में गुम या अमान्य है।',
      'service.gemini.satelliteGeneralError': 'उपग्रह विश्लेषण प्राप्त करने में विफल। एआई मॉडल अनुपलब्ध हो सकता है या स्थान अमान्य है।',
      'service.map.locationNotFound': 'निर्दिष्ट स्थान नहीं मिल सका। कृपया वर्तनी जांचें और पुनः प्रयास करें।',
      'service.map.geocodeFailed': 'स्थान निर्देशांक प्राप्त करने में विफल। मैपिंग सेवा अस्थायी रूप से अनुपलब्ध हो सकती है।',
    }
  },
  pa: {
    ...englishTranslations,
    ...{
      // General
      'language.toggle': 'English',
      'all': 'ਸਾਰੇ',
      'cancel': 'ਰੱਦ ਕਰੋ',
      'error': 'ਗਲਤੀ',
      'success': 'ਸਫਲਤਾ!',

      // Page Titles
      [Page.Home]: 'ਮੁੱਖ ਪੰਨਾ',
      [Page.Dashboard]: 'ਭਵਿੱਖਬਾਣੀ ਡੈਸ਼ਬੋਰਡ',
      [Page.DiseaseDetection]: 'ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ',
      [Page.CropRecommendation]: 'ਫਸਲ ਦੀ ਸਿਫਾਰਸ਼',
      [Page.Schemes]: 'ਯੋਜਨਾਵਾਂ ਅਤੇ ਲਾਭ',
      [Page.Satellite]: 'ਸੈਟੇਲਾਈਟ ਇਮੇਜਰੀ',
      [Page.About]: 'ਸਾਡੇ ਬਾਰੇ',
      [Page.Contact]: 'ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
      [Page.Login]: 'ਲਾਗਇਨ',
      [Page.SignUp]: 'ਸਾਈਨ ਅੱਪ ਕਰੋ',

      // Header & Sidebar
      'header.title': 'ਕਰੌਪਗੁਰੂ',
      'logout': 'ਲੌਗ ਆਉਟ',
      'login': 'ਲਾਗਇਨ',
      'signup': 'ਸਾਈਨ ਅੱਪ ਕਰੋ',

      // Footer
      'footer.copyright': `© ${new Date().getFullYear()} ਕਰੌਪਗੁਰੂ। ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ। SIH 2025 ਲਈ DEV10 ਦੁਆਰਾ ਬਣਾਇਆ ਗਿਆ।`,

      // Chatbot
      'chatbot.greeting': 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਕਰੌਪਗੁਰੂ ਦਾ AI ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਅੱਜ ਤੁਹਾਡੇ ਖੇਤੀ-ਸੰਬੰਧੀ ਸਵਾਲਾਂ ਵਿੱਚ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
      'chatbot.title': 'ਕਰੌਪਗੁਰੂ AI ਸਹਾਇਕ',
      'chatbot.error': 'ਮਾਫ ਕਰਨਾ, ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
      'chatbot.placeholder': 'ਫਸਲਾਂ ਬਾਰੇ ਪੁੱਛੋ...',

      // Home Page
      'home.hero.title': 'ਲਈ AI-ਸੰਚਾਲਿਤ ਫਸਲ ਝਾੜ ਦੀ ਭਵਿੱਖਬਾਣੀ ਅਤੇ ਅਨੁਕੂਲਨ',
      'home.hero.title.highlight': 'ਭਾਰਤੀ ਕਿਸਾਨ',
      'home.hero.subtitle': 'ਵਧੇਰੇ ਝਾੜ, ਬਿਹਤਰ ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਅਤੇ ਟਿਕਾਊ ਖੇਤੀ ਅਭਿਆਸਾਂ ਲਈ ਡਾਟਾ-ਸੰਚਾਲਿਤ ਸੂਝ ਨਾਲ ਖੇਤੀਬਾੜੀ ਨੂੰ ਸ਼ਕਤੀ ਪ੍ਰਦਾਨ ਕਰਨਾ।',
      'home.hero.button.demo': 'ਡੈਮੋ ਡੈਸ਼ਬੋਰਡ ਅਜ਼ਮਾਓ',
      'home.hero.button.contact': 'ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
      'home.features.title': 'ਕਰੌਪਗੁਰੂ ਕਿਉਂ?',
      'home.features.subtitle': 'ਆਧੁਨਿਕ ਖੇਤੀ ਦੀਆਂ ਚੁਣੌਤੀਆਂ ਦਾ ਇੱਕ ਪੂਰਾ ਹੱਲ।',
      'home.feature.farming.title': 'ਸਟੀਕ ਖੇਤੀ',
      'home.feature.farming.desc': 'ਫਸਲ ਦੇ ਝਾੜ ਲਈ AI-ਸੰਚਾਲਿਤ ਭਵਿੱਖਬਾਣੀਆਂ ਅਤੇ ਵਿਅਕਤੀਗਤ ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ।',
      'home.feature.chatbot.title': 'AI ਚੈਟਬੋਟ',
      'home.feature.chatbot.desc': 'ਫਸਲਾਂ, ਯੋਜਨਾਵਾਂ ਅਤੇ ਹੋਰ ਸਾਰੇ ਸਵਾਲਾਂ ਲਈ ਤੁਹਾਡਾ 24/7 ਖੇਤੀ ਸਹਾਇਕ।',
      'home.feature.disease.title': 'ਫਸਲ ਰੋਗ ਦੀ ਪਛਾਣ',
      'home.feature.disease.desc': 'ਬਿਮਾਰੀਆਂ ਦੀ ਤੁਰੰਤ ਪਛਾਣ ਕਰਨ ਅਤੇ ਹੱਲ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਇੱਕ ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ।',
      'home.feature.weather.title': 'ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ',
      'home.feature.weather.desc': 'ਆਪਣੀਆਂ ਖੇਤੀ ਗਤੀਵਿਧੀਆਂ ਦੀ ਯੋਜਨਾ ਬਣਾਉਣ ਲਈ ਸਹੀ, ਸਥਾਨ-ਅਧਾਰਤ ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ।',
      'home.impact.yield.title': 'ਵਧੇਰੇ ਝਾੜ ਦੀ ਸੰਭਾਵਨਾ',
      'home.impact.water.title': 'ਪਾਣੀ ਦੀ ਘੱਟ ਵਰਤੋਂ',
      'home.impact.scouting.title': 'ਘੱਟ ਖੋਜ ਸਮਾਂ',

      // Dashboard Page
      'dashboard.form.cropType': 'ਫਸਲ ਦੀ ਕਿਸਮ',
      'dashboard.form.soilType': 'ਮਿੱਟੀ ਦੀ ਕਿਸਮ',
      'dashboard.form.landSize': 'ਜ਼ਮੀਨ ਦਾ ਆਕਾਰ (ਹੈਕਟੇਅਰ)',
      'dashboard.form.location': 'ਸਥਾਨ',
      'dashboard.form.cropYear': 'ਫਸਲ ਦਾ ਸਾਲ',
      'dashboard.form.rainfall': 'ਸਾਲਾਨਾ ਬਾਰਸ਼ (ਮਿਲੀਮੀਟਰ)',
      'dashboard.form.fertilizer': 'ਖਾਦ ਦੀ ਵਰਤੋਂ (ਕਿਲੋ/ਹੈਕਟੇਅਰ)',
      'dashboard.form.pesticide': 'ਕੀਟਨਾਸ਼ਕ ਦੀ ਵਰਤੋਂ (ਲੀਟਰ/ਹੈਕਟੇਅਰ)',
      'dashboard.button.loading': 'ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...',
      'dashboard.button.submit': 'ਡੈਸ਼ਬੋਰਡ ਬਣਾਓ',
      'dashboard.kpi.yield': 'ਅਨੁਮਾਨਿਤ ਝਾੜ',
      'dashboard.kpi.yield.unit': 'ਟਨ',
      'dashboard.kpi.yieldPerHectare': 'ਪ੍ਰਤੀ ਹੈਕਟੇਅਰ ਝਾੜ',
      'dashboard.kpi.yieldPerHectare.unit': 'ਟਨ/ਹੈਕਟੇਅਰ',
      'dashboard.kpi.income': 'ਅਨੁਮਾਨਿਤ ਆਮਦਨ',
      'dashboard.chart.yield.title': 'ਝਾੜ ਦੀ ਭਵਿੱਖਬਾਣੀ (ਤਿਮਾਹੀ)',
      'dashboard.chart.resource.title': 'ਸਰੋਤ ਦੀ ਵਰਤੋਂ ਬਨਾਮ ਸਿਫਾਰਸ਼',
      'dashboard.alerts.title': 'ਫਾਰਮ ਚੇਤਾਵਨੀਆਂ ਅਤੇ ਕਾਰਜ',
      'dashboard.market.title': 'ਬਾਜ਼ਾਰ ਦੀਆਂ ਕੀਮਤਾਂ',
      'dashboard.market.subtitle': '(ਸਿਮੂਲੇਟਡ)',
      'dashboard.weather.title': 'ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ',
      'dashboard.weather.loading': 'ਮੌਸਮ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
      'dashboard.soil.title': 'ਮਿੱਟੀ ਦੀ ਸਥਿਤੀ',
      'yourUsage': 'ਤੁਹਾਡੀ ਵਰਤੋਂ',
      'recommended': 'ਸਿਫਾਰਸ਼ੀ',

      // Disease Detection Page
      'disease.title': 'ਫਸਲ ਰੋਗ ਦੀ ਪਛਾਣ',
      'disease.subtitle': 'ਫਸਲ ਦੇ ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ ਜਾਂ ਲਓ, ਅਤੇ ਸਾਡਾ AI ਇਸ ਦਾ ਬਿਮਾਰੀਆਂ ਲਈ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੇਗਾ ਅਤੇ ਇਲਾਜ ਦਾ ਸੁਝਾਅ ਦੇਵੇਗਾ।',
      'disease.preview': 'ਚਿੱਤਰ ਦਾ ਪੂਰਵ ਦਰਸ਼ਨ ਇੱਥੇ ਦਿਖਾਈ ਦੇਵੇਗਾ',
      'disease.button.analyze': 'ਚਿੱਤਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
      'disease.button.analyzing': 'ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...',
      'disease.button.tryAnother': 'ਦੂਜੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ',
      'disease.button.upload': 'ਡਿਵਾਈਸ ਤੋਂ ਅਪਲੋਡ ਕਰੋ',
      'disease.button.camera': 'ਕੈਮਰਾ ਵਰਤੋ',
      'disease.camera.prompt': 'ਆਪਣਾ ਕੈਮਰਾ ਫਸਲ ਦੇ ਪੱਤੇ ਵੱਲ ਕਰੋ',
      'disease.result.title': 'ਵਿਸ਼ਲੇਸ਼ਣ ਦਾ ਨਤੀਜਾ',
      'disease.result.healthy': 'ਪੌਦਾ ਸਿਹਤਮੰਦ ਜਾਪਦਾ ਹੈ',
      'disease.result.healthy.desc': 'ਦਿੱਤੀ ਗਈ ਤਸਵੀਰ ਵਿੱਚ ਕੋਈ ਖਾਸ ਬਿਮਾਰੀ ਨਹੀਂ ਮਿਲੀ।',
      'disease.result.name': 'ਬਿਮਾਰੀ ਦਾ ਨਾਮ',
      'disease.result.confidence': 'ਵਿਸ਼ਵਾਸ',
      'disease.result.treatment': 'ਸਿਫਾਰਸ਼ੀ ਇਲਾਜ',
      
      // Satellite Page
      'satellite.error.nonIndianLocation': 'ਇਹ ਐਪਲੀਕੇਸ਼ਨ ਭਾਰਤ ਵਿੱਚ ਸਥਾਨਾਂ ਲਈ ਹੈ। "{location}" ਲਈ ਵਿਸ਼ਲੇਸ਼ਣ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।',

      // Services
      'service.gemini.satelliteConfigError': 'AI ਸੈਟੇਲਾਈਟ ਵਿਸ਼ਲੇਸ਼ਣ ਕੌਂਫਿਗਰ ਨਹੀਂ ਕੀਤਾ ਗਿਆ ਹੈ। API ਕੁੰਜੀ ਸਰੋਤ ਕੋਡ ਵਿੱਚ ਗੁੰਮ ਜਾਂ ਅਵੈਧ ਹੈ।',
      'service.gemini.satelliteGeneralError': 'ਸੈਟੇਲਾਈਟ ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰਾਪਤ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। AI ਮਾਡਲ ਉਪਲਬਧ ਨਹੀਂ ਹੋ ਸਕਦਾ ਜਾਂ ਸਥਾਨ ਅਵੈਧ ਹੈ।',
      'service.map.locationNotFound': 'ਦੱਸੀ ਗਈ ਥਾਂ ਨਹੀਂ ਮਿਲੀ। ਕਿਰਪਾ ਕਰਕੇ ਸਪੈਲਿੰਗ ਚੈੱਕ ਕਰੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
      'service.map.geocodeFailed': 'ਸਥਾਨ ਦੇ ਕੋਆਰਡੀਨੇਟ ਪ੍ਰਾਪਤ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। ਮੈਪਿੰਗ ਸੇਵਾ ਅਸਥਾਈ ਤੌਰ \'ਤੇ ਅਣਉਪਲਬਧ ਹੋ ਸਕਦੀ ਹੈ।',
    }
  },
  ta: {
    ...englishTranslations,
    ...{
      // General
      'language.toggle': 'English',
      'all': 'அனைத்தும்',
      'cancel': 'ரத்து செய்',
      'error': 'பிழை',
      'success': 'வெற்றி!',

      // Page Titles
      [Page.Home]: 'முகப்பு',
      [Page.Dashboard]: 'கணிப்பு டாஷ்போர்டு',
      [Page.DiseaseDetection]: 'நோய் கண்டறிதல்',
      [Page.CropRecommendation]: 'பயிர் பரிந்துரை',
      [Page.Schemes]: 'திட்டங்கள் & நன்மைகள்',
      [Page.Satellite]: 'செயற்கைக்கோள் படங்கள்',
      [Page.About]: 'எங்களைப் பற்றி',
      [Page.Contact]: 'தொடர்பு கொள்ள',
      [Page.Login]: 'உள்நுழை',
      [Page.SignUp]: 'பதிவுபெறுக',

      // Header & Sidebar
      'header.title': 'கிராப்குரு',
      'logout': 'வெளியேறு',
      'login': 'உள்நுழை',
      'signup': 'பதிவுபெறுக',

      // Footer
      'footer.copyright': `© ${new Date().getFullYear()} கிராப்குரு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. SIH 2025-க்காக DEV10 ஆல் உருவாக்கப்பட்டது.`,

      // Chatbot
      'chatbot.greeting': 'வணக்கம்! நான் கிராப்குருவின் AI உதவியாளர். இன்று உங்கள் விவசாயக் கேள்விகளுக்கு நான் எப்படி உதவ முடியும்?',
      'chatbot.title': 'கிராப்குரு AI உதவியாளர்',
      'chatbot.error': 'மன்னிக்கவும், ஏதோ தவறு நடந்துவிட்டது. மீண்டும் முயற்சிக்கவும்.',
      'chatbot.placeholder': 'பயிர்களைப் பற்றி கேளுங்கள்...',

      // Home Page
      'home.hero.title': 'க்கான AI-இயக்கும் பயிர் விளைச்சல் கணிப்பு மற்றும் மேம்படுத்தல்',
      'home.hero.title.highlight': 'இந்திய விவசாயிகள்',
      'home.hero.subtitle': 'அதிக மகசூல், சிறந்த மண் ஆரோக்கியம் மற்றும் நிலையான விவசாய முறைகளுக்காக தரவு சார்ந்த நுண்ணறிவுகளுடன் விவசாயத்தை மேம்படுத்துதல்.',
      'home.hero.button.demo': 'டெமோ டாஷ்போர்டை முயற்சிக்கவும்',
      'home.hero.button.contact': 'தொடர்பு கொள்ள',
      'home.features.title': 'கிராப்குரு ஏன்?',
      'home.features.subtitle': 'நவீன விவசாய சவால்களுக்கு ஒரு முழுமையான தீர்வு.',
      'home.feature.farming.title': 'துல்லியமான விவசாயம்',
      'home.feature.farming.desc': 'பயிர் விளைச்சலுக்கான AI-ஆற்றல்மிக்க கணிப்புகள் மற்றும் தனிப்பயனாக்கப்பட்ட பரிந்துரைகளைப் பெறுங்கள்.',
      'home.feature.chatbot.title': 'AI சாட்பாட்',
      'home.feature.chatbot.desc': 'பயிர்கள், திட்டங்கள் மற்றும் பலவற்றைப் பற்றிய அனைத்து கேள்விகளுக்கும் உங்கள் 24/7 விவசாய உதவியாளர்.',
      'home.feature.disease.title': 'பயிர் நோய் கண்டறிதல்',
      'home.feature.disease.desc': 'நோய்களை உடனடியாகக் கண்டறிந்து தீர்வுகளைப் பெற ஒரு இலையின் புகைப்படத்தைப் பதிவேற்றவும்.',
      'home.feature.weather.title': 'வானிலை முன்னறிவிப்பு',
      'home.feature.weather.desc': 'உங்கள் விவசாய நடவடிக்கைகளைத் திட்டமிட துல்லியமான, இருப்பிட அடிப்படையிலான வானிலை கணிப்புகள்.',
      'home.impact.yield.title': 'அதிக மகசூல் திறன்',
      'home.impact.water.title': 'குறைந்த நீர் பயன்பாடு',
      'home.impact.scouting.title': 'குறைந்த கண்காணிப்பு நேரம்',

      // Dashboard Page
      'dashboard.form.cropType': 'பயிர் வகை',
      'dashboard.form.soilType': 'மண் வகை',
      'dashboard.form.landSize': 'நில அளவு (ஹெக்டேர்)',
      'dashboard.form.location': 'இடம்',
      'dashboard.form.cropYear': 'பயிர் ஆண்டு',
      'dashboard.form.rainfall': 'ஆண்டு மழைப்பொழிவு (மிமீ)',
      'dashboard.form.fertilizer': 'உரப் பயன்பாடு (கிலோ/ஹெக்டேர்)',
      'dashboard.form.pesticide': 'பூச்சிக்கொல்லி பயன்பாடு (லி/ஹெக்டேர்)',
      'dashboard.button.loading': 'பகுப்பாய்வு செய்யப்படுகிறது...',
      'dashboard.button.submit': 'டாஷ்போர்டை உருவாக்கு',
      'dashboard.kpi.yield': 'கணிக்கப்பட்ட விளைச்சல்',
      'dashboard.kpi.yield.unit': 'டன்கள்',
      'dashboard.kpi.yieldPerHectare': 'ஒரு ஹெக்டேருக்கு விளைச்சல்',
      'dashboard.kpi.yieldPerHectare.unit': 'டன்/ஹெக்டேர்',
      'dashboard.kpi.income': 'மதிப்பிடப்பட்ட வருமானம்',
      'dashboard.chart.yield.title': 'விளைச்சல் முன்னறிவிப்பு (காலாண்டு)',
      'dashboard.chart.resource.title': 'வளப் பயன்பாடு vs. பரிந்துரை',
      'dashboard.alerts.title': 'பண்ணை எச்சரிக்கைகள் & பணிகள்',
      'dashboard.market.title': 'சந்தை விலைகள்',
      'dashboard.market.subtitle': '(மாதிரி)',
      'dashboard.weather.title': 'வானிலை முன்னறிவிப்பு',
      'dashboard.weather.loading': 'வானிலை ஏற்றப்படுகிறது...',
      'dashboard.soil.title': 'மண் நிலை',
      'yourUsage': 'உங்கள் பயன்பாடு',
      'recommended': 'பரிந்துரைக்கப்பட்டது',

      // Satellite Page
      'satellite.error.nonIndianLocation': 'இந்த பயன்பாடு இந்தியாவில் உள்ள இடங்களுக்காக வடிவமைக்கப்பட்டுள்ளது. "{location}" க்கான பகுப்பாய்வு ஆதரிக்கப்படவில்லை.',

      // Services
      'service.gemini.satelliteConfigError': 'AI செயற்கைக்கோள் பகுப்பாய்வு கட்டமைக்கப்படவில்லை. API விசை மூலக் குறியீட்டில் இல்லை அல்லது தவறானது.',
      'service.gemini.satelliteGeneralError': 'செயற்கைக்கோள் பகுப்பாய்வைப் பெற முடியவில்லை. AI மாதிரி கிடைக்காமல் இருக்கலாம் அல்லது இருப்பிடம் தவறானது.',
      'service.map.locationNotFound': 'குறிப்பிட்ட இடத்தைக் கண்டுபிடிக்க முடியவில்லை. தயவுசெய்து எழுத்துப்பிழையைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
      'service.map.geocodeFailed': 'இருப்பிட ஒருங்கிணைப்புகளைப் பெறுவதில் தோல்வி. மேப்பிங் சேவை தற்காலிகமாக கிடைக்காமல் போகலாம்.',
    }
  },
  te: {
    ...englishTranslations,
    ...{
      // General
      'language.toggle': 'English',
      'all': 'అన్నీ',
      'cancel': 'రద్దు చేయండి',
      'error': 'లోపం',
      'success': 'విజయం!',

      // Page Titles
      [Page.Home]: 'హోమ్',
      [Page.Dashboard]: 'అంచనా డాష్‌బోర్డ్',
      [Page.DiseaseDetection]: 'వ్యాధి నిర్ధారణ',
      [Page.CropRecommendation]: 'పంట సిఫార్సు',
      [Page.Schemes]: 'పథకాలు & ప్రయోజనాలు',
      [Page.Satellite]: 'ఉపగ్రహ చిత్రాలు',
      [Page.About]: 'మా గురించి',
      [Page.Contact]: 'మమ్మల్ని సంప్రదించండి',
      [Page.Login]: 'ప్రవేశించండి',
      [Page.SignUp]: 'నమోదు చేసుకోండి',

      // Header & Sidebar
      'header.title': 'క్రాప్‌గురు',
      'logout': 'లాగ్ అవుట్',
      'login': 'ప్రవేశించండి',
      'signup': 'నమోదు చేసుకోండి',

      // Footer
      'footer.copyright': `© ${new Date().getFullYear()} క్రాప్‌గురు. అన్ని హక్కులు ప్రత్యేకించబడ్డాయి. SIH 2025 కోసం DEV10 ద్వారా నిర్మించబడింది.`,

      // Chatbot
      'chatbot.greeting': 'నమస్కారం! నేను క్రాప్‌గురు AI సహాయకుడిని. ఈ రోజు మీ వ్యవసాయ ప్రశ్నలకు నేను ఎలా సహాయపడగలను?',
      'chatbot.title': 'క్రాప్‌గురు AI సహాయకుడు',
      'chatbot.error': 'క్షమించండి, ఏదో పొరపాటు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
      'chatbot.placeholder': 'పంటల గురించి అడగండి...',

      // Home Page
      'home.hero.title': 'కోసం AI-ఆధారిత పంట దిగుబడి అంచనా & ఆప్టిమైజేషన్',
      'home.hero.title.highlight': 'భారతీయ రైతులు',
      'home.hero.subtitle': 'అధిక దిగుబడులు, మెరుగైన నేల ఆరోగ్యం మరియు స్థిరమైన వ్యవసాయ పద్ధతుల కోసం డేటా-ఆధారిత అంతర్దృష్టులతో వ్యవసాయాన్ని శక్తివంతం చేయడం.',
      'home.hero.button.demo': 'డెమో డాష్‌బోర్డ్‌ను ప్రయత్నించండి',
      'home.hero.button.contact': 'మమ్మల్ని సంప్రదించండి',
      'home.features.title': 'క్రాప్‌గురు ఎందుకు?',
      'home.features.subtitle': 'ఆధునిక వ్యవసాయ సవాళ్లకు పూర్తి పరిష్కారం.',
      'home.feature.farming.title': 'ఖచ్చితమైన వ్యవసాయం',
      'home.feature.farming.desc': 'పంట దిగుబడి కోసం AI-ఆధారిత అంచనాలు మరియు వ్యక్తిగతీకరించిన సిఫార్సులను పొందండి.',
      'home.feature.chatbot.title': 'AI చాట్‌బాట్',
      'home.feature.chatbot.desc': 'పంటలు, పథకాలు మరియు మరిన్నింటిపై అన్ని ప్రశ్నల కోసం మీ 24/7 వ్యవసాయ సహాయకుడు.',
      'home.feature.disease.title': 'పంట వ్యాధి నిర్ధారణ',
      'home.feature.disease.desc': 'వ్యాధులను తక్షణమే గుర్తించడానికి మరియు పరిష్కారాలను పొందడానికి ఆకు ఫోటోను అప్‌లోడ్ చేయండి.',
      'home.feature.weather.title': 'వాతావరణ సూచన',
      'home.feature.weather.desc': 'మీ వ్యవసాయ కార్యకలాపాలను ప్లాన్ చేయడానికి ఖచ్చితమైన, స్థాన-ఆధారిత వాతావరణ అంచనాలు.',
      'home.impact.yield.title': 'అధిక దిగుబడి సంభావ్యత',
      'home.impact.water.title': 'తగ్గిన నీటి వినియోగం',
      'home.impact.scouting.title': 'తక్కువ పర్యవేక్షణ సమయం',
      
      // Dashboard Page
      'dashboard.form.cropType': 'పంట రకం',
      'dashboard.form.soilType': 'నేల రకం',
      'dashboard.form.landSize': 'భూమి పరిమాణం (హెక్టార్లు)',
      'dashboard.form.location': 'ప్రదేశం',
      'dashboard.form.cropYear': 'పంట సంవత్సరం',
      'dashboard.form.rainfall': 'వార్షిక వర్షపాతం (మిమీ)',
      'dashboard.form.fertilizer': 'ఎరువుల వాడకం (కిలోలు/హెక్టారు)',
      'dashboard.form.pesticide': 'పురుగుమందుల వాడకం (లీ/హెక్టారు)',
      'dashboard.button.loading': 'విశ్లేషిస్తోంది...',
      'dashboard.button.submit': 'డాష్‌బోర్డ్‌ను రూపొందించండి',
      'dashboard.kpi.yield': 'అంచనా వేయబడిన దిగుబడి',
      'dashboard.kpi.yield.unit': 'టన్నులు',
      'dashboard.kpi.yieldPerHectare': 'హెక్టారుకు దిగుబడి',
      'dashboard.kpi.yieldPerHectare.unit': 'టన్ను/హెక్టారు',
      'dashboard.kpi.income': 'అంచనా వేయబడిన ఆదాయం',
      'dashboard.chart.yield.title': 'దిగుబడి సూచన (త్రైమాసికం)',
      'dashboard.chart.resource.title': 'వనరుల వినియోగం వర్సెస్ సిఫార్సు',
      'dashboard.alerts.title': 'పొలం హెచ్చరికలు & పనులు',
      'dashboard.market.title': 'మార్కెట్ ధరలు',
      'dashboard.market.subtitle': '(అనుకరణ)',
      'dashboard.weather.title': 'వాతావరణ సూచన',
      'dashboard.weather.loading': 'వాతావరణం లోడ్ అవుతోంది...',
      'dashboard.soil.title': 'నేల పరిస్థితి',
      'yourUsage': 'మీ వినియోగం',
      'recommended': 'సిఫార్సు చేయబడింది',

      // Satellite Page
      'satellite.error.nonIndianLocation': 'ఈ అప్లికేషన్ భారతదేశంలోని ప్రదేశాల కోసం ఉద్దేశించబడింది. "{location}" కోసం విశ్లేషణకు మద్దతు లేదు.',

      // Services
      'service.gemini.satelliteConfigError': 'AI ఉపగ్రహ విశ్లేషణ కాన్ఫిਗਰ చేయబడలేదు. API కీ మూల కోడ్‌లో లేదు లేదా చెల్లదు.',
      'service.gemini.satelliteGeneralError': 'ఉపగ్రహ విశ్లేషణను పొందడంలో విఫలమైంది. AI మోడల్ అందుబాటులో ఉండకపోవచ్చు లేదా ప్రదేశం చెల్లదు.',
      'service.map.locationNotFound': 'పేర్కొన్న ప్రదేశం కనుగొనబడలేదు. దయచేసి స్పెల్లింగ్‌ను తనిఖీ చేసి, మళ్లీ ప్రయత్నించండి.',
      'service.map.geocodeFailed': 'స్థాన కోఆర్డినేట్‌లను పొందడంలో విఫలమైంది. మ్యాపింగ్ సేవ తాత్కాలికంగా అందుబాటులో ఉండకపోవచ్చు.',
    }
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  availableLanguages: { code: Language; name: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    let translation = translations[language][key] ?? key;
    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{${optionKey}}`, String(options[optionKey]));
      });
    }
    return translation;
  }, [language]);


  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};