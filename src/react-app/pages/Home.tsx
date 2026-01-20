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
      <section className="relative h-[600px] md:h-[700px] bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 overflow-hidden">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/20 via-transparent to-neon-purple/20 animate-pulse-slow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl backdrop-blur-sm bg-white/5 p-12 rounded-3xl border border-white/20 shadow-2xl animate-float">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-lg">
              Discover Your Next Journey
            </h1>
            <p className="text-xl md:text-2xl text-gray-900 mb-8">
              Personalized trips across Asia, Europe, UAE, Australia & Worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/packages"
                className="bg-white/90 backdrop-blur-md text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-white transition-all duration-300 shadow-neon-pink hover:shadow-neon-purple inline-block text-center transform hover:scale-105 hover:-translate-y-1"
              >
                Plan My Trip
              </Link>
              <Link
                to="/contact"
                className="bg-white/10 backdrop-blur-md border-2 border-white/50 text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 inline-block text-center transform hover:scale-105 hover:-translate-y-1"
              >
                Get a Free Quote
              </Link>
              <a
                href="https://wa.me/918248596124"
                className="bg-green-500/90 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition-all duration-300 shadow-lg inline-block text-center transform hover:scale-105 hover:-translate-y-1"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-purple-50/30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600">
              Your trusted partner for unforgettable travel experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="backdrop-blur-lg bg-white/70 p-8 rounded-2xl shadow-lg hover:shadow-neon-pink transition-all duration-300 text-center group transform hover:scale-105 hover:-translate-y-2 border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Travel Support</h3>
              <p className="text-gray-600">Round-the-clock assistance for a worry-free journey</p>
            </div>
            <div className="backdrop-blur-lg bg-white/70 p-8 rounded-2xl shadow-lg hover:shadow-neon-pink transition-all duration-300 text-center group transform hover:scale-105 hover:-translate-y-2 border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Price Guarantee</h3>
              <p className="text-gray-600">Competitive pricing with transparent, no hidden costs</p>
            </div>
            <div className="backdrop-blur-lg bg-white/70 p-8 rounded-2xl shadow-lg hover:shadow-neon-pink transition-all duration-300 text-center group transform hover:scale-105 hover:-translate-y-2 border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                100% Customizable Itineraries
              </h3>
              <p className="text-gray-600">Tailor-made trips designed around your preferences</p>
            </div>
            <div className="backdrop-blur-lg bg-white/70 p-8 rounded-2xl shadow-lg hover:shadow-neon-pink transition-all duration-300 text-center group transform hover:scale-105 hover:-translate-y-2 border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float shadow-lg">
                <Users className="w-8 h-8 text-white" />
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
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-white to-purple-50/50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">Comprehensive travel solutions for every need</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/services#visa"
              className="group p-6 backdrop-blur-md bg-gradient-to-br from-pink-500/10 to-pink-600/20 rounded-2xl hover:shadow-xl transition-all duration-300 border border-pink-200/50 hover:border-pink-400/50 transform hover:scale-105 hover:-translate-y-2"
            >
              <FileText className="w-12 h-12 text-pink-600 mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visa Assistance</h3>
              <p className="text-gray-600">Complete visa support and documentation</p>
            </Link>
            <Link
              to="/services#hotel"
              className="group p-6 backdrop-blur-md bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-2xl hover:shadow-xl transition-all duration-300 border border-green-200/50 hover:border-green-400/50 transform hover:scale-105 hover:-translate-y-2"
            >
              <Hotel className="w-12 h-12 text-green-600 mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hotel Booking</h3>
              <p className="text-gray-600">Premium accommodations worldwide</p>
            </Link>
            <Link
              to="/services#transport"
              className="group p-6 backdrop-blur-md bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-2xl hover:shadow-xl transition-all duration-300 border border-purple-200/50 hover:border-purple-400/50 transform hover:scale-105 hover:-translate-y-2"
            >
              <Car className="w-12 h-12 text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transport & Transfers</h3>
              <p className="text-gray-600">Comfortable and reliable transportation</p>
            </Link>
            <Link
              to="/services#insurance"
              className="group p-6 backdrop-blur-md bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-2xl hover:shadow-xl transition-all duration-300 border border-orange-200/50 hover:border-orange-400/50 transform hover:scale-105 hover:-translate-y-2"
            >
              <Shield className="w-12 h-12 text-orange-600 mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
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
              className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 transition"
            >
              View All Destinations <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-pink-50/30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Popular Tour Packages
            </h2>
            <p className="text-lg text-gray-600">Handpicked packages for unforgettable experiences</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Link
                key={pkg.id}
                to={`/packages/${pkg.slug}`}
                className="group backdrop-blur-lg bg-white/80 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/50 transform hover:scale-105 hover:-translate-y-2"
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
                      <p className="text-2xl font-bold text-pink-600">
                        ₹{pkg.price_inr_min.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-pink-600 group-hover:translate-x-2 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/packages"
              className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 transition"
            >
              View All Packages <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-primary-50/30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-primary-600 bg-clip-text text-transparent mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-lg text-gray-600">Real experiences from real travelers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="backdrop-blur-lg bg-white/70 p-8 rounded-2xl shadow-lg hover:shadow-neon-pink transition-all duration-300 border border-white/50 transform hover:scale-105 hover:-translate-y-2">
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
              className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 transition"
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
                className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 transition"
              >
                View All Offers <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Founder Story */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/10 via-neon-purple/10 to-neon-blue/10 animate-pulse-slow" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-semibold mb-4 italic relative z-10">
            "Travel healed me. I built Novel Sphere Vacations so it can heal others too."
          </p>
          <p className="text-lg text-primary-100 relative z-10">- Founder, Novel Sphere Vacations</p>
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
              className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-600"
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition shadow-lg"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-white to-purple-50/50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="backdrop-blur-xl bg-gradient-to-r from-pink-600/90 to-purple-600/90 rounded-3xl p-12 text-center text-white shadow-2xl border border-white/20 transform hover:scale-[1.02] transition-transform duration-300">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">Ready to Start Your Journey?</h2>
            <p className="text-xl text-white/90 mb-8 drop-shadow">
              Let our travel experts create the perfect itinerary for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white/95 backdrop-blur-sm text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-white transition-all duration-300 shadow-xl inline-block transform hover:scale-105 hover:-translate-y-1"
              >
                Get Free Consultation
              </Link>
              <a
                href="tel:8248596124"
                className="bg-white/10 backdrop-blur-md border-2 border-white/50 text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 inline-block transform hover:scale-105 hover:-translate-y-1"
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
