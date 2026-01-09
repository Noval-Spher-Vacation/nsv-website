import { useEffect, useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import { MapPin, Phone, Mail, Clock, Save, Plus } from "lucide-react";

export default function OfficeSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    office_address: "",
    office_map_url: "",
    contact_phone: "",
    contact_email: "",
    business_hours: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      setFormData({
        office_address: data.office_address || "",
        office_map_url: data.office_map_url || "",
        contact_phone: data.contact_phone || data.whatsapp_number || "",
        contact_email: data.contact_email || data.support_email || "",
        business_hours: data.business_hours || "",
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      alert("Settings updated successfully!");
      fetchSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Office & Contact Settings</h1>
            <p className="text-gray-600 mt-1">Manage office locations and contact information</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Primary Office */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Primary Office Location</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-2" />
                Office Address
              </label>
              <textarea
                value={formData.office_address}
                onChange={(e) => setFormData({ ...formData, office_address: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1st Floor, Wework, Olympia Cyberspace, Guindy, Chennai, Tamil Nadu 600032"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Google Maps URL
              </label>
              <input
                type="url"
                value={formData.office_map_url}
                onChange={(e) => setFormData({ ...formData, office_map_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://maps.app.goo.gl/uLPntCQCTnXn1Ks58"
              />
              <p className="text-sm text-gray-500 mt-1">
                Get the shareable link from Google Maps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-2" />
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="8248596124"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-2" />
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="info@novelspherevacations.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-2" />
                Business Hours
              </label>
              <input
                type="text"
                value={formData.business_hours}
                onChange={(e) => setFormData({ ...formData, business_hours: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10 AM – 7 PM (Visit by appointment only)"
              />
            </div>
          </div>

          {/* Map Preview */}
          {formData.office_map_url && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Map Preview</h3>
              <div className="rounded-xl overflow-hidden shadow-lg h-64 bg-gray-200">
                <iframe
                  src={formData.office_map_url.replace('goo.gl', 'google.com/maps/embed?pb=')}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Office Location Preview"
                />
              </div>
            </div>
          )}
        </div>

        {/* Future: Multiple Branch Locations */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Branch Locations</h2>
              <p className="text-sm text-gray-600">Manage additional office branches</p>
            </div>
            <button
              disabled
              className="bg-gray-300 text-gray-500 px-6 py-3 rounded-lg font-semibold flex items-center cursor-not-allowed"
              title="Coming soon"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Branch (Coming Soon)
            </button>
          </div>
          
          <div className="text-center py-12 text-gray-500">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>Multiple branch management will be available in the next update</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
