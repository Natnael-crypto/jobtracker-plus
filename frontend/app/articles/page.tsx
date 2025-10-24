import Link from "next/link";
import { articles } from "@/data/articles";

export const metadata = {
  title: "Home Renovation & Smart Living Articles",
  description:
    "Explore our curated articles on home renovation, smart homes, sustainable building materials, and interior design trends.",
};

export default function ArticlesPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Home Renovation & Smart Living Articles
        </h1>
        <p className="text-gray-700 text-lg md:text-xl">
          Discover expert insights, tips, and guides to improve your home
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="block p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900">
              {article.title}
            </h2>
            <p className="text-gray-600">Read more about this topic →</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
