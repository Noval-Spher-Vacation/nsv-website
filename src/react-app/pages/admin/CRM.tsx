import { useEffect, useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import { Link } from "react-router";
import {
  Users,
  Phone,
  Calendar,
  TrendingUp,
  PieChart,
  UserCheck,
  Clock,
  AlertCircle,
} from "lucide-react";

interface DashboardStats {
  stages: Array<{ stage: string; count: number }>;
  followups: {
    today: number;
    tomorrow: number;
    next_7_days: number;
    next_30_days: number;
  };
  sources: Array<{ source: string; count: number }>;
  users: Array<{ assigned_to_user_id: string; count: number }>;
}

export default function CRMPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/crm/dashboard");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching CRM stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: string): string => {
    const colors: Record<string, string> = {
      New: "bg-blue-500",
      "Yet To Talk": "bg-purple-500",
      Followup: "bg-amber-500",
      Hot: "bg-red-500",
      "Proposal Presented": "bg-emerald-500",
      Converted: "bg-green-600",
      Cold: "bg-gray-500",
      Lost: "bg-red-700",
      Duplicate: "bg-gray-400",
    };
    return colors[stage] || "bg-gray-500";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading CRM dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
            <p className="text-gray-600 mt-1">Lead management and pipeline overview</p>
          </div>
          <Link
            to="/admin/crm/leads"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View All Leads
          </Link>
        </div>

        {/* Lead Pipeline Stages */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Lead Pipeline
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {stats?.stages.map((stage) => (
              <div
                key={stage.stage}
                className="bg-white rounded-xl shadow-lg p-4 border-l-4"
                style={{ borderLeftColor: getStageColor(stage.stage).replace("bg-", "#") }}
              >
                <p className="text-xs text-gray-500 mb-1">{stage.stage}</p>
                <p className="text-3xl font-bold text-gray-900">{stage.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Followup Buckets */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Travel Followups
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-red-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {stats?.followups.today || 0}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-semibold">Today's Followups</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-8 h-8 text-orange-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {stats?.followups.tomorrow || 0}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-semibold">Tomorrow's Followups</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-blue-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {stats?.followups.next_7_days || 0}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-semibold">Next 7 Days</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-green-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {stats?.followups.next_30_days || 0}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-semibold">Next 30 Days</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Source Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <PieChart className="w-6 h-6 mr-2" />
              Lead Sources
            </h2>
            <div className="space-y-3">
              {stats?.sources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-700 capitalize">
                      {source.source}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{source.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User-wise Active Leads */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <UserCheck className="w-6 h-6 mr-2" />
              Active Leads by User
            </h2>
            <div className="space-y-3">
              {stats?.users.map((user) => (
                <div key={user.assigned_to_user_id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-700">
                      {user.assigned_to_user_id || "Unassigned"}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{user.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
