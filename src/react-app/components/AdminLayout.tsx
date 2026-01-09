import { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/react-app/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Package,
  Tag,
  MessageSquare,
  BookOpen,
  Settings,
  LogOut,
  UserCog,
  TrendingUp,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { user, role, logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["founder", "admin", "support", "bookings", "marketing"] },
    { name: "CRM & Leads", href: "/admin/crm", icon: Users, roles: ["founder", "admin", "support"] },
    { name: "Bookings", href: "/admin/bookings", icon: BookOpen, roles: ["founder", "admin", "bookings"] },
    { name: "Destinations", href: "/admin/destinations", icon: MapPin, roles: ["founder", "admin"] },
    { name: "Packages", href: "/admin/packages", icon: Package, roles: ["founder", "admin"] },
    { name: "Offers", href: "/admin/offers", icon: Tag, roles: ["founder", "admin", "marketing"] },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare, roles: ["founder", "admin"] },
    { name: "Influencers", href: "/admin/influencers", icon: TrendingUp, roles: ["founder", "admin", "marketing"] },
    { name: "Influencer Requests", href: "/admin/influencer-requests", icon: Users, roles: ["founder", "admin"] },
    { name: "Team & Roles", href: "/admin/team", icon: UserCog, roles: ["founder"] },
    { name: "Settings", href: "/admin/settings", icon: Settings, roles: ["founder", "admin"] },
    { name: "Office & Contact", href: "/admin/office", icon: MapPin, roles: ["founder", "admin"] },
    { name: "Legal & Policies", href: "/admin/legal", icon: BookOpen, roles: ["founder", "admin"] },
  ];

  const filteredNav = navigation.filter(item => 
    role && item.roles.includes(role)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <Link to="/" className="text-2xl font-bold text-blue-400">
              Novel Sphere
            </Link>
            <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {filteredNav.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== "/admin" && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.name || user?.email}</p>
                <p className="text-xs text-gray-400 capitalize">{role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
