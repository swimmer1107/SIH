import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Page } from '../types';

type Language = 'en' | 'hi';
type Translations = { [key: string]: string };

const translations: { [key in Language]: Translations } = {
  en: {
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
    'satellite.comingSoon': 'Coming Soon!',
    'satellite.desc': "We are working hard to bring you this powerful new feature. Soon, you'll be able to monitor crop health, detect stress, and track growth patterns across your entire farm using advanced satellite data. Stay tuned!",

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

    // Marketplace Page
    'marketplace.title': 'Farmers\' Marketplace',
    'marketplace.subtitle': 'Connect with other farmers to buy and sell produce, equipment, and more.',
    'marketplace.demo': '(This is a community demo with sample data)',
    'marketplace.filter.show': 'Show:',
    'marketplace.filter.category': 'Category:',
    'marketplace.filter.forSale': 'For Sale',
    'marketplace.filter.toBuy': 'Looking to Buy',
    'marketplace.button.postAd': 'Post New Ad',
    'marketplace.noMatch': 'No listings match the current filters.',
    'marketplace.button.contact': 'Contact Seller',
    'marketplace.modal.title': 'Create a New Listing',
    'marketplace.modal.type': 'Ad Type',
    'marketplace.modal.itemName': 'Item Name',
    'marketplace.modal.price': 'Price',
    'marketplace.modal.price.placeholder': 'e.g., ₹ 5,000 or \'Contact for price\'',
    'marketplace.modal.quantity': 'Quantity',
    'marketplace.modal.quantity.placeholder': 'e.g., 50 kg or 1 unit',
    'marketplace.modal.description': 'Description',

    // Services
    'service.gemini.apiKeyError': 'The AI assistant is not configured. The API key might be invalid or missing in the source code.',
    'service.gemini.connectError': "Sorry, I'm having trouble connecting to my knowledge base. Please try again later.",
    'service.gemini.imageAnalysisConfigError': 'AI image analysis is not configured. The API key is missing or invalid in the source code.',
    'service.gemini.imageAnalysisGeneralError': 'Failed to analyze image. The AI model might be unavailable or the image could not be processed.',
    'service.gemini.schemesConfigError': 'AI scheme fetcher is not configured. The API key is missing or invalid in the source code.',
    'service.gemini.schemesGeneralError': 'Failed to fetch government schemes. The AI model might be unavailable or there was a network issue.',
    'service.gemini.cropRecConfigError': 'AI crop recommendation is not configured. The API key is missing or invalid in the source code.',
    'service.gemini.cropRecGeneralError': 'Failed to get crop recommendation. The AI model might be unavailable or the input data is invalid.',

  },
  hi: {
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
    'satellite.comingSoon': 'जल्द आ रहा है!',
    'satellite.desc': 'हम आपको यह शक्तिशाली नई सुविधा लाने के लिए कड़ी मेहनत कर रहे हैं। जल्द ही, आप उन्नत उपग्रह डेटा का उपयोग करके फसल स्वास्थ्य की निगरानी करने, तनाव का पता लगाने और अपने पूरे खेत में विकास पैटर्न को ट्रैक करने में सक्षम होंगे। बने रहें!',

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

    // Marketplace Page
    'marketplace.title': 'किसानों का बाज़ार',
    'marketplace.subtitle': 'उपज, उपकरण, और बहुत कुछ खरीदने और बेचने के लिए अन्य किसानों से जुड़ें।',
    'marketplace.demo': '(यह नमूना डेटा के साथ एक सामुदायिक डेमो है)',
    'marketplace.filter.show': 'दिखाएँ:',
    'marketplace.filter.category': 'श्रेणी:',
    'marketplace.filter.forSale': 'बिक्री के लिए',
    'marketplace.filter.toBuy': 'खरीदना चाहते हैं',
    'marketplace.button.postAd': 'नया विज्ञापन पोस्ट करें',
    'marketplace.noMatch': 'वर्तमान फिल्टर से कोई लिस्टिंग मेल नहीं खाती।',
    'marketplace.button.contact': 'विक्रेता से संपर्क करें',
    'marketplace.modal.title': 'एक नई लिस्टिंग बनाएं',
    'marketplace.modal.type': 'विज्ञापन प्रकार',
    'marketplace.modal.itemName': 'वस्तु का नाम',
    'marketplace.modal.price': 'कीमत',
    'marketplace.modal.price.placeholder': 'जैसे, ₹ 5,000 या \'कीमत के लिए संपर्क करें\'',
    'marketplace.modal.quantity': 'मात्रा',
    'marketplace.modal.quantity.placeholder': 'जैसे, 50 किलो या 1 इकाई',
    'marketplace.modal.description': 'विवरण',

    // Services
    'service.gemini.apiKeyError': 'एआई सहायक कॉन्फ़िगर नहीं है। एपीआई कुंजी अमान्य हो सकती है या स्रोत कोड में गुम हो सकती है।',
    'service.gemini.connectError': 'क्षमा करें, मुझे अपने ज्ञान के आधार से जुड़ने में समस्या हो रही है। कृपया बाद में पुन: प्रयास करें।',
    'service.gemini.imageAnalysisConfigError': 'एआई छवि विश्लेषण कॉन्फ़िगर नहीं है। एपीआई कुंजी स्रोत कोड में गुम या अमान्य है।',
    'service.gemini.imageAnalysisGeneralError': 'छवि का विश्लेषण करने में विफल। एआई मॉडल अनुपलब्ध हो सकता है या छवि को संसाधित नहीं किया जा सका।',
    'service.gemini.schemesConfigError': 'एआई योजना लाने वाला कॉन्फ़िगर नहीं है। एपीआई कुंजी स्रोत कोड में गुम या अमान्य है।',
    'service.gemini.schemesGeneralError': 'सरकारी योजनाओं को लाने में विफल। एआई मॉडल अनुपलब्ध हो सकता है या कोई नेटवर्क समस्या थी।',
    'service.gemini.cropRecConfigError': 'एआई फसल अनुशंसा कॉन्फ़िगर नहीं है। एपीआई कुंजी स्रोत कोड में गुम या अमान्य है।',
    'service.gemini.cropRecGeneralError': 'फसल की सिफारिश प्राप्त करने में विफल। एआई मॉडल अनुपलब्ध हो सकता है या इनपुट डेटा अमान्य है।',
  },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = useCallback(() => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'hi' : 'en'));
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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