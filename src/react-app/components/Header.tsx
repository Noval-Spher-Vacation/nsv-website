import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Menu, X, ChevronDown, Phone } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [toursOpen, setToursOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const destinationsRef = useRef<HTMLDivElement>(null);
  const toursRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (destinationsRef.current && !destinationsRef.current.contains(event.target as Node)) {
        setDestinationsOpen(false);
      }
      if (toursRef.current && !toursRef.current.contains(event.target as Node)) {
        setToursOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0b0a12]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff5cb8] to-[#7f4dff] rounded-full flex items-center justify-center shadow-[0_0_18px_rgba(255,92,184,0.45)]">
              <span className="text-white font-bold text-xl">NS</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-white">Novel Sphere</div>
              <div className="text-xs text-white/60">Vacations</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-white/80 hover:text-white transition">
              Home
            </Link>
            <Link to="/about" className="text-white/80 hover:text-white transition">
              About
            </Link>

            {/* Destinations Dropdown */}
            <div className="relative" ref={destinationsRef}>
              <button
                onClick={() => {
                  setDestinationsOpen(!destinationsOpen);
                  setToursOpen(false);
                  setServicesOpen(false);
                }}
                className="flex items-center text-white/80 hover:text-white transition"
              >
                Destinations <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {destinationsOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 glass-panel rounded-lg shadow-lg py-2">
                  <Link
                    to="/destinations"
                    className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setDestinationsOpen(false)}
                  >
                    All Destinations
                  </Link>
                  <Link
                    to="/destinations/singapore"
                    className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setDestinationsOpen(false)}
                  >
                    Singapore
                  </Link>
                  <Link
                    to="/destinations/dubai"
                    className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setDestinationsOpen(false)}
                  >
                    Dubai
                  </Link>
                  <Link
                    to="/destinations/bali"
                    className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setDestinationsOpen(false)}
                  >
                    Bali
                  </Link>
                  <Link
                    to="/destinations/maldives"
                    className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setDestinationsOpen(false)}
                  >
                    Maldives
                  </Link>
                </div>
              )}
            </div>

            {/* Tours Dropdown */}
            <div className="relative" ref={toursRef}>
              <button
                onClick={() => {
                  setToursOpen(!toursOpen);
                  setDestinationsOpen(false);
                  setServicesOpen(false);
                }}
                className="flex items-center text-white/80 hover:text-white transition"
              >
                Tours <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {toursOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 glass-panel rounded-lg shadow-lg py-2">
                  <Link
                    to="/packages"
                    className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setToursOpen(false)}
                  >
                    All Packages
                  </Link>
                  <Link
                    to="/packages?category=family"
                    className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setToursOpen(false)}
                  >
                    Family Tours
                  </Link>
                  <Link
                    to="/packages?category=honeymoon"
                    className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setToursOpen(false)}
                  >
                    Honeymoon
                  </Link>
                  <Link
                    to="/packages?category=adventure"
                    className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setToursOpen(false)}
                  >
                    Adventure
                  </Link>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => {
                  setServicesOpen(!servicesOpen);
                  setDestinationsOpen(false);
                  setToursOpen(false);
                }}
                className="flex items-center text-white/80 hover:text-white transition"
              >
                Services <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 glass-panel rounded-lg shadow-lg py-2">
                  <Link
                    to="/services"
                    className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setServicesOpen(false)}
                  >
                    All Services
                  </Link>
                  <Link
                    to="/services#visa"
                    className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setServicesOpen(false)}
                  >
                    Visa Assistance
                  </Link>
                  <Link
                    to="/services#hotel"
                    className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setServicesOpen(false)}
                  >
                    Hotel Booking
                  </Link>
                  <Link
                    to="/services#transport"
                    className="block px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => setServicesOpen(false)}
                  >
                    Transport & Transfers
                  </Link>
                </div>
              )}
            </div>

            <Link to="/offers" className="text-white/80 hover:text-white transition">
              Offers
            </Link>
            <Link to="/contact" className="text-white/80 hover:text-white transition">
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:8248596124"
              className="flex items-center space-x-2 text-[#ff6bd5] hover:text-white transition"
            >
              <Phone className="w-5 h-5" />
              <span className="font-semibold">8248596124</span>
            </a>
            <Link
              to="/contact"
              className="neon-hover bg-gradient-to-r from-[#ff5cb8] to-[#ff4fd1] text-black px-6 py-2.5 rounded-full shadow-[0_0_18px_rgba(255,92,184,0.4)]"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white/80 hover:text-white transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-white/80 hover:text-white transition py-2">
                Home
              </Link>
              <Link to="/about" className="text-white/80 hover:text-white transition py-2">
                About
              </Link>
              <Link to="/destinations" className="text-white/80 hover:text-white transition py-2">
                Destinations
              </Link>
              <Link to="/packages" className="text-white/80 hover:text-white transition py-2">
                Tours & Packages
              </Link>
              <Link to="/services" className="text-white/80 hover:text-white transition py-2">
                Services
              </Link>
              <Link to="/offers" className="text-white/80 hover:text-white transition py-2">
                Offers
              </Link>
              <Link to="/contact" className="text-white/80 hover:text-white transition py-2">
                Contact
              </Link>
              <a
                href="tel:8248596124"
                className="text-[#ff6bd5] font-semibold py-2 flex items-center space-x-2"
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
