import { useEffect, useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import { TrendingUp, CheckCircle, XCircle, Edit2, Eye } from "lucide-react";

interface Influencer {
  id: number;
  name: string;
  email: string;
  phone: string;
  social_handles: string;
  unique_referral_code: string;
  status: string;
  commission_type: string;
  commission_value: number;
  attribution_window_days: number;
  payout_preference: string;
  payout_details: string;
  created_at: string;
}

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

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

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
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

  const handleUpdate = async () => {
    if (!selectedInfluencer) return;
    try {
      await fetch(`/api/admin/influencers/${selectedInfluencer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedInfluencer),
      });
      setShowModal(false);
      setEditMode(false);
      fetchInfluencers();
      alert("Influencer updated successfully!");
    } catch (error) {
      console.error("Error updating influencer:", error);
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
            <p className="text-gray-600 mt-1">Manage active influencer partnerships</p>
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
                    <code className="bg-primary-50 text-primary-700 px-3 py-1 rounded font-mono text-sm">
                      {influencer.unique_referral_code}
                    </code>
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
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                        influencer.status
                      )}`}
                    >
                      {influencer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedInfluencer(influencer);
                          setEditMode(false);
                          setShowModal(true);
                        }}
                        className="p-2 hover:bg-primary-50 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-primary-600" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInfluencer(influencer);
                          setEditMode(true);
                          setShowModal(true);
                        }}
                        className="p-2 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleStatusToggle(influencer.id, influencer.status)}
                        className={`p-2 hover:${
                          influencer.status === "active" ? "bg-red-50" : "bg-green-50"
                        } rounded-lg transition`}
                        title={influencer.status === "active" ? "Deactivate" : "Activate"}
                      >
                        {influencer.status === "active" ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </button>
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
            <p className="text-gray-600">Approved influencers will appear here</p>
          </div>
        )}

        {/* Details/Edit Modal */}
        {showModal && selectedInfluencer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editMode ? "Edit Influencer" : "Influencer Details"}
                </h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Name</p>
                    {editMode ? (
                      <input
                        type="text"
                        value={selectedInfluencer.name}
                        onChange={(e) =>
                          setSelectedInfluencer({ ...selectedInfluencer, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-lg mt-1"
                      />
                    ) : (
                      <p className="text-gray-900">{selectedInfluencer.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Email</p>
                      <p className="text-gray-900">{selectedInfluencer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Phone</p>
                      <p className="text-gray-900">{selectedInfluencer.phone || "N/A"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">Referral Code</p>
                    <code className="bg-primary-50 text-primary-700 px-3 py-1 rounded font-mono">
                      {selectedInfluencer.unique_referral_code}
                    </code>
                  </div>

                  {editMode && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Commission Type
                          </label>
                          <select
                            value={selectedInfluencer.commission_type}
                            onChange={(e) =>
                              setSelectedInfluencer({
                                ...selectedInfluencer,
                                commission_type: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border rounded-lg"
                          >
                            <option value="percent">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Commission Value
                          </label>
                          <input
                            type="number"
                            value={selectedInfluencer.commission_value}
                            onChange={(e) =>
                              setSelectedInfluencer({
                                ...selectedInfluencer,
                                commission_value: Number(e.target.value),
                              })
                            }
                            className="w-full px-4 py-2 border rounded-lg"
                            min="0"
                            step={selectedInfluencer.commission_type === "percent" ? "0.1" : "100"}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {!editMode && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Commission</p>
                      <p className="text-gray-900">
                        {selectedInfluencer.commission_type === "percent"
                          ? `${selectedInfluencer.commission_value}% of booking amount`
                          : `₹${selectedInfluencer.commission_value} per booking`}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {editMode && (
                    <button
                      onClick={handleUpdate}
                      className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
                    >
                      Save Changes
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditMode(false);
                      setSelectedInfluencer(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
