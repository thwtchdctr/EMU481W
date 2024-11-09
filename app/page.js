import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto py-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Financial Literacy Website</h1>
      <Link href="/qa">
        <a className="text-teal-500 hover:underline">Go to QA Section</a>
      </Link>
    </div>
  );
}
