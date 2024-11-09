// app/api/news/route.js
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        category: 'business',
        country: 'us',
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const articles = response.data.articles.map((article, index) => ({
      id: index,
      title: article.title,
      description: article.description,
      source: article.source.name,
      date: article.publishedAt,
      content: article.content,
      imageUrl: article.urlToImage,
      url: article.url, // URL to the full article
    }));

    return new Response(JSON.stringify({ articles }), { status: 200 });
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch news articles' }), { status: 500 });
  }
}


