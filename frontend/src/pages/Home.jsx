import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import Categories from "../components/Categories.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  return (
    <div className="bg-[#f7fff7]">
      <Header />
      <Hero />
      <Categories />
      <Footer />
    </div>
  );
}
