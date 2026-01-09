import { useEffect, useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import { Link } from "react-router";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
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
  destination_interest: string | null;
  budget_range: string | null;
  created_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterSource, setFilterSource] = useState("");

  useEffect(() => {
    fetchLeads();
  }, [filterStage, filterSource]);

  const fetchLeads = async () => {
    try {
      let url = "/api/admin/crm/leads?";
      if (filterStage) url += `stage=${filterStage}&`;
      if (filterSource) url += `source=${filterSource}&`;
      if (searchTerm) url += `search=${searchTerm}`;

      const response = await fetch(url);
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchLeads();
  };

  const getStageColor = (stage: string): string => {
    const colors: Record<string, string> = {
      New: "bg-blue-100 text-blue-800",
      "Yet To Talk": "bg-purple-100 text-purple-800",
      Followup: "bg-amber-100 text-amber-800",
      Hot: "bg-red-100 text-red-800",
      "Proposal Presented": "bg-emerald-100 text-emerald-800",
      Converted: "bg-green-100 text-green-800",
      Cold: "bg-gray-100 text-gray-800",
      Lost: "bg-red-200 text-red-900",
      Duplicate: "bg-gray-200 text-gray-600",
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

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

  const sources = ["website", "whatsapp", "call", "instagram", "googleads", "referral"];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading leads...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-600 mt-1">Manage and track all your leads</p>
          </div>
          <Link
            to="/admin/crm/leads/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Lead
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search by name, email, or phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Stage
              </label>
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Stages</option>
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Source
              </label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sources</option>
                {sources.map((source) => (
                  <option key={source} value={source}>
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Next Followup
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-8 h-8 text-gray-400 mr-3" />
                        <div>
                          <p className="font-semibold text-gray-900">{lead.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {lead.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {lead.email}
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {lead.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStageColor(
                          lead.stage
                        )}`}
                      >
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 capitalize">{lead.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      {lead.destination_interest && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {lead.destination_interest}
                        </div>
                      )}
                      {lead.budget_range && (
                        <p className="text-xs text-gray-500 mt-1">{lead.budget_range}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {lead.next_followup_at && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(lead.next_followup_at).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/crm/leads/${lead.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {leads.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or create a new lead
            </p>
            <Link
              to="/admin/crm/leads/new"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Lead
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
