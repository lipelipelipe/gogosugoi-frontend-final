// src/app/categories/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anime Categories - GogoSugoi',
  description: 'Browse all anime categories and genres on GogoSugoi.',
};

// Exemplo de dados, o ideal é buscar isso da sua API no futuro
// ex: const categories = await getCategories();
const exampleCategories = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Magic',
  'Supernatural', 'Horror', 'Mystery', 'Psychological', 'Romance',
  'Sci-Fi', 'Slice of Life', 'Sports', 'Isekai', 'Mecha'
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8 border-l-4 border-orange-500 pl-4">
        Browse by Category
      </h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {exampleCategories.map((category) => (
          <Link 
            // No futuro, o link levaria para uma página de resultados: href={`/category/${category.toLowerCase()}`}
            href="#" 
            key={category}
            className="block text-center font-semibold p-6 rounded-lg bg-gray-800 transition-transform transform hover:scale-105 hover:bg-orange-500 hover:text-black"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}