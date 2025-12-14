import { motion } from "framer-motion";

const categories = [
  "cake",
  "chocolate",
  "lollipops",
  "icecream",
  "pudding",
  "pancakes",
  "doughnut",
  "cupcake",
  "cookies",
  "waffle",
];

export default function Categories() {
  return (
    <section
      id="categories"
      className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-10 lg:px-14 bg-[#e8ffe8]"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-8 sm:mb-10 md:mb-12 text-center">
        Explore by Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {categories.map((cat) => (
          <motion.a
            key={cat}
            href={`/category/${cat}`}
            whileHover={{ scale: 1.08 }}
            className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 text-center shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-green-700 hover:shadow-2xl transition-all"
          >
            {cat}
          </motion.a>
        ))}
      </div>
    </section>
  );
}
