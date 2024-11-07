// app/api/news.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        category: 'business',
        country: 'us',
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const articles = response.data.articles.map((article, index) => ({
      id: index, // Make sure this ID is unique; consider using article.id if available
      title: article.title,
      description: article.description,
      source: article.source.name,
      date: article.publishedAt,
      content: article.content,
      imageUrl: article.urlToImage,
      url: article.url, // Link to the full article
    }));

    res.status(200).json({ articles });
  } catch (error) {
    console.error('Error fetching news articles:', error);
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
}

