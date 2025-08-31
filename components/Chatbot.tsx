import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from './LanguageProvider';

const Chatbot: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: t('chatbot.greeting') }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Update initial message if language changes while chatbot is closed
  useEffect(() => {
    if (!isOpen) {
        setMessages([{ sender: 'ai', text: t('chatbot.greeting') }]);
    }
  }, [t, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = useCallback(async () => {
    if (userInput.trim() === '' || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
        const aiResponseKey = await getChatbotResponse(messages, userInput);
        const aiResponseText = t(aiResponseKey);
        setMessages(prev => [...prev, { sender: 'ai', text: aiResponseText }]);
    } catch (error) {
        setMessages(prev => [...prev, { sender: 'ai', text: t('chatbot.error') }]);
    } finally {
        setIsLoading(false);
    }
  }, [userInput, isLoading, messages, t]);


  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Toggle chatbot"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V4c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
            </svg>
        </button>
      </div>

      <div
        className={`fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-50 border dark:border-gray-800 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <div className="p-4 bg-primary-600 text-white rounded-t-2xl flex justify-between items-center">
          <h3 className="text-lg font-bold">{t('chatbot.title')}</h3>
          <button onClick={() => setIsOpen(false)} className="hover:text-gray-200 text-2xl leading-none">&times;</button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            ))}
             {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gray-200 dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:bg-primary-300 dark:disabled:bg-primary-800 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;