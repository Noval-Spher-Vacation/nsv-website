import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import WhatsAppButton from "@/react-app/components/WhatsAppButton";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

interface Destination {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  region: string;
  country: string;
}

interface Package {
  id: number;
  title: string;
  slug: string;
  duration_days: number;
  duration_nights: number;
  price_inr_min: number;
  image_url: string;
  highlights: string;
}

export default function DestinationDetailPage() {
  const { slug } = useParams();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchDestination();
      fetchPackages();
    }
  }, [slug]);

  const fetchDestination = async () => {
    try {
      const response = await fetch(`/api/destinations/${slug}`);
      const data = await response.json();
      setDestination(data);
    } catch (error) {
      console.error("Error fetching destination:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch(`/api/packages?destination=${slug}`);
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Destination not found</h2>
            <Link to="/destinations" className="text-blue-600 hover:text-blue-700">
              Browse all destinations
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src={destination.image_url}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{destination.name}</h1>
            <p className="text-xl text-gray-200 flex items-center">
              <MapPin className="w-6 h-6 mr-2" />
              {destination.country}, {destination.region}
            </p>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About {destination.name}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{destination.description}</p>
          </div>
        </div>
      </section>

      {/* Available Packages */}
      {packages.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Available Packages to {destination.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <Link
                  key={pkg.id}
                  to={`/packages/${pkg.slug}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={pkg.image_url}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {pkg.duration_days}D/{pkg.duration_nights}N
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pkg.highlights}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{pkg.price_inr_min.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-blue-600 group-hover:translate-x-2 transition" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Explore {destination.name}?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Let us create the perfect itinerary for your journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition shadow-xl inline-block"
              >
                Get Custom Quote
              </Link>
              <a
                href="tel:8248596124"
                className="bg-blue-500/20 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-500/30 transition inline-block"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
