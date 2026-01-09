import { useEffect, useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import { UserPlus, Instagram, Youtube, CheckCircle, XCircle, Eye } from "lucide-react";

interface InfluencerRequest {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  instagram_handle: string;
  youtube_channel: string;
  audience_size: number;
  niche: string;
  preferred_destinations: string;
  payout_preference: string;
  payout_details: string;
  message: string;
  status: string;
  created_at: string;
}

export default function InfluencerRequestsPage() {
  const [requests, setRequests] = useState<InfluencerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<InfluencerRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [commissionType, setCommissionType] = useState<"percent" | "fixed">("percent");
  const [commissionValue, setCommissionValue] = useState(5);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/admin/influencer-requests");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await fetch(`/api/admin/influencer-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "approved",
          commission_type: commissionType,
          commission_value: commissionValue,
        }),
      });
      setShowModal(false);
      setSelectedRequest(null);
      fetchRequests();
      alert("Influencer approved successfully!");
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("Are you sure you want to reject this request?")) return;
    try {
      await fetch(`/api/admin/influencer-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading requests...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Influencer Requests</h1>
            <p className="text-gray-600 mt-1">Review and approve influencer applications</p>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Applicant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Social Media
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Audience
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Niche
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
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{request.full_name}</p>
                      <p className="text-sm text-gray-500">{request.email}</p>
                      <p className="text-sm text-gray-500">{request.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {request.instagram_handle && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Instagram className="w-4 h-4 mr-2 text-pink-500" />
                          {request.instagram_handle}
                        </div>
                      )}
                      {request.youtube_channel && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Youtube className="w-4 h-4 mr-2 text-red-500" />
                          {request.youtube_channel}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {request.audience_size ? request.audience_size.toLocaleString() : "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 capitalize">{request.niche || "N/A"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowModal(true);
                        }}
                        className="p-2 hover:bg-blue-50 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowModal(true);
                            }}
                            className="p-2 hover:bg-green-50 rounded-lg transition"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {requests.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests yet</h3>
            <p className="text-gray-600">Influencer applications will appear here</p>
          </div>
        )}

        {/* Approval Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {selectedRequest.status === "pending" ? "Approve Influencer" : "Request Details"}
                </h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Full Name</p>
                    <p className="text-gray-900">{selectedRequest.full_name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Email</p>
                      <p className="text-gray-900">{selectedRequest.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Phone</p>
                      <p className="text-gray-900">{selectedRequest.phone || "N/A"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Audience Size</p>
                      <p className="text-gray-900">
                        {selectedRequest.audience_size?.toLocaleString() || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Niche</p>
                      <p className="text-gray-900 capitalize">{selectedRequest.niche || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Preferred Destinations</p>
                    <p className="text-gray-900">{selectedRequest.preferred_destinations || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Payout Preference</p>
                    <p className="text-gray-900 capitalize">
                      {selectedRequest.payout_preference || "N/A"} - {selectedRequest.payout_details || "N/A"}
                    </p>
                  </div>
                  {selectedRequest.message && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Message</p>
                      <p className="text-gray-900">{selectedRequest.message}</p>
                    </div>
                  )}
                </div>

                {selectedRequest.status === "pending" && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Commission Settings</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Commission Type
                        </label>
                        <select
                          value={commissionType}
                          onChange={(e) => setCommissionType(e.target.value as "percent" | "fixed")}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="percent">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Commission Value
                        </label>
                        <input
                          type="number"
                          value={commissionValue}
                          onChange={(e) => setCommissionValue(Number(e.target.value))}
                          className="w-full px-4 py-2 border rounded-lg"
                          min="0"
                          step={commissionType === "percent" ? "0.1" : "100"}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {commissionType === "percent" ? "%" : "₹ per booking"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {selectedRequest.status === "pending" && (
                    <button
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                    >
                      Approve & Create Influencer
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedRequest(null);
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
