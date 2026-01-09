import { useEffect, useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import { Pause, Play, Copy, TrendingUp } from "lucide-react";
import { Link } from "react-router";

interface Influencer {
  id: number;
  name: string;
  email: string;
  phone: string;
  unique_referral_code: string;
  status: string;
  commission_type: string;
  commission_value: number;
  social_handles: string;
  created_at: string;
}

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {
      const response = await fetch("/api/admin/influencers");
      const data = await response.json();
      setInfluencers(data);
    } catch (error) {
      console.error("Error fetching influencers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    try {
      await fetch(`/api/admin/influencers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchInfluencers();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const copyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("Referral code copied to clipboard!");
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading influencers...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Influencers</h1>
            <p className="text-gray-600 mt-1">Manage influencer partners and referral codes</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/influencer-analytics"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Analytics
            </Link>
          </div>
        </div>

        {/* Influencers Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Influencer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Referral Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Commission
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {influencers.map((influencer) => (
                <tr key={influencer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{influencer.name}</p>
                      <p className="text-sm text-gray-500">{influencer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-mono text-sm font-semibold">
                        {influencer.unique_referral_code}
                      </code>
                      <button
                        onClick={() => copyReferralCode(influencer.unique_referral_code)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copy code"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {influencer.commission_type === "percent"
                        ? `${influencer.commission_value}%`
                        : `₹${influencer.commission_value}`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        influencer.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {influencer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleStatus(influencer.id, influencer.status)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title={influencer.status === "active" ? "Pause" : "Activate"}
                      >
                        {influencer.status === "active" ? (
                          <Pause className="w-4 h-4 text-orange-600" />
                        ) : (
                          <Play className="w-4 h-4 text-green-600" />
                        )}
                      </button>
                      <Link
                        to={`/admin/influencer-payouts?influencer=${influencer.id}`}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Payouts
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {influencers.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No influencers yet</h3>
            <p className="text-gray-600 mb-6">Approve requests to add influencers</p>
            <Link
              to="/admin/influencer-requests"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              View Requests
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
