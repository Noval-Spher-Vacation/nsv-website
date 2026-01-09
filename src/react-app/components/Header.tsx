import { useState } from "react";
import { Link } from "react-router";
import { Menu, X, ChevronDown, Phone } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [toursOpen, setToursOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">NS</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-gray-900">Novel Sphere</div>
              <div className="text-xs text-gray-600">Vacations</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">
              About
            </Link>

            {/* Destinations Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDestinationsOpen(true)}
              onMouseLeave={() => setDestinationsOpen(false)}
            >
              <button className="flex items-center text-gray-700 hover:text-blue-600 transition">
                Destinations <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {destinationsOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <Link
                    to="/destinations"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    All Destinations
                  </Link>
                  <Link
                    to="/destinations/singapore"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Singapore
                  </Link>
                  <Link
                    to="/destinations/dubai"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Dubai
                  </Link>
                  <Link
                    to="/destinations/bali"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Bali
                  </Link>
                  <Link
                    to="/destinations/maldives"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Maldives
                  </Link>
                </div>
              )}
            </div>

            {/* Tours Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setToursOpen(true)}
              onMouseLeave={() => setToursOpen(false)}
            >
              <button className="flex items-center text-gray-700 hover:text-blue-600 transition">
                Tours <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {toursOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <Link
                    to="/packages"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    All Packages
                  </Link>
                  <Link
                    to="/packages?category=family"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Family Tours
                  </Link>
                  <Link
                    to="/packages?category=honeymoon"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Honeymoon
                  </Link>
                  <Link
                    to="/packages?category=adventure"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Adventure
                  </Link>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center text-gray-700 hover:text-blue-600 transition">
                Services <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2">
                  <Link
                    to="/services"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    All Services
                  </Link>
                  <Link
                    to="/services#visa"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Visa Assistance
                  </Link>
                  <Link
                    to="/services#hotel"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Hotel Booking
                  </Link>
                  <Link
                    to="/services#transport"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Transport & Transfers
                  </Link>
                </div>
              )}
            </div>

            <Link to="/offers" className="text-gray-700 hover:text-blue-600 transition">
              Offers
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition">
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:8248596124"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition"
            >
              <Phone className="w-5 h-5" />
              <span className="font-semibold">8248596124</span>
            </a>
            <Link
              to="/contact"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-600/30"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 hover:text-blue-600 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition py-2">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition py-2">
                About
              </Link>
              <Link to="/destinations" className="text-gray-700 hover:text-blue-600 transition py-2">
                Destinations
              </Link>
              <Link to="/packages" className="text-gray-700 hover:text-blue-600 transition py-2">
                Tours & Packages
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-blue-600 transition py-2">
                Services
              </Link>
              <Link to="/offers" className="text-gray-700 hover:text-blue-600 transition py-2">
                Offers
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition py-2">
                Contact
              </Link>
              <a
                href="tel:8248596124"
                className="text-blue-600 font-semibold py-2 flex items-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>8248596124</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
