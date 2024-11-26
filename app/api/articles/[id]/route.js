//Comments similar to news route.js
import axios from 'axios';
import Sentiment from "sentiment";
import keywordExtractor from "keyword-extractor";

const sentiment = new Sentiment();

const categoryKeywords = {
  RealEstate: [
    "property", "housing", "home", "rent", "lease", "mortgage", "realtor", "broker",
    "landlord", "tenant", "appraisal", "equity", "investment", "bubble", "tax",
    "foreclosure", "ownership", "sales", "listings", "renovation", "development",
    "valuation", "construction", "realty", "zoning", "rental", "estate", "houses",
    "apartments", "condos", "deed", "loans", "refinancing", "suburbs", "urban",
    "contracts", "realtors", "price", "commission", "market", "subdivision",
    "closing", "escrow", "inspection", "appraiser", "vacancy", "portfolio", 
    "residential", "commercial", "property", "capital", "flip", "rehab", "tenant",
    "management", "homeowner", "land", "acreage", "planner", "planner", "zone",
    "developer", "community", "valuation", "housing", "transactions", "sales",
    "offices", "agents", "fees", "listings", "unit", "rehabs"
  ],
  Politics: [
    "politic", "government", "policy", "election", "senate", "congress", "president",
    "campaign", "party", "republican", "democrat", "legislation", "voting", "ballot",
    "debate", "law", "cabinet", "diplomacy", "governance", "bureaucracy", "lobbyist",
    "committee", "reform", "agenda", "candidate", "vote", "parliament", "coalition",
    "minister", "representative", "democracy", "authoritarian", "conservative", 
    "liberal", "executive", "judicial", "legislative", "convention", "treaty", 
    "referendum", "regulation", "taxation", "mandate", "impeachment", "pact", 
    "diplomatic", "treaties", "conflict", "negotiations", "policy", "activism", 
    "protest", "rights", "freedom", "federal", "state", "municipal", "constitution", "hegseth", "trump",
    "harris", "walz", "vance", "elon", "musk", "maga", "mehmet", "oz", "matt", "gaetz", "congressman",
    "secretary", "pick", "republicans", "lutnik", "trumps", "administration", "president-elect", "msnbc"
  ],
  Economy: [
    "economy", "inflation", "recession", "growth", "trade", "gdp", "markets", 
    "employment", "unemployment", "exports", "imports", "debt", "deficit", "taxes",
    "revenue", "interest", "rates", "currency", "exchange", "productivity", 
    "industrial", "manufacturing", "commodities", "resources", "retail", "sector", 
    "investment", "stocks", "bonds", "consumer", "spending", "savings", "finance", 
    "banking", "global", "crisis", "stability", "policy", "stimulus", "budget", 
    "subsidy", "reform", "tariff", "surplus", "dividends", "income", "wages", 
    "labor", "supply", "demand", "innovation", "capital", "exports", "services", 
    "economist", "forecast", "equilibrium", "credit", "valuation", "balance", 
    "output", "inflationary", "recall", "bankruptcy", "Goldman", 
  ],
  Technology: [
    "technology", "innovation", "software", "hardware", "internet", "computing", 
    "robotics", "ai", "artificial", "intelligence", "machine", "learning", "data", 
    "analytics", "blockchain", "cybersecurity", "cloud", "virtual", "augmented", 
    "reality", "automation", "gadgets", "devices", "networking", "digital", 
    "systems", "coding", "development", "engineering", "mobile", "apps", "smart", 
    "iot", "wearable", "computers", "processors", "encryption", "quantum", 
    "innovation", "technology", "gaming", "software", "systems", "chips", "ai", 
    "digitalization", "coding", "hardware", "internet", "analysis", "artificial",
    "sensors", "firmware", "devices", "drone", "robotics", "automation", "metaverse", 
    "bioinformatics", "coding", "debugging", "cyberattack", "semiconductors", 
    "hardware", "software", "applications", "interfaces", "integrations", "google", "chrome",
    "bluesky", "threads", "electric", "battery", "power", "ev", "aerospace", "hypersonic", "android",
    "iphone", "tech", "phishing", "tech-savvy", "emails", "messages", "elon", "musk"
  ],
  Finance: [
    "finance", "investment", "banking", "loans", "credit", "mortgages", "taxes", 
    "budgeting", "savings", "accounting", "expenses", "revenue", "profit", "loss", 
    "capital", "equity", "debt", "cash", "liquidity", "forex", "trading", "income", 
    "wealth", "retirement", "pensions", "dividends", "assets", "liabilities", 
    "portfolio", "stocks", "bonds", "valuation", "financial", "strategy", 
    "insurance", "interest", "rates", "returns", "expenditure", "accounts", 
    "forecasting", "wealth", "management", "economic", "account", "audit", 
    "taxation", "capitalization", "fund", "hedging", "profits", "pensions", "cashflow",
    "sustainability", "innovation", "monopoly", "risk", "reward", "doge", "xrp", "Goldman", "Sachs", "bank",
    "funds", "investors",     "investment", "stocks", "market", "shares", "bonds", "portfolio", "mutual",
    "funds", "trading", "returns", "capital", "gains", "equity", "diversification",
    "dividend", "profits", "losses", "risk", "hedge", "venture", "growth",
    "financial", "wealth", "planning", "analysis", "strategy", "yield", "options",
    "trends", "commodities", "crypto", "bitcoin", "currency", "assets", "fund",
    "etfs", "bonds", "real", "securities", "trader", "advisors", "index", "accounts",
    "property", "appraisal", "financial", "forecast", "investors", "insurance",
    "capitalist", "rentrepreneur", "return", "investment", "versatility", "retiring", "restructuring"
  ],
};


function categorizeArticle(content, description, headline) {
  const keywords = keywordExtractor.extract(
    (content + " " + description + " " + headline).toLowerCase(),
    {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
    }
  );

  const categoryScores = {
    RealEstate: 0,
    Politics: 0,
    Economy: 0,
    Technology: 0,
    Finance: 0,
  };

  Object.entries(categoryKeywords).forEach(([category, keywordsList]) => {
    keywords.forEach((keyword) => {
      if (keywordsList.includes(keyword)) {
        categoryScores[category]++;
      }
    });
  });

  const sortedCategories = Object.entries(categoryScores)
    .filter(([, score]) => score > 0) // Include only categories with scores > 0
    .sort((a, b) => b[1] - a[1]) // Sort by scores in descending order
    .map(([category]) => category);

  return sortedCategories.slice(0, 3); // Return up to 3 categories
}

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'finance OR technology OR business OR politics OR economics',
        language: 'en',
        sortBy: 'relevancy',
        domains: 'foxnews.com,cnn.com,msnbc.com,nytimes.com,cnbc.com,theguardian.com',
        from: '2024-11-22',
        to: '2024-11-24',
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const article = response.data.articles[parseInt(id)];
    if (!article) {
      return new Response(JSON.stringify({ error: 'Article not found' }), { status: 404 });
    }

    const sentimentResult = sentiment.analyze((article.content+" "+article.description+" "+article.headline).toLowerCase());
    const categories = categorizeArticle(article.content, article.description, article.headline);

    const formattedArticle = {
      id,
      title: article.title,
      description: article.description,
      source: article.source.name,
      date: article.publishedAt,
      content: article.content,
      imageUrl: article.urlToImage,
      url: article.url,
      sentiment: sentimentResult.score,
      categories,
    };

    return new Response(JSON.stringify(formattedArticle), { status: 200 });
  } catch (error) {
    console.error('Error fetching article:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch article' }), { status: 500 });
  }
}


