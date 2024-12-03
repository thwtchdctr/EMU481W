//backend news api, in use

//imports
import axios from 'axios';
import Sentiment from "sentiment";

//Lemmatization not in use
import lemmatizer from "lemmatizer";

const TODAY = new Date();
const TWODAYSAGO = new Date(TODAY.getTime() - 2 * 24 * 60 * 60 * 1000);

//Initialize sentiment
const sentiment = new Sentiment();

//category keyword dictionaries for each category
const categoryKeywords = {
  RealEstate: [
    // Weight: 3
    { word: "real estate", weight: 3 }, { word: "department of housing", weight: 3 },
    { word: "landlord", weight: 3 }, { word: "rent", weight: 3 }, { word: "lease", weight: 3 },
    { word: "mortgage", weight: 3 }, { word: "tenant", weight: 3 }, { word: "squatter", weight: 3 },
    { word: "squat", weight: 3 }, { word: "housing", weight: 3 },
    { word: "zone", weight: 3 }, { word: "zone law", weight: 3 }, { word: "foreclosure", weight: 3 },

    // Weight: 2
    { word: "residential", weight: 2 }, { word: "commercial", weight: 2 }, 
    { word: "condo", weight: 2 }, { word: "apartment", weight: 2 }, 
    { word: "house", weight: 2 }, { word: "renovate", weight: 2 },

    // Weight: 1
    { word: "community", weight: 1 }, { word: "inspect", weight: 1 },
    { word: "capital", weight: 1 }, { word: "transact", weight: 1 }, { word: "price", weight: 1 },
    { word: "multi family", weight: 1 }, { word: "single family", weight: 1 }, { word: "shortage", weight: 1},
    { word: "land use", weight: 1 }, { word: "vacant", weight: 1 }, { word: "estate law", weight: 1 },
    { word: "rural", weight: 1 }, { word: "urban", weight: 1 }, { word: "title company", weight: 1 },
    { word: "hoa", weight: 1 }, { word: "escrow", weight: 1 }, { word: "invest", weight: 1 },
    { word: "airbnb", weight: 1 }, { word: "vrbo", weight: 1 }, { word: "hotel", weight: 1 },
    { word: "scarce", weight: 1 }, { word: "develop", weight: 1 }, { word: "construct", weight: 1 },    
  ],
  Politics: [
    // Weight: 3
    { word: "donald trump", weight: 3 }, { word: "joe biden", weight: 3 }, { word: "politics", weight: 3},
    { word: "jd vance", weight: 3 }, { word: "kamala harris", weight: 3 }, { word: "tim walz", weight: 3 },
    { word: "trump", weight: 3 }, { word: "biden", weight: 3 }, { word: "vance", weight: 3 },  {word: "gop", weight: 3},
    { word: "harris", weight: 3 }, { word: "walz", weight: 3 }, {word: "tulsi", weight: 3}, {word: "gabbard", weight: 3},
    { word: "hegseth", weight: 3 }, { word: "government", weight: 3 }, { word: "policy", weight: 3 },
    { word: "elect", weight: 3 }, { word: "senate", weight: 3 }, {word: "representative", weight: 3},
    { word: "congress", weight: 3 }, { word: "house of representative", weight: 3 }, { word: "pelosi", weight: 3},
    { word: "president", weight: 3 }, { word: "vice president", weight: 3 }, { word: "legislate", weight: 3 },
    { word: "republican", weight: 3 }, { word: "democrat", weight: 3 }, { word: "polustics", weight: 3},
    { word: "constitution", weight: 3 }, { word: "law", weight: 3 }, { word: "right", weight: 3 },
    { word: "liberal", weight: 3 }, { word: "conservative", weight: 3 }, { word: "obama", weight: 3},

    // Weight: 2
    { word: "ukraine", weight: 2 }, { word: "russia", weight: 2 }, { word: "israel", weight: 2 },
    { word: "palestine", weight: 2 }, { word: "hamas", weight: 2 }, {word: "border", weight: 2},
    { word: "iran", weight: 2 }, { word: "protest", weight: 2 }, { word: "coalition", weight: 2 },
    { word: "bureaucracy", weight: 2 }, { word: "diplomacy", weight: 2 }, { word: "homeland", weight: 2},
    { word: "candidate", weight: 2 }, { word: "democracy", weight: 2 }, {word: "fbi", weight: 2},
    { word: "misinformation", weight: 2}, { word: "nation", weight: 2}, {word: "secure", weight: 2},
    { word: "campaign", weight: 2}, {word: "tarusffs", weight: 2}, {word: "hezbollah", weight: 2},
    { word: "taiwan", weight: 2},

    // Weight: 1
    { word: "policy make", weight: 1 }, { word: "policy analysis", weight: 1 }, { word: "crime", weight: 1}, { word: "migrant", weight: 1},
    { word: "grassroot", weight: 1 }, { word: "party", weight: 1 }, { word: "debate", weight: 1 }, {word: "preside", weight: 1},
    { word: "tax", weight: 1 }, { word: "advocacy", weight: 1 }, { word: "federal", weight: 1 }, {word: "alliance", weight: 1},
    { word: "foreign", weight: 1 }, { word: "economy", weight: 1 }, {word: "kash", weight: 1}, {word: "attorney", weight: 1},
    { word: "inflate", weight: 1 }, { word: "recess", weight: 1 }, {word: "patel", weight: 1}, {word: "mexico", weight: 1},
    { word: "trade", weight: 1 }, { word: "tariff", weight: 1 }, {word: "privacy", weight: 1}, {word: "house", weight: 1}, 
  ],
  Economy: [
    // Weight: 5
    { word: "economy", weight: 5 }, 
    
    // Weight: 3
    { word: "inflate", weight: 3 }, { word: "recess", weight: 3 },
    { word: "gdp", weight: 3 }, { word: "tariff", weight: 3 },
    { word: "employ", weight: 3 }, { word: "unemploy", weight: 3 }, { word: "supply", weight: 3 },
    { word: "demand", weight: 3 }, { word: "revenue", weight: 3 },
    { word: "currency", weight: 3 }, { word: "import", weight: 3 }, { word: "export", weight: 3 },
    { word: "economic", weight: 3 }, { word: "retire", weight: 3}, 
  
    // Weight: 2
    { word: "surplus", weight: 2 }, { word: "grow", weight: 2 }, { word: "stable", weight: 2 },
    { word: "commodity", weight: 2 }, { word: "financial policy", weight: 2 }, { word: "regulation", weight: 2},
    { word: "monetary policy", weight: 2 }, { word: "labor market", weight: 2 }, { word: "union", weight: 2},
    { word: "productive", weight: 2 }, { word: "market", weight: 2 }, { word: "trade", weight: 2},  { word: "strike", weight: 2},
    { word: "immigration", weight: 2},
  
    // Weight: 1
    { word: "manufacture", weight: 1 }, { word: "retail", weight: 1 }, { word: "value", weight: 1 },
    { word: "bank", weight: 1 }, { word: "credit", weight: 1 }, { word: "federal", weight: 1}, { word: "borrow", weight: 1},
    { word: "debit", weight: 1 }, { word: "outlook", weight: 1 }, { word: "resource allocate", weight: 1 },
    { word: "scarce", weight: 1 }, { word: "stock", weight: 1 }, { word: "interest", weight: 1}, { word: "stock", weight: 1},
    { word: "airport", weight: 1 }, { word: "price", weight: 1 }, { word: "rich", weight: 1 }, { word: "ceo", weight: 1},
    { word: "board", weight: 1}, { word: "shortage", weight: 1}, { word: "worker", weight: 1},
  ],
  Technology: [
  // Weight: 3
  { word: "technology", weight: 3 }, { word: "tech", weight: 3 }, { word: "innovate", weight: 3 },
  { word: "innovation", weight: 3 }, { word: "software", weight: 3 }, { word: "datum", weight: 3},
  { word: "hardware", weight: 3 }, {word: "robot", weight: 3}, { word: "cybersecurity", weight: 3 }, { word: "siri", weight: 3},
  { word: "neural network", weight: 3 }, { word: "processor", weight: 3 }, { word: "iot", weight: 3 }, { word: "android", weight: 3},

  // Weight: 2
  { word: "internet", weight: 2 }, { word: "compute", weight: 2 }, { word: "cyber", weight: 2 }, { word: "ai", weight: 2 }, 
  { word: "blockchain", weight: 2 }, { word: "cloud", weight: 2 }, { word: "analytic", weight: 2 }, { word: "automate", weight: 2 },
  { word: "mobile", weight: 2 }, { word: "encrypt", weight: 2 }, { word: "cyberguy", weight: 2}, { word: "artificial", weight: 2 },
  { word: "develop", weight: 2 }, { word: "aerospace", weight: 2 }, { word: "openai", weight: 2}, { word: "chatbots", weight: 2},
  { word: "aviation", weight: 2}, { word: "hypersonic", weight: 2},  { word: "intelligence", weight: 2}, { word: "encrypt", weight: 2},
  { word: "ios", weight: 2}, { word: "amazon", weight: 2}, { word: "nuclear", weight: 2}, { word: "power", weight: 2},

  // Weight: 1
  { word: "big data", weight: 1 }, { word: "storage", weight: 1 }, { word: "tesla", weight: 1 }, {word: "number", weight: 1},
  { word: "elon musk", weight: 1 }, { word: "elon", weight: 1 }, { word: "privacy", weight: 1}, {word: "technical", weight: 1},
  { word: "musk", weight: 1 }, { word: "bill gates", weight: 1 }, { word: "x", weight: 1 }, {word: "scammer", weight: 1},
  { word: "facebook", weight: 1 }, { word: "youtube", weight: 1 }, { word: "power", weight: 1}, {word: "train", weight: 1},
  { word: "stream", weight: 1 }, { word: "privacy", weight: 1 }, { word: "airport", weight: 1 }, {word: "jet", weight: 1},
  { word: "misinformation", weight: 1}, {word: "study", weight: 1}, {word: "phone", weight: 1}, { word: "online", weight: 1 },
  { word: "tech", weight: 1}, { word: "imessage", weight: 1 }, { word: "text", weight: 1}, { word: "cybercriminals", weight: 1}, 
  { word: "cyberscammers", weight: 1}, {word: "virtual", weight: 1}, {word: "network", weight: 1}, { word: "smart", weight: 1},
  { word: "eyeglass", weight: 1 }, 
],
  Finance: [
    // Weight: 3
    { word: "investment", weight: 3 }, { word: "dividend", weight: 3 }, {word: "bitcoin", weight: 3},
    { word: "loan", weight: 3 }, {word: "stock", weight: 3}, { word: "market", weight: 3}, { word: "financial", weight: 3},
  
    // Weight: 2
    { word: "bank", weight: 2 }, { word: "bank", weight: 2 }, 
    { word: "bond", weight: 2 }, { word: "portfolio", weight: 2 }, { word: "credit", weight: 2 },
    { word: "fund", weight: 2 }, { word: "hedge fund", weight: 2 }, { word: "trade", weight: 2 },
    { word: "capital", weight: 2 }, { word: "account", weight: 2 }, { word: "borrow", weight: 2 },
    { word: "expense", weight: 2 }, { word: "revenue", weight: 2 }, { word: "profit", weight: 2 },
    { word: "tax", weight: 2 }, { word: "retirement", weight: 2 }, { word: "finance", weight: 2 },
    { word: "forex", weight: 2 }, { word: "crypto", weight: 2 }, { word: "currency", weight: 2},
    { word: "etf", weight: 2 }, { word: "equity", weight: 2 }, { word: "invest", weight: 2},
    { word: "asset", weight: 2 }, { word: "liable", weight: 2 },
  
    // Weight: 1
    { word: "insurance", weight: 1 }, { word: "valuation", weight: 1 },
    { word: "tax bracket", weight: 1 }, { word: "digital bank", weight: 1 },
    { word: "economic policy", weight: 1 }, { word: "ceo", weight: 1 }, { word: "card", weight: 1 },
    { word: "institution", weight: 1 }, { word: "board", weight: 1 }, { word: "delinquency", weight: 1 }, 
  ],
  Other: [
    {word: "dental", weight: 3}, {word: "coach", weight: 3}, {word: "exercise", weight: 3}, {word: "eat", weight: 3}, {word: "sale", weight: 1},
    {word: "black", weight: 2}, {word: "merchandise", weight: 1}, {word: "athlete", weight: 3}, {word: "valor", weight: 1}, {word: "costner", weight: 3},
    {word: "drama", weight: 1}, {word: "affleck", weight: 3}, {word: "hollywood", weight: 1}, {word: "movie", weight: 2}, {word: "murder", weight: 3},
    {word: "homicide", weight: 3}, {word: "football", weight: 5}, {word: "basketball", weight: 5}, {word: "touchdown", weight: 5}, {word: "golf", weight: 5},
    {word: "pga", weight: 5}, {word: "mom", weight: 3}, {word: "disappear", weight: 1},
  ]
};

/*
 * @function -> categorizeArticle(): Natural language processing (lexicon strategy) algorithm for keyword extraction from news articles to allow for 
 * categorization into accurate category. Algorithm is only ~90% accurate. Dictionaries need to be improved and lemmatization should be implemented.
 * @param -> content (string): content of article, pulled from API
 * @param -> description (string): brief description of article, pulled from API
 * @param -> headline (string): headline of article, pulled from API
 * @returns -> Array that represents the top three categories of the news article
 */
function categorizeArticle(content, description, headline) {
  // Combine text from content, description, and headline
  const text = (content + " " + description + " " + headline)
    .toLowerCase()
    .replace(/[^a-z0-9-\s]/gi, '')
    .replace(/-/g, ' ');

  // Lemmatize the words in the text
  const words = text.split(/\s+/).map(word => lemmatizer(word));

  // Initialize category scores, including "Other"
  const categoryScores = {
    RealEstate: 0,
    Politics: 0,
    Economy: 0,
    Technology: 0,
    Finance: 0,
    Other: 0,
  };

  // Calculate scores for each category
  Object.entries(categoryKeywords).forEach(([category, keywordsList]) => {
    keywordsList.forEach(({ word, weight }) => {
      const occurrences = words.filter(w => w === word).length;
      if (occurrences > 0) {
        categoryScores[category] += occurrences * weight;
      }
    });
  });

  // Log category scores
  const scoresLog = Object.entries(categoryScores)
    .map(([category, score]) => `${category}: ${score}`)
    .join(" | ");

  // Determine the category based on new logic
  const maxScore = Math.max(...Object.values(categoryScores));

  if (maxScore === 0) {
    return ["Other"]; // All scores are zero
  }

  // Collect all categories within 5 points of the max score
  const topCategories = Object.entries(categoryScores)
    .filter(([, score]) => maxScore - score <= 8 && score > 0)
    .map(([category]) => category);

  return topCategories;
}

/* @function -> GET(): Backend GET() call to NewsAPI's everything API
 * @returns -> article information
 */
export async function GET() {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'finance OR technology OR real estate OR politics OR economics',
        language: 'en',
        sortBy: 'relevancy',
        domains: 'foxnews.com,cnn.com,msnbc.com,nytimes.com,cnbc.com,theguardian.com',
        from: TWODAYSAGO,
        to: TODAY,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    //For each article retrieved from the API call
    const articles = response.data.articles.map((article, index) => {
      //get sentiment result
      const sentimentResult = sentiment.analyze(
        (article.content + " " + article.description + " " + article.title).toLowerCase()
      );
      //get categories by categorizing the article
      const categories = categorizeArticle(
        article.content || "",
        article.description || "",
        article.title || ""
      );

      return {
        id: index,
        title: article.title,
        description: article.description,
        source: article.source.name,
        date: article.publishedAt,
        content: article.content,
        imageUrl: article.urlToImage,
        url: article.url,
        sentiment: sentimentResult.score,
        categories, // Top 1-3 categories
      };
    });

    return new Response(JSON.stringify({ articles }), { status: 200 });
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch news articles' }), { status: 500 });
  }
}