import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiSearch,
  FiLogOut
} from 'react-icons/fi';
import logo from '../assets/canvas-logo.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [cartCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const sections = ['home', 'categories', 'products', 'features'];

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const navItemClass = (id) =>
    `cursor-pointer transition font-medium ${
      activeSection === id
        ? 'text-blue-600 border-b-2 border-blue-600'
        : 'text-gray-700 hover:text-blue-600'
    }`;

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">

        <div
          onClick={() => scrollToSection('home')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src={logo} alt="Canvas Logo" className="h-10 w-10" />
          <span className="text-xl font-bold text-gray-800 hidden sm:inline">
            Canvas
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('home')} className={navItemClass('home')}>
            Home
          </button>
          <button onClick={() => scrollToSection('categories')} className={navItemClass('categories')}>
            Categories
          </button>
          <button onClick={() => scrollToSection('products')} className={navItemClass('products')}>
            Products
          </button>
          <button onClick={() => scrollToSection('features')} className={navItemClass('features')}>
            Features
          </button>
        </nav>

        <div className="flex items-center gap-4">

          <div className="hidden sm:flex items-center border rounded px-2 py-1">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="outline-none text-sm px-2 w-32"
            />
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
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
              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Sign Up
              </Link>
            </div>
          )}

          <button className="relative text-gray-700 hover:text-blue-600 transition">
            <FiShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button onClick={toggleMenu} className="md:hidden text-gray-700">
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t px-4 py-3 space-y-3">
          {['home', 'categories', 'products', 'features'].map((id) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`block w-full text-left ${navItemClass(id)}`}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
          <div className="pt-3 border-t">
            {user ? (
              <>
                <Link to="/profile" className="block py-2 text-gray-700 hover:text-blue-600">
                  Profile
                </Link>
                <button onClick={handleLogout} className="block w-full text-left py-2 text-gray-700 hover:text-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="block py-2 text-gray-700 hover:text-blue-600">
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