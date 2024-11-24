// app/api/news/route.js
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


export async function GET() {
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        category: 'business',
        country: 'us',
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const articles = response.data.articles.map((article, index) => {
      const sentimentResult = sentiment.analyze(article.content || ""); //get sentiment score if content present, else utilize an empty string
      var sentimentString = "";
      const category = categorizeArticle(article.content || "");

      if(sentimentResult.score > 1){
        sentimentString = "Positive";
      } else if(sentimentResult.score < 0){
        sentimentString = "Negative";
      } else {
        sentimentString = "Neutral";
      }

      return{
        id: index,
        title: article.title,
        description: article.description,
        source: article.source.name,
        date: article.publishedAt,
        content: article.content,
        imageUrl: article.urlToImage,
        url: article.url, // URL to the full article
        sentiment: sentimentString, //Attach the sentiment score to the article
        category: category
      }
    })

    return new Response(JSON.stringify({ articles }), { status: 200 });
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch news articles' }), { status: 500 });
  }
}


