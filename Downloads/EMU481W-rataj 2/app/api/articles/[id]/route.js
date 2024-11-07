// app/api/articles/[id]/route.js
import axios from 'axios';

export async function GET(req, { params }) {
  const { id } = params;  // Extract 'id' from the route parameters

  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        category: 'business',
        country: 'us',
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const article = response.data.articles[id];

    if (!article) {
      return new Response(JSON.stringify({ error: 'Article not found' }), { status: 404 });
    }

    const formattedArticle = {
      id,
      title: article.title,
      description: article.description,
      source: article.source.name,
      date: article.publishedAt,
      content: article.content,
      imageUrl: article.urlToImage,
      url: article.url,
    };

    return new Response(JSON.stringify(formattedArticle), { status: 200 });
  } catch (error) {
    console.error('Error fetching article:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch article' }), { status: 500 });
  }
}

