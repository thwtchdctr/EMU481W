//backend news api, in use

//imports
import axios from 'axios';
import Sentiment from "sentiment";
import keywordExtractor from "keyword-extractor";

//Lemmatization not in use
import winkLemmatizer from "wink-lemmatizer";

//Initialize sentiment
const sentiment = new Sentiment();

//category keyword dictionaries for each category
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

/*
 * @function -> categorizeArticle(): Natural language processing (lexicon strategy) algorithm for keyword extraction from news articles to allow for 
 * categorization into accurate category. Algorithm is only ~80% accurate. Dictionaries need to be improved and lemmatization should be implemented.
 * @param -> content (string): content of article, pulled from API
 * @param -> description (string): brief description of article, pulled from API
 * @param -> headline (string): headline of article, pulled from API
 * @returns -> Array that represents the top three categories of the news article
 */
function categorizeArticle(content, description, headline) {
  //Extracts keywords by turning article content, desc, and headline to lower case, removing digits
  const keywords = keywordExtractor.extract(
    (content + " " + description + " " + headline).toLowerCase(),
    {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
    }
  );

  //Initialize category scores
  const categoryScores = {
    RealEstate: 0,
    Politics: 0,
    Economy: 0,
    Technology: 0,
    Finance: 0,
  };

  //For each category, keywordList pairing from categoryKeywords, check if each keyword from keywords is in that category pairing
  Object.entries(categoryKeywords).forEach(([category, keywordsList]) => {
    keywords.forEach((keyword) => {
      //if it is
      if (keywordsList.includes(keyword)) {
        //increase that category's score
        categoryScores[category]++;
      }
    });
  });

  //Sort categories by category score (max --> min)
  const sortedCategories = Object.entries(categoryScores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  //return top 3 categories
  return sortedCategories.slice(0, 3);
}
/* @function -> GET(): Backend GET() call to NewsAPI's everything API
 * @returns -> article information
 */
export async function GET() {
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

    //For each article retrieved from the API call
    const articles = response.data.articles.map((article, index) => {
      //get sentiment result
      const sentimentResult = sentiment.analyze(
        (article.content + " " + article.description + " " + article.headline).toLowerCase()
      );
      //get categories by categorizing the article
      const categories = categorizeArticle(
        article.content || "",
        article.description || "",
        article.headline || ""
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