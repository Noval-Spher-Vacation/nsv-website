import { useEffect, useMemo, useRef, useState } from "react";
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
  const [enableHeroTilt, setEnableHeroTilt] = useState(false);
  const parallaxRefs = useRef<HTMLDivElement[]>([]);
  const parallaxRaf = useRef<number | null>(null);
  const heroCardRef = useRef<HTMLDivElement | null>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        top: `${(index * 17) % 100}%`,
        left: `${(index * 29) % 100}%`,
        delay: `${(index % 6) * 0.8}s`,
        duration: `${12 + (index % 5) * 3}s`,
        size: 4 + (index % 4) * 2,
        opacity: 0.3 + (index % 4) * 0.12,
      })),
    []
  );

  useEffect(() => {
    fetchDestinations();
    fetchPackages();
    fetchTestimonials();
    fetchOffers();

    setEnableHeroTilt(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    const targets = Array.from(document.querySelectorAll(".section-reveal"));
    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return undefined;
    }

    const update = () => {
      const scrollY = window.scrollY;
      parallaxRefs.current.forEach((element) => {
        const speed = Number.parseFloat(element.dataset.speed || "0.12");
        element.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
      });
      parallaxRaf.current = null;
    };

    const onScroll = () => {
      if (parallaxRaf.current !== null) {
        return;
      }
      parallaxRaf.current = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (parallaxRaf.current !== null) {
        window.cancelAnimationFrame(parallaxRaf.current);
      }
    };
  }, []);

  const registerParallax = (element: HTMLDivElement | null) => {
    if (element && !parallaxRefs.current.includes(element)) {
      parallaxRefs.current.push(element);
    }
  };

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

  const handleHeroMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableHeroTilt || !heroCardRef.current) {
      return;
    }
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = (-y * 8).toFixed(2);
    const rotateY = (x * 12).toFixed(2);
    heroCardRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleHeroLeave = () => {
    if (!heroCardRef.current) {
      return;
    }
    heroCardRef.current.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div className="min-h-screen bg-[#07060c] text-white overflow-x-hidden grain">
      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative min-h-[720px] md:min-h-[820px] overflow-hidden">
        <div
          ref={registerParallax}
          data-speed="0.18"
          className="absolute inset-0 opacity-60 scale-110"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0914]/30 via-[#0b0914]/75 to-[#07060c]" />
        <div
          ref={registerParallax}
          data-speed="0.08"
          className="absolute -top-32 -left-12 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,105,180,0.45),rgba(255,105,180,0))] blur-3xl"
        />
        <div
          ref={registerParallax}
          data-speed="0.14"
          className="absolute -bottom-10 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(140,60,255,0.55),rgba(140,60,255,0))] blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="particle-field">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="particle"
              style={{
                top: particle.top,
                left: particle.left,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div
            ref={heroCardRef}
            onMouseMove={handleHeroMove}
            onMouseLeave={handleHeroLeave}
            className="max-w-3xl glass-panel p-10 md:p-12 rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(255,45,148,0.3)] transition-transform duration-300"
          >
            <p className="uppercase text-xs tracking-[0.45em] text-white/60 mb-4">
              Crafted Luxury Escapes
            </p>
            <h1 className="neon-title text-5xl md:text-7xl font-semibold mb-6 leading-tight">
              Discover Your Next Journey
            </h1>
            <p className="text-lg md:text-2xl text-white/80 mb-8">
              Personalized trips across Asia, Europe, UAE, Australia & Worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/packages"
                className="cta-glow bg-gradient-to-r from-[#ff2d94] to-[#b44bff] text-black px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center"
              >
                Plan My Trip
              </Link>
              <Link
                to="/contact"
                className="cta-glow bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center"
              >
                Get a Free Quote
              </Link>
              <a
                href="https://wa.me/918248596124"
                className="cta-glow bg-emerald-400/90 text-black px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 relative section-reveal">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,92,184,0.12),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="neon-title text-3xl md:text-4xl font-semibold text-white mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-white/70">
              Your trusted partner for unforgettable travel experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-panel neon-hover p-8 rounded-2xl text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ff5cb8] to-[#7f4dff] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">24/7 Travel Support</h3>
              <p className="text-white/70">Round-the-clock assistance for a worry-free journey</p>
            </div>
            <div className="glass-panel neon-hover p-8 rounded-2xl text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#22d3ee] to-[#0ea5e9] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Best Price Guarantee</h3>
              <p className="text-white/70">Competitive pricing with transparent, no hidden costs</p>
            </div>
            <div className="glass-panel neon-hover p-8 rounded-2xl text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#a855f7] to-[#6366f1] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                100% Customizable Itineraries
              </h3>
              <p className="text-white/70">Tailor-made trips designed around your preferences</p>
            </div>
            <div className="glass-panel neon-hover p-8 rounded-2xl text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#fb7185] to-[#f97316] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Professional Team of 20 Travel Specialists
              </h3>
              <p className="text-white/70">Expert guidance from experienced travel consultants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlights */}
      <section className="py-20 relative overflow-hidden section-reveal">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(130,87,255,0.2),transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="neon-title text-3xl md:text-4xl font-semibold text-white mb-4">Our Services</h2>
            <p className="text-lg text-white/70">Comprehensive travel solutions for every need</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/services#visa"
              className="glass-panel neon-hover group p-6 rounded-2xl"
            >
              <FileText className="w-12 h-12 text-[#ff5cb8] mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
              <h3 className="text-xl font-semibold text-white mb-2">Visa Assistance</h3>
              <p className="text-white/70">Complete visa support and documentation</p>
            </Link>
            <Link
              to="/services#hotel"
              className="glass-panel neon-hover group p-6 rounded-2xl"
            >
              <Hotel className="w-12 h-12 text-[#22d3ee] mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
              <h3 className="text-xl font-semibold text-white mb-2">Hotel Booking</h3>
              <p className="text-white/70">Premium accommodations worldwide</p>
            </Link>
            <Link
              to="/services#transport"
              className="glass-panel neon-hover group p-6 rounded-2xl"
            >
              <Car className="w-12 h-12 text-[#a855f7] mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
              <h3 className="text-xl font-semibold text-white mb-2">Transport & Transfers</h3>
              <p className="text-white/70">Comfortable and reliable transportation</p>
            </Link>
            <Link
              to="/services#insurance"
              className="glass-panel neon-hover group p-6 rounded-2xl"
            >
              <Shield className="w-12 h-12 text-[#fb7185] mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
              <h3 className="text-xl font-semibold text-white mb-2">Travel Insurance</h3>
              <p className="text-white/70">Comprehensive coverage for peace of mind</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 relative section-reveal">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.14),transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="neon-title text-3xl md:text-4xl font-semibold text-white mb-4">
              Featured Destinations
            </h2>
            <p className="text-lg text-white/70">Explore the world's most captivating places</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <Link
                key={destination.id}
                to={`/destinations/${destination.slug}`}
                className="group relative overflow-hidden rounded-2xl ring-1 ring-white/10 neon-hover h-80"
              >
                <img
                  src={destination.image_url}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end">
                  <div className="p-6 text-white w-full">
                    <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                    <p className="text-sm text-white/80 flex items-center">
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
              className="inline-flex items-center text-[#ff6bd5] font-semibold hover:text-white transition"
            >
              View All Destinations <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 relative overflow-hidden section-reveal">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_75%,rgba(255,92,184,0.18),transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="neon-title text-3xl md:text-4xl font-semibold text-white mb-4">
              Popular Tour Packages
            </h2>
            <p className="text-lg text-white/70">Handpicked packages for unforgettable experiences</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Link
                key={pkg.id}
                to={`/packages/${pkg.slug}`}
                className="group glass-panel neon-hover rounded-2xl overflow-hidden border border-white/10"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={pkg.image_url}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.title}</h3>
                  <div className="flex items-center text-white/70 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {pkg.duration_days}D/{pkg.duration_nights}N
                    </span>
                  </div>
                  <p className="text-sm text-white/65 mb-4 line-clamp-2">{pkg.highlights}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">Starting from</p>
                      <p className="text-2xl font-bold text-[#ff6bd5]">
                        ₹{pkg.price_inr_min.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-white/50">per person</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-[#ff6bd5] group-hover:translate-x-2 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/packages"
              className="inline-flex items-center text-[#ff6bd5] font-semibold hover:text-white transition"
            >
              View All Packages <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative section-reveal">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_20%,rgba(168,85,247,0.18),transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="neon-title text-3xl md:text-4xl font-semibold text-white mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-lg text-white/70">Real experiences from real travelers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="glass-panel neon-hover p-8 rounded-2xl border border-white/10">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.customer_name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.customer_name}</h4>
                    <p className="text-sm text-white/60">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/70 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/testimonials"
              className="inline-flex items-center text-[#ff6bd5] font-semibold hover:text-white transition"
            >
              Read More Reviews <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      {offers.length > 0 && (
        <section className="py-20 relative section-reveal">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_60%,rgba(255,92,184,0.16),transparent_55%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12">
              <h2 className="neon-title text-3xl md:text-4xl font-semibold text-white mb-4">Special Offers</h2>
              <p className="text-lg text-white/70">Limited time deals you don't want to miss</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="relative overflow-hidden rounded-2xl glass-panel neon-hover border border-white/10"
                >
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-[#ff4fd1] text-black px-4 py-2 rounded-full font-bold">
                    {offer.discount_percent}% OFF
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{offer.title}</h3>
                    <p className="text-white/70">{offer.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/offers"
                className="inline-flex items-center text-[#ff6bd5] font-semibold hover:text-white transition"
              >
                View All Offers <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Founder Story */}
      <section className="py-20 relative overflow-hidden section-reveal">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff5cb8]/15 via-[#7f4dff]/20 to-[#22d3ee]/15 animate-pulse-slow" />
        <div className="absolute inset-0 bg-[#0b0a12]/70" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(255,92,184,0.35)]">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-semibold mb-4 italic">
            "Travel healed me. I built Novel Sphere Vacations so it can heal others too."
          </p>
          <p className="text-lg text-white/70">- Founder, Novel Sphere Vacations</p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 relative section-reveal">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,92,184,0.12),transparent_55%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="glass-panel rounded-3xl p-10 md:p-12 border border-white/10">
            <h2 className="neon-title text-3xl md:text-4xl font-semibold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Get the latest travel tips, exclusive deals, and destination inspiration
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-3 rounded-full border border-white/15 bg-white/5 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#ff6bd5]"
              />
              <button
                type="submit"
                className="cta-glow bg-gradient-to-r from-[#ff2d94] to-[#b44bff] text-black px-8 py-3 rounded-full font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 relative overflow-hidden section-reveal">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(255,92,184,0.2),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="glass-panel rounded-3xl p-12 text-center border border-white/15 shadow-[0_0_60px_rgba(255,92,184,0.3)]">
            <h2 className="neon-title text-3xl md:text-4xl font-semibold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl text-white/80 mb-8">
              Let our travel experts create the perfect itinerary for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="cta-glow bg-gradient-to-r from-[#ff2d94] to-[#b44bff] text-black px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center"
              >
                Get Free Consultation
              </Link>
              <a
                href="tel:8248596124"
                className="cta-glow bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full font-semibold inline-flex items-center justify-center"
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
