//Client component
"use client";

//Import statements
import { useEffect, useState } from "react";

//Initialize article type
type Article = {
  id: number;
  title: string;
  description: string;
  source: string;
  date: string;
  content: string;
  imageUrl: string;
  url: string;
  sentiment: number; // Numerical sentiment (-10 to 10)
  categories: string[];
};

/* @function -> NewsDetailPage(): Displays detailed news article information based on article id
 * @param -> params (object): object that contains article id as string
 * @returns -> JSX UI that represents the article information
 */ 
export default function NewsDetailPage({ params }: { params: { id: string } }) {
  //State vars
  const [article, setArticle] = useState<Article | null>(null);


  useEffect(() => {
    /*@function -> fetchArticle(): Asynchronous function that calls the backend articles route.js with the id from params
    */
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${params.id}`);
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

  //Calculate sentiment slider position
  const pointerPosition = ((article.sentiment + 10) / 20) * 100;

  return (
    <section className="container mx-auto py-12">
      {/* Sentiment Slider */}
      <p>Article Sentiment</p>
      <div className="relative h-4 bg-gradient-to-r from-red-500 via-yellow-300 to-green-500 rounded-full mb-4">
        <div
          className="absolute top-0 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-black rounded-full border-2 border-white"
          style={{
            left: `${pointerPosition}%`,
          }}
        ></div>
      </div>

      {/* Article Details */}
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <img
          src={article.imageUrl || "/default-image.jpg"}
          alt={article.title}
          className="w-full h-64 object-cover mb-6 rounded"
        />
        <h1 className="text-4xl font-bold text-teal-700 mb-4">{article.title}</h1>

        {/* Categories as Bubbles */}
        <div className="flex flex-wrap gap-2 mb-6">
          {article.categories.map((category, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm"
            >
              {category}
            </span>
          ))}
        </div>

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







