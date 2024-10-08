"use client";  // Ensures the useEffect and useState work in this component

import { useEffect, useState } from "react";

// Define the type for the news article
type Article = {
  id: number;
  title: string;
  description: string;
  source: string;
  date: string;
  content: string;
  imageUrl: string;
};

// Simulating fetched news data
const sampleNews: Article[] = [
  {
    id: 1,
    title: "Stocks Surge as Market Optimism Grows",
    description: "Stock markets have surged due to increased optimism regarding the upcoming earnings reports.",
    source: "Financial Times",
    date: "October 7, 2024",
    content: `
      The stock market has been experiencing significant gains as optimism about upcoming earnings reports grows. Investors are excited 
      about the potential positive performance of major companies in key sectors such as technology and healthcare. Experts predict that 
      the rally could continue if earnings exceed expectations. However, some caution remains about the ongoing inflation and its 
      potential impact on future growth prospects.
      
      Many traders are focusing on key stocks that are expected to deliver strong quarterly results. The tech sector, in particular, 
      has been leading the surge, with stocks like Apple, Microsoft, and Google posting notable gains. Meanwhile, the energy sector 
      is also seeing growth as oil prices stabilize.
      
      Financial analysts suggest that while the short-term outlook is positive, investors should remain cautious and diversify their 
      portfolios to mitigate potential risks from market volatility. The next few weeks will be crucial in determining whether the 
      optimism continues or the market faces corrections.
    `,
    imageUrl: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNzQzMTZ8MHwxfGFsbHwxfHx8fHx8fHwxNjM4NzgyMDEz&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 2,
    title: "Real Estate Market Trends: What to Expect in 2025",
    description: "Experts discuss the expected trends in the real estate market and how to prepare for changes.",
    source: "Real Estate Daily",
    date: "October 6, 2024",
    content: `
      The real estate market is expected to undergo significant changes in 2025 due to a combination of economic, demographic, and 
      technological factors. Rising interest rates will likely have a cooling effect on housing demand, especially in metropolitan areas 
      that have experienced rapid price growth in recent years. First-time homebuyers may face challenges as mortgage rates climb, 
      pushing affordability further out of reach for many.

      However, the demand for rental properties is expected to remain strong as more people opt to rent rather than buy. Cities with 
      strong job markets, such as Austin, Nashville, and Denver, will likely see continued interest from renters and real estate investors 
      alike.

      Additionally, the focus on sustainable and energy-efficient housing is expected to grow. Homebuyers and investors are becoming 
      more conscious of environmental concerns, leading to a rise in the popularity of green buildings. Developers are increasingly 
      integrating renewable energy sources, such as solar panels, into new construction projects. Smart home technology will also play 
      a bigger role, with more properties being equipped with features that offer energy savings and enhanced security.

      While there are uncertainties, the long-term outlook for real estate remains optimistic. Investors are encouraged to diversify 
      their portfolios and explore opportunities in growing sectors such as multi-family developments and commercial real estate.
    `,
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNzQzMTZ8MHwxfGFsbHwxfHx8fHx8fHwxNjM4NzgyMDEz&ixlib=rb-1.2.1&q=80&w=400",
  },
  {
    id: 3,
    title: "Investing in Green Energy: Opportunities and Risks",
    description: "Green energy stocks are on the rise. Learn about the opportunities and risks of investing in this sector.",
    source: "Investment Weekly",
    date: "October 5, 2024",
    content: `
      The green energy sector has emerged as one of the fastest-growing investment opportunities, driven by global efforts to combat 
      climate change and transition to a sustainable future. Companies involved in renewable energy sources such as solar, wind, and 
      hydropower have seen significant growth, making green energy stocks highly attractive to investors.

      Governments worldwide are setting ambitious targets to reduce carbon emissions, and many have introduced subsidies and incentives 
      to promote the adoption of renewable energy. These factors are expected to drive the continued growth of the green energy sector 
      over the coming years. Solar energy companies, in particular, are benefiting from increased demand for clean electricity, while 
      wind energy projects are seeing rapid expansion.

      However, investing in green energy comes with its share of risks. The sector is still highly dependent on government subsidies, 
      and any changes in policy could significantly impact the profitability of renewable energy companies. Additionally, the sector is 
      vulnerable to fluctuations in commodity prices, which can affect the cost of raw materials used in the production of solar panels 
      and wind turbines.

      Investors should also be mindful of the competitive landscape. As more companies enter the market, competition may increase, 
      potentially driving down profit margins. Despite these challenges, many experts believe that the long-term outlook for green 
      energy remains positive, with substantial growth opportunities for well-positioned companies.
    `,
    imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNzQzMTZ8MHwxfGFsbHwxfHx8fHx8fHwxNjM4NzgyMDEz&ixlib=rb-1.2.1&q=80&w=400",
  },
];

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const newsItem = sampleNews.find((news) => news.id === Number(params.id));
    if (newsItem) {
      setArticle(newsItem);
    }
  }, [params.id]);

  if (!article) {
    return <p>Loading...</p>;
  }

  return (
    <section className="container mx-auto py-12 bg-gradient-to-br from-green-100 to-teal-100">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-64 object-cover mb-6 rounded"
        />
        <h1 className="text-4xl font-bold text-teal-700 mb-4">{article.title}</h1>
        <p className="text-gray-700 mb-6">{article.description}</p>
        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{article.content}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 mt-6">
          <span>{article.source}</span>
          <span>{article.date}</span>
        </div>
      </div>
    </section>
  );
}


