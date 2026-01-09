import { Link } from "react-router";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import WhatsAppButton from "@/react-app/components/WhatsAppButton";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function BlogPage() {
  // Placeholder blog posts
  const posts = [
    {
      slug: "top-10-destinations-2025",
      title: "Top 10 Must-Visit Destinations in 2025",
      excerpt: "Discover the trending travel destinations that should be on your bucket list this year.",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
      author: "Novel Sphere Team",
      date: "2025-01-15",
      category: "Travel Tips",
    },
    {
      slug: "singapore-travel-guide",
      title: "The Ultimate Singapore Travel Guide",
      excerpt: "Everything you need to know about visiting the Lion City, from attractions to local cuisine.",
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800",
      author: "Novel Sphere Team",
      date: "2025-01-10",
      category: "Destination Guides",
    },
    {
      slug: "budget-travel-tips",
      title: "10 Ways to Travel on a Budget Without Compromising Experience",
      excerpt: "Expert tips for exploring the world without breaking the bank.",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
      author: "Novel Sphere Team",
      date: "2025-01-05",
      category: "Budget Travel",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Blog</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Travel tips, destination guides, and inspiration for your next adventure
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition">
                    Read More <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500">More blog posts coming soon!</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
