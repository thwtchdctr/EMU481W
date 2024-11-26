//import statements
import Layout from '@/components/Layout'; 
import NewsFeed from '@/components/NewsFeed';

/* @function -> NewsPage()
 * @returns -> JSX UI that represents the news feed
 */
export default function NewsPage() {
  return (
    <Layout>
      <NewsFeed />
    </Layout>
  );
}




