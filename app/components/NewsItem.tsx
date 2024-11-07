// app/components/NewsItem.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Article } from './types'; // Ensure this path is correct

interface NewsItemProps {
  article: Article; // Use the Article type
}

const NewsItem: React.FC<NewsItemProps> = ({ article }) => {
  return (
    <Link href={`/news/${article.id}`}>
      <div className="block p-6 bg-white shadow-lg rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <Image
          src={article.imageUrl || "/default-image.jpg"} // Fallback for image
          alt={article.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover mb-4 rounded-t-lg"
        />
        <h2 className="text-2xl font-semibold text-teal-700 mb-2 leading-tight">{article.title}</h2>
        <p className="text-gray-700 mb-4 line-clamp-3">{article.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
          <span>{article.source}</span>
          <span>{new Date(article.date).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default NewsItem;



