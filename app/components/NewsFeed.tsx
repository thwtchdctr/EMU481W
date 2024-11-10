// app/components/NewsFeed.tsx
"use client";

import { useState, useEffect } from "react";
import axios from 'axios';
import Link from 'next/link';

// Define the Article type
type Article = {
  id: number;
  title: string;
  description: string;
  source: string;
  date: string;
  imageUrl: string;
  url: string; // Assuming you have a URL to the full article
};

export default function NewsFeed() {
  const [news, setNews] = useState<Article[]>([]); // Use the defined type here
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/news'); // Ensure this points to your correct API endpoint
        console.log("Fetched news articles:", response.data.articles); // Debugging
        setNews(response.data.articles); // This should now be an array of Article type
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p className="text-center py-6 text-xl text-gray-600">Loading news...</p>;

  return (
    <section className="container mx-auto py-12 px-4 md:px-8 lg:px-16">
      <h1 className="text-4xl font-bold mb-4 text-teal-700">Latest Financial News</h1>
      {news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article) => (
            <Link key={article.id} href={`/news/${article.id}`}>
              <div className="block p-6 bg-white shadow-lg rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
                <img
                  src={article.imageUrl || "/default-image.jpg"} // Fallback for image
                  alt={article.title}
                  className="w-full h-48 object-cover mb-4 rounded-t-lg"
                />
                <h2 className="text-2xl font-semibold text-teal-700 mb-2 leading-tight">{article.title}</h2>
                <p className="text-gray-700 mb-4 line-clamp-3">{article.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                  <span>{article.source}</span>
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700">No news available at the moment.</p>
      )}
    </section>
  );
}








