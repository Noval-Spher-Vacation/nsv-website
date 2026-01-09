import { useEffect, useState } from "react";
import { Link } from "react-router";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import WhatsAppButton from "@/react-app/components/WhatsAppButton";
import { MapPin, Search } from "lucide-react";

interface Destination {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  region: string;
  country: string;
  is_featured: number;
  is_popular: number;
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    filterDestinations();
  }, [destinations, selectedRegion, searchQuery]);

  const fetchDestinations = async () => {
    const response = await fetch("/api/destinations");
    const data = await response.json();
    setDestinations(data);
    setFilteredDestinations(data);
  };

  const filterDestinations = () => {
    let filtered = destinations;

    if (selectedRegion !== "All") {
      filtered = filtered.filter((d) => d.region === selectedRegion);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDestinations(filtered);
  };

  const regions = ["All", "Asia", "Europe", "UAE"];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Destinations</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover amazing places around the world
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Region Filter */}
            <div className="flex gap-2 flex-wrap">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-6 py-2 rounded-full font-semibold transition ${
                    selectedRegion === region
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No destinations found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.map((destination) => (
                <Link
                  key={destination.id}
                  to={`/destinations/${destination.slug}`}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition h-80"
                >
                  <img
                    src={destination.image_url}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
                    <div className="p-6 text-white w-full">
                      <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                      <p className="text-sm text-gray-200 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {destination.country}
                      </p>
                    </div>
                  </div>
                  {destination.is_popular === 1 && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Popular
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
