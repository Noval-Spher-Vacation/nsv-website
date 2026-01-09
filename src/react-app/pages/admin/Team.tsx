import { useEffect, useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import { useAuth } from "@/react-app/hooks/useAuth";
import { Plus, UserCheck, UserX, Edit2, Trash2 } from "lucide-react";

interface TeamMember {
  id: number;
  user_id: string;
  role: string;
  is_active: number;
  created_at: string;
}

export default function TeamPage() {
  const { role } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ user_id: "", role: "admin" });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await fetch("/api/admin/team");
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    try {
      await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });
      setShowAddModal(false);
      setNewMember({ user_id: "", role: "admin" });
      fetchTeam();
    } catch (error) {
      console.error("Error adding team member:", error);
    }
  };

  const handleToggleActive = async (id: number, isActive: number) => {
    try {
      await fetch(`/api/admin/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: isActive ? 0 : 1 }),
      });
      fetchTeam();
    } catch (error) {
      console.error("Error updating team member:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    try {
      await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      fetchTeam();
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  if (role !== "founder") {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only founders can manage team roles</p>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading team...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const roles = [
    { value: "founder", label: "Founder", description: "Full access including team management" },
    { value: "admin", label: "Admin", description: "Full CMS, CRM, and booking access" },
    { value: "support", label: "Support", description: "CRM and enquiry management" },
    { value: "bookings", label: "Bookings", description: "Booking and invoice management" },
    { value: "marketing", label: "Marketing", description: "Offers and ads management" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team & Roles</h1>
            <p className="text-gray-600 mt-1">Manage admin users and permissions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Team Member
          </button>
        </div>

        {/* Team Members Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  User ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Added
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-700">
                    {member.user_id}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {member.is_active ? (
                      <span className="flex items-center text-green-600 font-semibold">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-400 font-semibold">
                        <UserX className="w-4 h-4 mr-2" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(member.id, member.is_active)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title={member.is_active ? "Deactivate" : "Activate"}
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Member Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Team Member</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User ID (Email)
                  </label>
                  <input
                    type="email"
                    value={newMember.user_id}
                    onChange={(e) => setNewMember({ ...newMember, user_id: e.target.value })}
                    placeholder="user@novelspherevacations.in"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Official Zoho email ID of the team member
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {roles.find((r) => r.value === newMember.role)?.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleAddMember}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Add Member
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewMember({ user_id: "", role: "admin" });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Role Descriptions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Role Descriptions</h2>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.value} className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold text-gray-900">{role.label}</h3>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
