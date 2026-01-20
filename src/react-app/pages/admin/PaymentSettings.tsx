import { useEffect, useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import { CreditCard, Save, Eye, EyeOff } from "lucide-react";

interface Settings {
  razorpay_key_id: string;
  razorpay_key_secret: string;
  razorpay_enabled: number;
  upi_id: string;
  upi_enabled: number;
  gst_number: string;
  company_pan: string;
  invoice_prefix: string;
  invoice_counter: number;
}

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    razorpay_key_id: "",
    razorpay_key_secret: "",
    razorpay_enabled: 0,
    upi_id: "",
    upi_enabled: 0,
    gst_number: "",
    company_pan: "",
    invoice_prefix: "NSV",
    invoice_counter: 1,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      setSettings({
        razorpay_key_id: data.razorpay_key_id || "",
        razorpay_key_secret: data.razorpay_key_secret || "",
        razorpay_enabled: data.razorpay_enabled || 0,
        upi_id: data.upi_id || "",
        upi_enabled: data.upi_enabled || 0,
        gst_number: data.gst_number || "",
        company_pan: data.company_pan || "",
        invoice_prefix: data.invoice_prefix || "NSV",
        invoice_counter: data.invoice_counter || 1,
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
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      alert("Payment settings saved successfully!");
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
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Settings</h1>
          <p className="text-gray-600">Configure payment gateways and invoicing</p>
        </div>

        <div className="space-y-6">
          {/* Razorpay Settings */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <CreditCard className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Razorpay Configuration</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={settings.razorpay_enabled === 1}
                    onChange={(e) =>
                      setSettings({ ...settings, razorpay_enabled: e.target.checked ? 1 : 0 })
                    }
                    className="w-5 h-5 text-primary-600 rounded mr-3"
                  />
                  <span className="text-gray-900 font-semibold">Enable Razorpay</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razorpay Key ID
                </label>
                <input
                  type="text"
                  value={settings.razorpay_key_id}
                  onChange={(e) => setSettings({ ...settings, razorpay_key_id: e.target.value })}
                  placeholder="rzp_test_xxxxxxxxxxxxx"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razorpay Key Secret
                </label>
                <div className="relative">
                  <input
                    type={showSecret ? "text" : "password"}
                    value={settings.razorpay_key_secret}
                    onChange={(e) =>
                      setSettings({ ...settings, razorpay_key_secret: e.target.value })
                    }
                    placeholder="Enter your Razorpay secret key"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* UPI Settings */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UPI Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={settings.upi_enabled === 1}
                    onChange={(e) =>
                      setSettings({ ...settings, upi_enabled: e.target.checked ? 1 : 0 })
                    }
                    className="w-5 h-5 text-primary-600 rounded mr-3"
                  />
                  <span className="text-gray-900 font-semibold">Enable UPI Payments</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                <input
                  type="text"
                  value={settings.upi_id}
                  onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                  placeholder="yourname@paytm"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* GST & Invoicing */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">GST & Invoicing</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                <input
                  type="text"
                  value={settings.gst_number}
                  onChange={(e) => setSettings({ ...settings, gst_number: e.target.value })}
                  placeholder="22AAAAA0000A1Z5"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company PAN</label>
                <input
                  type="text"
                  value={settings.company_pan}
                  onChange={(e) => setSettings({ ...settings, company_pan: e.target.value })}
                  placeholder="AAAAA0000A"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Prefix
                </label>
                <input
                  type="text"
                  value={settings.invoice_prefix}
                  onChange={(e) => setSettings({ ...settings, invoice_prefix: e.target.value })}
                  placeholder="NSV"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Invoices will be numbered as: {settings.invoice_prefix}
                  {String(settings.invoice_counter).padStart(4, "0")}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Invoice Number
                </label>
                <input
                  type="number"
                  value={settings.invoice_counter}
                  onChange={(e) =>
                    setSettings({ ...settings, invoice_counter: Number(e.target.value) })
                  }
                  min="1"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-neon-pink transition"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
