import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import AdminLayout from "@/react-app/components/AdminLayout";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Tag,
  MessageSquare,
  CheckCircle,
  Clock,
} from "lucide-react";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  stage: string;
  source: string;
  assigned_to_user_id: string | null;
  next_followup_at: string | null;
  notes: string | null;
  tags: string;
  destination_interest: string | null;
  budget_range: string | null;
  pax_count: number | null;
  travel_start_date: string | null;
  travel_end_date: string | null;
  created_at: string;
  activities: Activity[];
}

interface Activity {
  id: number;
  type: string;
  payload: string;
  created_by_user_id: string;
  created_at: string;
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (id) fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const response = await fetch(`/api/admin/crm/leads/${id}`);
      const data = await response.json();
      setLead(data);
      setFormData(data);
    } catch (error) {
      console.error("Error fetching lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`/api/admin/crm/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setEditMode(false);
      fetchLead();
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await fetch(`/api/admin/crm/leads/${id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "note",
          payload: { message: newNote },
        }),
      });
      setNewNote("");
      fetchLead();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleConvert = async () => {
    if (!confirm("Convert this lead to a booking?")) return;
    try {
      const response = await fetch(`/api/admin/crm/leads/${id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_type: "custom",
          travelers: [{ name: lead?.name }],
        }),
      });
      const data = await response.json();
      alert(`Booking created: ${data.booking_id}`);
      navigate("/admin/bookings");
    } catch (error) {
      console.error("Error converting lead:", error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading lead details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!lead) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Lead not found</h2>
        </div>
      </AdminLayout>
    );
  }

  const stages = [
    "New",
    "Yet To Talk",
    "Followup",
    "Hot",
    "Proposal Presented",
    "Converted",
    "Cold",
    "Lost",
    "Duplicate",
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/admin/crm/leads")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Leads
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
                <div className="flex gap-2">
                  {!editMode ? (
                    <>
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      {lead.stage !== "Converted" && (
                        <button
                          onClick={handleConvert}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Convert to Booking
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setFormData(lead);
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stage
                    </label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      {stages.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Next Followup
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.next_followup_at || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, next_followup_at: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination Interest
                    </label>
                    <input
                      type="text"
                      value={formData.destination_interest || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, destination_interest: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <input
                      type="text"
                      value={formData.budget_range || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, budget_range: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-5 h-5 mr-3 text-blue-600" />
                    {lead.email || "No email"}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-5 h-5 mr-3 text-green-600" />
                    {lead.phone || "No phone"}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Tag className="w-5 h-5 mr-3 text-purple-600" />
                    Stage: <span className="ml-2 font-semibold">{lead.stage}</span>
                  </div>
                  {lead.next_followup_at && (
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-orange-600" />
                      Followup: {new Date(lead.next_followup_at).toLocaleString()}
                    </div>
                  )}
                  {lead.destination_interest && (
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-red-600" />
                      {lead.destination_interest}
                    </div>
                  )}
                  {lead.budget_range && (
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                      {lead.budget_range}
                    </div>
                  )}
                  {lead.pax_count && (
                    <div className="flex items-center text-gray-700">
                      <Users className="w-5 h-5 mr-3 text-indigo-600" />
                      {lead.pax_count} travelers
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Timeline</h2>
              <div className="space-y-4 mb-6">
                {lead.activities.map((activity) => {
                  const payload = JSON.parse(activity.payload);
                  return (
                    <div key={activity.id} className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        {activity.type === "note" && (
                          <MessageSquare className="w-6 h-6 text-blue-600" />
                        )}
                        {activity.type === "status_change" && (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                        {activity.type === "followup_scheduled" && (
                          <Clock className="w-6 h-6 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                        <p className="text-gray-900">
                          {activity.type === "note" && payload.message}
                          {activity.type === "status_change" &&
                            `Stage changed from ${payload.from} to ${payload.to}`}
                          {activity.type === "followup_scheduled" &&
                            `Followup scheduled for ${new Date(payload.date).toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                  rows={3}
                />
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Lead Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Source</p>
                  <p className="font-semibold capitalize">{lead.source}</p>
                </div>
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-semibold">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
                {lead.assigned_to_user_id && (
                  <div>
                    <p className="text-gray-500">Assigned To</p>
                    <p className="font-semibold">{lead.assigned_to_user_id}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
