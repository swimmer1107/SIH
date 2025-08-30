
import React from 'react';
import Card from '../ui/Card';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">About CropGuru</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
          Revolutionizing agriculture for a sustainable future.
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          CropGuru is a project developed by <span className="font-semibold">Team DEV10</span> for the Smart India Hackathon 2025. Our mission is to bridge the technology gap in Indian agriculture by providing small and medium-scale farmers with access to powerful AI-driven tools. We aim to make precision agriculture accessible, affordable, and easy to use, helping farmers increase their yield, reduce waste, and improve their livelihoods.
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">The Vision</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          We envision a future where every farmer in India, regardless of their scale of operation, can make data-informed decisions. By leveraging technologies like AI, machine learning, and satellite imagery, CropGuru aims to be a comprehensive digital companion for farmers. Our goal is to scale this platform to support multiple regional languages, integrate with local market prices, and build a strong community of forward-thinking farmers.
        </p>
      </Card>
      
      <Card>
        <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">Meet Team DEV10</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          We are a passionate team of developers, designers, and agricultural enthusiasts committed to creating impactful solutions. Our diverse skill set allows us to tackle complex problems with creativity and technical expertise. We believe in the power of technology to create positive change and are excited to present CropGuru at SIH 2025.
        </p>
      </Card>
    </div>
  );
};

export default AboutPage;
