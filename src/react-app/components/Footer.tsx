import { Link } from "react-router";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0b0a12] text-white/70 border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#ff5cb8] to-[#7f4dff] rounded-full flex items-center justify-center shadow-[0_0_18px_rgba(255,92,184,0.35)]">
                <span className="text-white font-bold text-xl">NS</span>
              </div>
              <div>
                <div className="text-lg font-bold text-white">Novel Sphere</div>
                <div className="text-xs text-white/50">Vacations</div>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-4">
              Discover Your Next Journey. Personalized trips across Asia, Europe, UAE, Australia & Worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/50 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/50 hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/50 hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/50 hover:text-white transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-white transition">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-white transition">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-white transition">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition">
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
                <Link to="/destinations/singapore" className="hover:text-white transition">
                  Singapore
                </Link>
              </li>
              <li>
                <Link to="/destinations/dubai" className="hover:text-white transition">
                  Dubai
                </Link>
              </li>
              <li>
                <Link to="/destinations/bali" className="hover:text-white transition">
                  Bali
                </Link>
              </li>
              <li>
                <Link to="/destinations/maldives" className="hover:text-white transition">
                  Maldives
                </Link>
              </li>
              <li>
                <Link to="/destinations/thailand" className="hover:text-white transition">
                  Thailand
                </Link>
              </li>
              <li>
                <Link to="/destinations/europe" className="hover:text-white transition">
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
                <MapPin className="w-5 h-5 text-[#ff6bd5] flex-shrink-0 mt-0.5" />
                <span>
                  1st Floor, Wework, Olympia Cyberspace, Guindy, Chennai, Tamil Nadu 600032
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#ff6bd5] flex-shrink-0" />
                <a href="tel:8248596124" className="hover:text-white transition">
                  8248596124
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#ff6bd5] flex-shrink-0" />
                <a href="mailto:info@novelspherevacations.in" className="hover:text-white transition">
                  info@novelspherevacations.in
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-[#ff6bd5] flex-shrink-0 mt-0.5" />
                <span>10 AM – 7 PM (Visit by appointment only)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
            <div className="mb-4 md:mb-0">
              © 2025 Novel Sphere Vacations. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="hover:text-white transition">
                Privacy Policy
              </Link>
              <Link to="/terms-and-conditions" className="hover:text-white transition">
                Terms & Conditions
              </Link>
              <Link to="/cancellation-policy" className="hover:text-white transition">
                Cancellation Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
