// app/api/articles/[id]/route.js
import axios from 'axios';
import Sentiment from "sentiment";
import keywordExtractor from "keyword-extractor";

const sentiment = new Sentiment();

const categoryKeywords = {
  RealEstate: ["real estate", "property", "housing", "mortgage", "realtor", "rental"],
  Investments: ["investment", "stocks", "market", "shares", "bonds", "portfolio"],
  Politics: ["politics", "election", "government", "policy", "congress", "senate", "president"],
  Economy: ["economy", "inflation", "unemployment", "gdp", "trade", "recession", "growth"]
};

// Function to categorize an article based on extracted keywords
function categorizeArticle(content) {
  const keywords = keywordExtractor.extract(content, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });

  // Initialize scores for each category
  const categoryScores = {
    RealEstate: 0,
    Investments: 0,
    Politics: 0,
    Economy: 0,
  };

  // Score each category based on keyword matches
  Object.entries(categoryKeywords).forEach(([category, keywordsList]) => {
    keywords.forEach((keyword) => {
      if (keywordsList.includes(keyword)) {
        categoryScores[category]++;
      }
    });
  });

  // Determine the category with the highest score
  return Object.keys(categoryScores).reduce((a, b) =>
    categoryScores[a] > categoryScores[b] ? a : b
  );
}


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
    const sentimentResult = sentiment.analyze(article.content || "");
    var sentimentString = "";
    const category = categorizeArticle(article.content || "");

    if(sentimentResult.score > 1){
      sentimentString = "Positive";
    } else if(sentimentResult.score < 0){
      sentimentString = "Negative";
    } else {
      sentimentString = "Neutral";
    }

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
      sentiment: sentimentString,
      category: category
    };

    return new Response(JSON.stringify(formattedArticle), { status: 200 });
  } catch (error) {
    console.error('Error fetching article:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch article' }), { status: 500 });
  }
}

