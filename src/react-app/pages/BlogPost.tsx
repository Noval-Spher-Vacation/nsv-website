import { Link } from "react-router";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import WhatsAppButton from "@/react-app/components/WhatsAppButton";
import { Calendar, User, ArrowLeft } from "lucide-react";

export default function BlogPostPage() {

  // Placeholder content
  const post = {
    title: "Top 10 Must-Visit Destinations in 2025",
    excerpt: "Discover the trending travel destinations that should be on your bucket list this year.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200",
    author: "Novel Sphere Team",
    date: "2025-01-15",
    category: "Travel Tips",
    content: `
      <p>As we step into 2025, the world of travel continues to evolve with new destinations emerging as must-visit hotspots. Whether you're seeking adventure, relaxation, or cultural immersion, we've compiled a list of the top 10 destinations that should be on every traveler's radar this year.</p>

      <h2>1. Singapore - The Garden City</h2>
      <p>Singapore continues to captivate visitors with its perfect blend of modernity and tradition. From the futuristic Gardens by the Bay to the historic streets of Chinatown, this city-state offers something for everyone.</p>

      <h2>2. Maldives - Tropical Paradise</h2>
      <p>The Maldives remains the ultimate destination for those seeking pristine beaches, crystal-clear waters, and luxury resorts. It's the perfect escape for honeymooners and anyone looking to unwind in paradise.</p>

      <h2>3. Dubai - City of Superlatives</h2>
      <p>Dubai continues to push boundaries with its innovative architecture, world-class shopping, and luxurious experiences. From the iconic Burj Khalifa to traditional souks, Dubai offers contrasts that fascinate travelers.</p>

      <h2>Plan Your Journey</h2>
      <p>Ready to explore these amazing destinations? Contact Novel Sphere Vacations today to create your perfect itinerary. Our team of travel experts will help you plan an unforgettable journey tailored to your preferences.</p>
    `,
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      {/* Hero Image */}
      <section className="relative h-[400px] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </section>

      {/* Article Content */}
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Blog
          </Link>

          <div className="mb-8">
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>
            <div className="flex items-center text-gray-600 space-x-6">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {new Date(post.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-blue-100 mb-6">
              Let us help you plan your next adventure to these amazing destinations
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
