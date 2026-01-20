import { Link } from "react-router";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">NS</span>
              </div>
              <div>
                <div className="text-lg font-bold text-white">Novel Sphere</div>
                <div className="text-xs text-gray-400">Vacations</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Discover Your Next Journey. Personalized trips across Asia, Europe, UAE, Australia & Worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-blue-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-blue-500 transition">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-blue-500 transition">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-500 transition">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-blue-500 transition">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-blue-500 transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/destinations/singapore" className="hover:text-blue-500 transition">
                  Singapore
                </Link>
              </li>
              <li>
                <Link to="/destinations/dubai" className="hover:text-blue-500 transition">
                  Dubai
                </Link>
              </li>
              <li>
                <Link to="/destinations/bali" className="hover:text-blue-500 transition">
                  Bali
                </Link>
              </li>
              <li>
                <Link to="/destinations/maldives" className="hover:text-blue-500 transition">
                  Maldives
                </Link>
              </li>
              <li>
                <Link to="/destinations/thailand" className="hover:text-blue-500 transition">
                  Thailand
                </Link>
              </li>
              <li>
                <Link to="/destinations/europe" className="hover:text-blue-500 transition">
                  Europe
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>
                  1st Floor, Wework, Olympia Cyberspace, Guindy, Chennai, Tamil Nadu 600032
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <a href="tel:8248596124" className="hover:text-blue-500 transition">
                  8248596124
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <a href="mailto:info@novelspherevacations.in" className="hover:text-blue-500 transition">
                  info@novelspherevacations.in
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>10 AM – 7 PM (Visit by appointment only)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              © 2025 Novel Sphere Vacations. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="hover:text-blue-500 transition">
                Privacy Policy
              </Link>
              <Link to="/terms-and-conditions" className="hover:text-blue-500 transition">
                Terms & Conditions
              </Link>
              <Link to="/cancellation-policy" className="hover:text-blue-500 transition">
                Cancellation Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
