// app/news/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

type Article = {
  id: number;
  title: string;
  description: string;
  source: string;
  date: string;
  content: string;
  imageUrl: string;
  url: string;
  sentiment: string;
  category: string;
};

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${params.id}`); // Make sure the endpoint matches your API
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
        } else {
          console.error("Article not found");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };
    fetchArticle();
  }, [params.id]);

  if (!article) return <p>Loading...</p>;

  return (
    <section className="container mx-auto py-12">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-64 object-cover mb-6 rounded"
        />
        <h1 className="text-4xl font-bold text-teal-700 mb-4">{article.title}</h1>
        <p className="text-gray-700 mb-6">SENTIMENT: {article.sentiment}</p>
        <p className="text-gray-700 mb-6">CATEGORY: {article.category}</p>
        <p className="text-gray-700 mb-6">{article.description}</p>
        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{article.content}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 mt-6">
          <span>{article.source}</span>
          <span>{new Date(article.date).toLocaleDateString()}</span>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-500 underline mt-4"
        >
          Read Full Article
        </a>
      </div>
    </section>
  );
}






