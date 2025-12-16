import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiSearch,
  FiLogOut,
  FiChevronDown,
  FiGrid,
} from "react-icons/fi";
import logo from "../assets/canvas-logo.png";
import axios from "axios";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Refs for dropdown timing
  const dropdownTimerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchCartCount();

    // Update cart count on storage changes (guest cart updates in other tabs/components)
    const onStorage = () => fetchCartCount();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        const guest = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        const total = guest.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(total);
        return;
      }
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { "x-auth-token": token },
      });
      setCartCount(res.data.totalItems || 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Handle dropdown mouse enter
  const handleDropdownMouseEnter = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    setIsProductsDropdownOpen(true);
  };

  // Handle dropdown mouse leave
  const handleDropdownMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, 200); // 200ms delay before closing
  };

  // Handle dropdown item click
  const handleDropdownItemClick = () => {
    setIsProductsDropdownOpen(false);
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setIsMenuOpen(false);
  };

  // Set active section based on current route
  useEffect(() => {
    const path = location.pathname;
    
    if (path === "/") {
      // On home page, use IntersectionObserver for sections
      const sections = ["home", "categories", "products", "features"];
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { threshold: 0.6 }
      );

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      });

      return () => observer.disconnect();
    } else {
      // On other pages, set active based on route
      if (path.startsWith("/products")) {
        setActiveSection("products");
      } else if (path === "/cart") {
        setActiveSection("cart");
      } else if (path === "/profile") {
        setActiveSection("profile");
      } else {
        setActiveSection("home");
      }
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // On logout, keep guest cart intact (do nothing) but recompute count
    fetchCartCount();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const navItemClass = (id) =>
    `cursor-pointer transition font-medium ${
      activeSection === id
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-700 hover:text-blue-600"
    }`;

  // Handle products dropdown click
  const handleProductsClick = () => {
    if (location.pathname === "/") {
      scrollToSection("products");
    } else {
      navigate("/#products");
    }
    setIsProductsDropdownOpen(false);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current);
      }
    };
  }, []);

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <div
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src={logo} alt="Canvas Logo" className="h-10 w-10" />
          <span className="text-xl font-bold text-gray-800 hidden sm:inline">
            Canvas
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("home")}
            className={navItemClass("home")}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("categories")}
            className={navItemClass("categories")}
          >
            Categories
          </button>
          
          {/* Products Dropdown */}
          <div 
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <button
              onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
              className={`flex items-center gap-1 ${navItemClass("products")}`}
            >
              Products
              <FiChevronDown className={`transition-transform duration-200 ${isProductsDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            
            {isProductsDropdownOpen && (
              <div 
                className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-lg py-2 z-50 border border-gray-100"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <button
                  onClick={() => {
                    handleProductsClick();
                    handleDropdownItemClick();
                  }}
                  className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 flex items-center gap-2"
                >
                  <FiGrid className="w-4 h-4" />
                  Featured Products
                </button>
                <Link
                  to="/products"
                  onClick={handleDropdownItemClick}
                  className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                >
                  All Products
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => scrollToSection("features")}
            className={navItemClass("features")}
          >
            Features
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex items-center border rounded px-2 py-1"
          >
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none text-sm px-2 w-32"
            />
          </form>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/orders"
                className="text-gray-700 hover:text-blue-600 transition text-sm hidden sm:inline"
                title="My Orders"
              >
                Orders
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 transition"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          <Link
            to="/cart"
            className="relative text-gray-700 hover:text-blue-600 transition"
          >
            <FiShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <button onClick={toggleMenu} className="md:hidden text-gray-700">
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t px-4 py-3 space-y-3">
          <form
            onSubmit={handleSearch}
            className="sm:hidden flex items-center border rounded px-2 py-2 mb-3"
          >
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none text-sm px-2 w-full"
            />
          </form>
          {["home", "categories", "features"].map((id) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`block w-full text-left py-2 ${navItemClass(id)}`}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
          
          {/* Mobile Products Section */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (location.pathname === "/") {
                  scrollToSection("products");
                } else {
                  navigate("/#products");
                }
              }}
              className={`block w-full text-left py-2 ${navItemClass("products")}`}
            >
              Featured Products
            </button>
            <Link
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 pl-4 text-gray-700 hover:text-blue-600 border-l-2 border-gray-200 ml-2"
            >
              All Products
            </Link>
          </div>
          
          <div className="pt-3 border-t">
            {user ? (
              <>
                <Link
                  to="/orders"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  Profile
                </Link>
                <Link
                  to="/cart"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}