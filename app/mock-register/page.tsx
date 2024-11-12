'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function NewsFeedPage() {
  const [userRegistered, setUserRegistered] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [newsFeed, setNewsFeed] = useState<any[]>([]);

  const allInterests = ['Finance', 'Technology', 'Health', 'Lifestyle'];

  const categoryMap: { [key: string]: string } = {
    Finance: 'business',
    Technology: 'technology',
    Health: 'health',
    Lifestyle: 'life',
  };

  const handleRegister = () => {
    if (userName && userEmail) {
      setUserRegistered(true);
    } else {
      alert('Please enter both your name and email');
    }
  };

  const handleInterestSelection = (interest: string) => {
    setSelectedInterests((prevInterests) =>
      prevInterests.includes(interest)
        ? prevInterests.filter((i) => i !== interest)
        : [...prevInterests, interest]
    );
  };

  useEffect(() => {
    if (selectedInterests.length > 0) {
      fetchNewsFeed();
    }
  }, [selectedInterests]);

  const fetchNewsFeed = async () => {
    const apiKey = '90dc40d3f2ff49218828e039d132e95e';
    const baseUrl = 'https://newsapi.org/v2/top-headlines';

    const apiCategories = selectedInterests.map((interest) => categoryMap[interest]).join(',');

    try {
      const response = await fetch(`${baseUrl}?category=${apiCategories}&apiKey=${apiKey}`);
      const data = await response.json();
      console.log('API Response:', data);

      if (data.articles && data.articles.length > 0) {
        const shuffledArticles = data.articles.sort(() => Math.random() - 0.5);
        const randomArticles = shuffledArticles.slice(0, 3);
        setNewsFeed(randomArticles);
      } else {
        alert('No articles found for the selected categories.');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Failed to fetch news articles.');
    }
  };

  return (
    <div className="container mx-auto p-8">
      {!userRegistered ? (
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-6">Register</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-4 mb-4 border rounded-lg"
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full p-4 mb-4 border rounded-lg"
          />
          <button
            onClick={handleRegister}
            className="w-full py-2 bg-green-500 text-white rounded-lg"
          >
            Register
          </button>
        </div>
      ) : (
        <div>
          {/* Display the greeting message */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Hello, {userName}</h2>
          </div>

          {/* Move "Select Your Interests" below the greeting */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Select Your Interests</h2>
            <div className="flex flex-wrap gap-4 mt-4">
              {allInterests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestSelection(interest)}
                  className={`${
                    selectedInterests.includes(interest) ? 'bg-green-600' : 'bg-gray-200'
                  } px-6 py-2 rounded-lg`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Display the news feed */}
          {newsFeed.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">News Feed</h2>
              {newsFeed.map((news, index) => (
                <motion.div
                  key={index}
                  className="p-6 mb-4 bg-white rounded-lg shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                  <p className="text-gray-700 mb-2">Source: {news.source.name}</p>
                  <p className="text-gray-800 mb-2">{news.description}</p>
                  <p
                    className={`${
                      news.sentiment === 'positive'
                        ? 'text-green-500'
                        : news.sentiment === 'negative'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                    } font-semibold`}
                  >
                    Sentiment: {news.sentiment || 'neutral'}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

