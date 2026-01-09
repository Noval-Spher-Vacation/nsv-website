import { useEffect, useState } from "react";
import { Link } from "react-router";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import WhatsAppButton from "@/react-app/components/WhatsAppButton";
import {
  Shield,
  Award,
  Users,
  MapPin,
  Calendar,
  Star,
  ArrowRight,
  CheckCircle2,
  Hotel,
  Car,
  FileText,
} from "lucide-react";

interface Destination {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  region: string;
  is_featured: number;
}

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
}

interface Testimonial {
  id: number;
  customer_name: string;
  location: string;
  rating: number;
  quote: string;
  image_url: string;
}

interface Offer {
  id: number;
  title: string;
  description: string;
  discount_percent: number;
  image_url: string;
}

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchDestinations();
    fetchPackages();
    fetchTestimonials();
    fetchOffers();
  }, []);

  const fetchDestinations = async () => {
    const response = await fetch("/api/destinations");
    const data = await response.json();
    setDestinations(data.filter((d: Destination) => d.is_featured).slice(0, 8));
  };

  const fetchPackages = async () => {
    const response = await fetch("/api/packages?featured=true");
    const data = await response.json();
    setPackages(data.slice(0, 6));
  };

  const fetchTestimonials = async () => {
    const response = await fetch("/api/testimonials");
    const data = await response.json();
    setTestimonials(data.slice(0, 3));
  };

  const fetchOffers = async () => {
    const response = await fetch("/api/offers");
    const data = await response.json();
    setOffers(data.slice(0, 3));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your Next Journey
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Personalized trips across Asia, Europe, UAE, Australia & Worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/packages"
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition shadow-2xl inline-block text-center"
              >
                Plan My Trip
              </Link>
              <Link
                to="/contact"
                className="bg-blue-500/20 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-500/30 transition inline-block text-center"
              >
                Get a Free Quote
              </Link>
              <a
                href="https://wa.me/918248596124"
                className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition shadow-2xl inline-block text-center"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600">
              Your trusted partner for unforgettable travel experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Travel Support</h3>
              <p className="text-gray-600">Round-the-clock assistance for a worry-free journey</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Price Guarantee</h3>
              <p className="text-gray-600">Competitive pricing with transparent, no hidden costs</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                100% Customizable Itineraries
              </h3>
              <p className="text-gray-600">Tailor-made trips designed around your preferences</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Professional Team of 20 Travel Specialists
              </h3>
              <p className="text-gray-600">Expert guidance from experienced travel consultants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">Comprehensive travel solutions for every need</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/services#visa"
              className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-xl transition"
            >
              <FileText className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visa Assistance</h3>
              <p className="text-gray-600">Complete visa support and documentation</p>
            </Link>
            <Link
              to="/services#hotel"
              className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-xl transition"
            >
              <Hotel className="w-12 h-12 text-green-600 mb-4 group-hover:scale-110 transition" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hotel Booking</h3>
              <p className="text-gray-600">Premium accommodations worldwide</p>
            </Link>
            <Link
              to="/services#transport"
              className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-xl transition"
            >
              <Car className="w-12 h-12 text-purple-600 mb-4 group-hover:scale-110 transition" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transport & Transfers</h3>
              <p className="text-gray-600">Comfortable and reliable transportation</p>
            </Link>
            <Link
              to="/services#insurance"
              className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl hover:shadow-xl transition"
            >
              <Shield className="w-12 h-12 text-orange-600 mb-4 group-hover:scale-110 transition" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Travel Insurance</h3>
              <p className="text-gray-600">Comprehensive coverage for peace of mind</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Destinations
            </h2>
            <p className="text-lg text-gray-600">Explore the world's most captivating places</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
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
                      {destination.region}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/destinations"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              View All Destinations <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Tour Packages
            </h2>
            <p className="text-lg text-gray-600">Handpicked packages for unforgettable experiences</p>
          </div>
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
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-blue-600 group-hover:translate-x-2 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/packages"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              View All Packages <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-lg text-gray-600">Real experiences from real travelers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.customer_name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.customer_name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/testimonials"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              Read More Reviews <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      {offers.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Special Offers</h2>
              <p className="text-lg text-gray-600">Limited time deals you don't want to miss</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition"
                >
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                    {offer.discount_percent}% OFF
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                    <p className="text-gray-600">{offer.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/offers"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                View All Offers <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Founder Story */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-semibold mb-4 italic">
            "Travel healed me. I built Novel Sphere Vacations so it can heal others too."
          </p>
          <p className="text-lg text-blue-100">- Founder, Novel Sphere Vacations</p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get the latest travel tips, exclusive deals, and destination inspiration
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Let our travel experts create the perfect itinerary for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition shadow-xl inline-block"
              >
                Get Free Consultation
              </Link>
              <a
                href="tel:8248596124"
                className="bg-blue-500/20 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-500/30 transition inline-block"
              >
                Call 8248596124
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
