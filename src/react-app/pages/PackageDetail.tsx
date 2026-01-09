import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import WhatsAppButton from "@/react-app/components/WhatsAppButton";
import { Calendar, Check, X } from "lucide-react";

interface Package {
  id: number;
  title: string;
  slug: string;
  duration_days: number;
  duration_nights: number;
  price_inr_min: number;
  price_inr_max: number;
  highlights: string;
  inclusions: string;
  exclusions: string;
  image_url: string;
  category: string;
  destination_slug: string;
}

export default function PackageDetailPage() {
  const { slug } = useParams();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPackage();
    }
  }, [slug]);

  const fetchPackage = async () => {
    try {
      const response = await fetch(`/api/packages/${slug}`);
      const data = await response.json();
      setPkg(data);
    } catch (error) {
      console.error("Error fetching package:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseList = (jsonString: string): string[] => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return [];
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

  if (!pkg) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Package not found</h2>
            <Link to="/packages" className="text-blue-600 hover:text-blue-700">
              Browse all packages
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const inclusions = parseList(pkg.inclusions);
  const exclusions = parseList(pkg.exclusions);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img src={pkg.image_url} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4 capitalize">
              {pkg.category}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{pkg.title}</h1>
            <div className="flex items-center text-xl text-gray-200">
              <Calendar className="w-6 h-6 mr-2" />
              {pkg.duration_days} Days / {pkg.duration_nights} Nights
            </div>
          </div>
        </div>
      </section>

      {/* Package Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Highlights */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Highlights</h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                  {pkg.highlights}
                </p>
              </div>

              {/* Inclusions */}
              {inclusions.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">What's Included</h2>
                  <div className="bg-green-50 rounded-2xl p-6">
                    <ul className="space-y-3">
                      {inclusions.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Exclusions */}
              {exclusions.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">What's Not Included</h2>
                  <div className="bg-red-50 rounded-2xl p-6">
                    <ul className="space-y-3">
                      {exclusions.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <X className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">Starting from</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-blue-600">
                      ₹{pkg.price_inr_min.toLocaleString("en-IN")}
                    </span>
                    <span className="text-gray-500 ml-2">per person</span>
                  </div>
                  {pkg.price_inr_max > pkg.price_inr_min && (
                    <p className="text-sm text-gray-500 mt-2">
                      Up to ₹{pkg.price_inr_max.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-900">
                      {pkg.duration_days}D/{pkg.duration_nights}N
                    </span>
                  </div>
                  {pkg.category && (
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Category</span>
                      <span className="font-semibold text-gray-900 capitalize">{pkg.category}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Link
                    to="/contact"
                    className="block w-full bg-blue-600 text-white text-center px-6 py-4 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg"
                  >
                    Get Custom Quote
                  </Link>
                  <a
                    href="https://wa.me/918248596124"
                    className="block w-full bg-green-500 text-white text-center px-6 py-4 rounded-full font-semibold hover:bg-green-600 transition shadow-lg"
                  >
                    WhatsApp Enquiry
                  </a>
                  <a
                    href="tel:8248596124"
                    className="block w-full bg-gray-100 text-gray-900 text-center px-6 py-4 rounded-full font-semibold hover:bg-gray-200 transition"
                  >
                    Call 8248596124
                  </a>
                </div>

                <p className="text-xs text-gray-500 text-center mt-6">
                  * Prices are subject to availability and may vary based on travel dates
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
