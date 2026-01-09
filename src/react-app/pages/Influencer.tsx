import { useState } from "react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import {
  Users,
  TrendingUp,
  DollarSign,
  Globe,
  Instagram,
  Youtube,
  CheckCircle,
} from "lucide-react";

export default function InfluencerPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    instagram_handle: "",
    youtube_channel: "",
    audience_size: "",
    niche: "",
    preferred_destinations: "",
    payout_preference: "upi",
    payout_details: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/influencer/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          audience_size: formData.audience_size ? parseInt(formData.audience_size) : undefined,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setLoading(false);
    }
  };

  const niches = [
    "Family Travel",
    "Luxury Travel",
    "Budget Travel",
    "Honeymoon Travel",
    "Adventure Travel",
    "Solo Travel",
  ];

  if (submitted) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-2xl p-12">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Request Submitted Successfully!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for your interest in joining Novel Sphere Vacations as a Travel
                Partner. Our team will review your application and contact you within 2-3
                business days.
              </p>
              <a
                href="/"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16 px-4">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Become a Novel Sphere Travel Partner
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Join our exclusive influencer program and earn generous commissions while
            sharing incredible travel experiences with your audience
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">High Commissions</h3>
              <p className="text-sm text-gray-600">
                Earn up to 10% commission on every booking
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Dedicated Support</h3>
              <p className="text-sm text-gray-600">
                Personal account manager for all your needs
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Real-Time Tracking</h3>
              <p className="text-sm text-gray-600">
                Dashboard to monitor your referrals & earnings
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Globe className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Global Destinations</h3>
              <p className="text-sm text-gray-600">
                Promote packages across 50+ destinations
              </p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Apply Now</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Instagram className="inline w-4 h-4 mr-2" />
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={formData.instagram_handle}
                    onChange={(e) =>
                      setFormData({ ...formData, instagram_handle: e.target.value })
                    }
                    placeholder="@yourusername"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Youtube className="inline w-4 h-4 mr-2" />
                    YouTube Channel
                  </label>
                  <input
                    type="text"
                    value={formData.youtube_channel}
                    onChange={(e) =>
                      setFormData({ ...formData, youtube_channel: e.target.value })
                    }
                    placeholder="Channel Name or URL"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Audience Size
                  </label>
                  <input
                    type="number"
                    value={formData.audience_size}
                    onChange={(e) =>
                      setFormData({ ...formData, audience_size: e.target.value })
                    }
                    placeholder="Total followers/subscribers"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content Niche
                  </label>
                  <select
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your niche</option>
                    {niches.map((niche) => (
                      <option key={niche} value={niche.toLowerCase()}>
                        {niche}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Destinations
                </label>
                <input
                  type="text"
                  value={formData.preferred_destinations}
                  onChange={(e) =>
                    setFormData({ ...formData, preferred_destinations: e.target.value })
                  }
                  placeholder="e.g., Bali, Maldives, Europe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payout Preference
                  </label>
                  <select
                    value={formData.payout_preference}
                    onChange={(e) =>
                      setFormData({ ...formData, payout_preference: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="upi">UPI</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payout Details (UPI ID / Account Info)
                  </label>
                  <input
                    type="text"
                    value={formData.payout_details}
                    onChange={(e) =>
                      setFormData({ ...formData, payout_details: e.target.value })
                    }
                    placeholder="yourname@upi or bank details"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message / Why do you want to join?
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
