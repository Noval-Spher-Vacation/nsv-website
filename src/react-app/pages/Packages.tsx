import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import WhatsAppButton from "@/react-app/components/WhatsAppButton";
import { Calendar, ArrowRight, Filter } from "lucide-react";

interface Package {
  id: number;
  title: string;
  slug: string;
  duration_days: number;
  duration_nights: number;
  price_inr_min: number;
  price_inr_max: number;
  image_url: string;
  highlights: string;
  category: string;
  destination_slug: string;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchPackages();
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    filterPackages();
  }, [packages, selectedCategory]);

  const fetchPackages = async () => {
    const response = await fetch("/api/packages");
    const data = await response.json();
    setPackages(data);
    setFilteredPackages(data);
  };

  const filterPackages = () => {
    if (selectedCategory === "All") {
      setFilteredPackages(packages);
    } else {
      setFilteredPackages(packages.filter((p) => p.category === selectedCategory));
    }
  };

  const categories = [
    { value: "All", label: "All Packages" },
    { value: "family", label: "Family" },
    { value: "honeymoon", label: "Honeymoon" },
    { value: "adventure", label: "Adventure" },
    { value: "luxury", label: "Luxury" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tour Packages</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Handpicked packages for unforgettable experiences
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto">
            <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-2 rounded-full font-semibold transition whitespace-nowrap ${
                  selectedCategory === category.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPackages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No packages found</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-gray-600">
                Showing {filteredPackages.length} package{filteredPackages.length !== 1 ? "s" : ""}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPackages.map((pkg) => (
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
                      {pkg.category && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                          {pkg.category}
                        </div>
                      )}
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
                          <p className="text-xs text-gray-500">per person</p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-blue-600 group-hover:translate-x-2 transition" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
