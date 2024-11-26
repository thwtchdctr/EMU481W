"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

type Article = {
  id: number;
  title: string;
  description: string;
  source: string;
  date: string;
  imageUrl: string;
  url: string;
  sentiment: number;
  categories: string[];
};

const defaultCategories = [
  "All News",
  "RealEstate",
  "Politics",
  "Economy",
  "Technology",
  "Finance",
  "Other",
];

export default function NewsFeed() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All News");
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [user, setUser] = useState<{ uid: string; interests: string[] } | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userInterests = userData.interests || [];

          setUser({
            uid: firebaseUser.uid,
            interests: userInterests,
          });

          if (userInterests.length > 0) {
            setCategories(["Subscribed", ...defaultCategories]);
            setSelectedCategory("Subscribed"); // Automatically set to "Subscribed"
          }
        }
      } else {
        setUser(null);
        setCategories(defaultCategories);
        setSelectedCategory("All News"); // Reset to "All News" for non-signed-in users
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/news");
        setNews(response.data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews =
    selectedCategory === "All News"
      ? news
      : selectedCategory === "Subscribed"
      ? user?.interests?.length > 0
        ? news.filter((article) =>
            user.interests.some((interest) =>
              article.categories.includes(interest)
            )
          )
        : []
      : selectedCategory === "Other"
      ? news.filter(
          (article) =>
            article.categories.length === 0 ||
            article.categories.includes("Other")
        )
      : news.filter((article) => article.categories.includes(selectedCategory));

  if (loading) {
    return <p className="text-center py-6 text-xl text-gray-600">Loading news...</p>;
  }

  return (
    <section className="container mx-auto py-12 px-4 md:px-8 lg:px-16">
      <h1 className="text-4xl font-bold mb-4 text-teal-700">Latest Financial News</h1>

      {/* Categories Filter */}
      <div className="mb-6 flex flex-wrap gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category
                ? "bg-teal-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-all`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* News Articles */}
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((article) => {
            let pointerPosition = (((article.sentiment + 10) / 20) * 100);
            pointerPosition = Math.min(Math.max(pointerPosition, 1), 99);

            return (
              <Link key={article.id} href={`/news/${article.id}`}>
                <div className="block p-6 bg-white shadow-lg rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
                  <p>Article Sentiment</p>
                  <div className="relative h-4 bg-gradient-to-r from-red-500 via-yellow-300 to-green-500 rounded-full mb-4">
                    <div
                      className="absolute top-0 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-black rounded-full border-2 border-white"
                      style={{ left: `${pointerPosition}%` }}
                    ></div>
                  </div>

                  <img
                    src={article.imageUrl || "/default-image.jpg"}
                    alt={article.title}
                    className="w-full h-48 object-cover mb-4 rounded-t-lg"
                  />

                  <h2 className="text-2xl font-semibold text-teal-700 mb-2 leading-tight">
                    {article.title}
                  </h2>

                  {/* Categories as Bubbles */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{article.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                    <span>{article.source}</span>
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-700">
          No articles available in this category.
        </p>
      )}
    </section>
  );
}




