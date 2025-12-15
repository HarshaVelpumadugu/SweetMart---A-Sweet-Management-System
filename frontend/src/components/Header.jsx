import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-md transition-all";

  const variants = {
    default:
      "bg-green-700 text-white hover:bg-green-800 active:bg-green-900 shadow-sm hover:shadow-md",

    ghost:
      "bg-transparent text-gray-700 hover:bg-green-100 hover:text-green-700",
  };

  const sizes = {
    md: "h-10 px-4 py-2 text-sm",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  /* Detect Scroll */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const scrollToCategories = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById("categories");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setIsMobileMenuOpen(false);
  };

  // Handle logo/home click
  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate("/");
    scrollToTop();
  };

  // Close mobile menu when clicking on any link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Check if user is a regular user (not admin or owner)
  const isRegularUser = user && user.role === "user";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-white md:bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={handleHomeClick}
          >
            <span className="text-2xl font-display font-bold text-green-700">
              🍬 SweetMart
            </span>
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="font-medium text-gray-700 hover:text-green-700 active:text-green-800 transition-colors"
              onClick={handleHomeClick}
            >
              Home
            </Link>

            <a
              href="#categories"
              onClick={scrollToCategories}
              className="font-medium text-gray-700 hover:text-green-700 active:text-green-800 transition-colors cursor-pointer"
            >
              Explore
            </a>

            <Link
              to="/search"
              className="font-medium text-gray-700 hover:text-green-700 active:text-green-800 transition-colors"
            >
              Search
            </Link>
          </nav>

          {/* ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {(user?.role === "admin" || user?.role === "owner") && (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon">
                      <ShieldCheck className="h-5 w-5 text-green-700" />
                    </Button>
                  </Link>
                )}

                {/* CART - Only show for regular users */}
                {isRegularUser && (
                  <Link to="/cart" className="relative">
                    <Button variant="ghost" size="icon">
                      <ShoppingCart className="h-5 w-5" />
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {count}
                        </span>
                      )}
                    </Button>
                  </Link>
                )}

                {/* USER + LOGOUT */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="hover:text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? null : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4 animate-fade-in">
            {/* Close button inside menu */}
            <div className="flex justify-end px-4 mb-2">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-green-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                className="px-4 py-2 font-medium text-gray-700 hover:text-green-700"
                onClick={handleHomeClick}
              >
                Home
              </Link>

              <a
                href="#categories"
                onClick={scrollToCategories}
                className="px-4 py-2 font-medium text-gray-700 hover:text-green-700 active:text-green-800 transition-colors cursor-pointer"
              >
                Explore
              </a>

              <Link
                to="/search"
                className="px-4 py-2 font-medium text-gray-700 hover:text-green-700"
                onClick={closeMobileMenu}
              >
                Search
              </Link>

              {user ? (
                <>
                  {(user?.role === "admin" || user?.role === "owner") && (
                    <Link
                      to="/admin"
                      className="px-4 py-2 font-medium text-gray-700 hover:text-green-700 flex items-center gap-2"
                      onClick={closeMobileMenu}
                    >
                      <ShieldCheck className="h-5 w-5 text-green-700" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  {/* CART - Only show for regular users */}
                  {isRegularUser && (
                    <Link
                      to="/cart"
                      className="px-4 py-2 font-medium text-gray-700 hover:text-green-700 flex items-center gap-2"
                      onClick={closeMobileMenu}
                    >
                      <div className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {count > 0 && (
                          <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {count}
                          </span>
                        )}
                      </div>
                      <span>Cart</span>
                    </Link>
                  )}

                  <button
                    className="px-4 py-2 font-medium text-left text-gray-700 hover:text-red-600 flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 font-medium text-gray-700 hover:text-green-700"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="px-4 py-2 font-medium text-gray-700 hover:text-green-700"
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
