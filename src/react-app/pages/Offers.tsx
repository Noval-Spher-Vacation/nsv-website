import { useEffect, useState } from "react";
import { Link } from "react-router";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import WhatsAppButton from "@/react-app/components/WhatsAppButton";
import { Tag, Calendar, AlertCircle } from "lucide-react";

interface Offer {
  id: number;
  title: string;
  description: string;
  terms: string;
  discount_percent: number;
  valid_till: string;
  image_url: string;
  is_active: number;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    const response = await fetch("/api/offers");
    const data = await response.json();
    setOffers(data);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Special Offers</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Exclusive deals and discounts on amazing destinations
            </p>
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {offers.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No active offers at the moment</p>
              <p className="text-gray-500 mt-2">Check back soon for exciting deals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      {offer.discount_percent}% OFF
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{offer.title}</h3>
                    <p className="text-gray-700 mb-4">{offer.description}</p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-1">Terms & Conditions</p>
                          <p className="text-sm text-gray-700">{offer.terms}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span className="text-sm">Valid till {formatDate(offer.valid_till)}</span>
                    </div>

                    <Link
                      to="/contact"
                      className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Don't Miss Out on These Deals!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Contact us today to take advantage of these limited-time offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg inline-block"
            >
              Get Free Quote
            </Link>
            <a
              href="https://wa.me/918248596124"
              className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition shadow-lg inline-block"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
