"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';

// Define the type for the news article
type Article = {
  id: number;
  title: string;
  description: string;
  source: string;
  date: string;
  content: string;
  imageUrl: string;
};

// Simulating fetched news data
const sampleNews: Article[] = [
  {
    id: 1,
    title: "Stocks Surge as Market Optimism Grows",
    description: "Stock markets have surged due to increased optimism regarding the upcoming earnings reports.",
    source: "Financial Times",
    date: "October 7, 2024",
    content: "Full article content about stocks surging due to market optimism...",
    imageUrl: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNzQzMTZ8MHwxfGFsbHwxfHx8fHx8fHwxNjM4NzgyMDEz&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 2,
    title: "Real Estate Market Trends: What to Expect in 2025",
    description: "Experts discuss the expected trends in the real estate market and how to prepare for changes.",
    source: "Real Estate Daily",
    date: "October 6, 2024",
    content: "Full article content about real estate trends in 2025...",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNzQzMTZ8MHwxfGFsbHwxfHx8fHx8fHwxNjM4NzgyMDEz&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 3,
    title: "Investing in Green Energy: Opportunities and Risks",
    description: "Green energy stocks are on the rise. Learn about the opportunities and risks of investing in this sector.",
    source: "Investment Weekly",
    date: "October 5, 2024",
    content: "Full article content about investing in green energy...",
    imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNzQzMTZ8MHwxfGFsbHwxfHx8fHx8fHwxNjM4NzgyMDEz&ixlib=rb-1.2.1&q=80&w=400",
  },
];

export default function NewsFeed() {
  const [news, setNews] = useState<Article[]>([]);

  useEffect(() => {
    setNews(sampleNews); // Simulate fetching news data
  }, []);

  return (
    <section className="container mx-auto py-12 bg-gradient-to-br from-green-100 to-teal-100">
      {/* Left-aligned header with slight offset */}
      <div className="text-left mb-10 ml-6">
        <h1 className="text-4xl font-bold mb-2">Latest Financial News</h1>
        <p className="text-gray-600">Stay informed with the latest updates in finance and market trends</p>
      </div>

      {/* News Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.length === 0 ? (
          <p className="text-center text-gray-700">No news available at the moment.</p>
        ) : (
          news.map((article) => (
            <Link key={article.id} href={`/news/${article.id}`}>
              <div className="p-6 bg-white shadow-lg rounded-lg cursor-pointer transform transition duration-300 hover:scale-105">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <h2 className="text-2xl font-bold text-teal-700 mb-2">{article.title}</h2>
                <p className="text-gray-700 mb-4">{article.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{article.source}</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}







