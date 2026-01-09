import { useEffect, useState } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import { FileText, Upload, Save, Eye, Calendar, User } from "lucide-react";

interface LegalDocument {
  id: number;
  type: string;
  title: string;
  html_content: string;
  pdf_url: string | null;
  use_pdf: boolean;
  last_updated: string;
  updated_by_user_id: string | null;
}

export default function LegalDocumentsPage() {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms" | "cancellation">("privacy");
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    html_content: "",
    pdf_url: "",
    use_pdf: false,
  });

  useEffect(() => {
    fetchDocument();
  }, [activeTab]);

  const fetchDocument = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/legal/${activeTab}`);
      const data = await response.json();
      setDocument(data);
      setFormData({
        title: data.title || "",
        html_content: data.html_content || "",
        pdf_url: data.pdf_url || "",
        use_pdf: data.use_pdf || false,
      });
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/legal/${activeTab}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      alert("Document saved successfully!");
      fetchDocument();
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Failed to save document");
    } finally {
      setSaving(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/admin/legal/${activeTab}/upload-pdf`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert("PDF uploaded successfully!");
        fetchDocument();
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  };

  const tabs = [
    { id: "privacy" as const, label: "Privacy Policy" },
    { id: "terms" as const, label: "Terms & Conditions" },
    { id: "cancellation" as const, label: "Cancellation & Refund Policy" },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading document...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Legal & Policies</h1>
            <p className="text-gray-600 mt-1">Manage legal documents and policies</p>
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

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 font-semibold transition border-b-2 ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Document Info */}
        {document && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">
                  Last updated: {formatDate(document.last_updated)}
                </span>
              </div>
              {document.updated_by_user_id && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">By: {document.updated_by_user_id}</span>
                </div>
              )}
            </div>
            <a
              href={`/${activeTab === "privacy" ? "privacy-policy" : activeTab === "terms" ? "terms-and-conditions" : "cancellation-policy"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <Eye className="w-4 h-4" />
              Preview
            </a>
          </div>
        )}

        {/* Content Editor */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Document Content</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Document Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                HTML Content
              </label>
              <textarea
                value={formData.html_content}
                onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Enter HTML content here..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt; for formatting
              </p>
            </div>
          </div>
        </div>

        {/* PDF Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">PDF Document</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload PDF Version
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  disabled={uploading}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Choose PDF File"}
                </label>
                <p className="text-sm text-gray-500 mt-2">Max file size: 10MB</p>
              </div>
              {formData.pdf_url && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-semibold mb-2">
                    <FileText className="inline w-4 h-4 mr-2" />
                    PDF Uploaded
                  </p>
                  <a
                    href={formData.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View uploaded PDF
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <input
                type="checkbox"
                id="use-pdf"
                checked={formData.use_pdf}
                onChange={(e) => setFormData({ ...formData, use_pdf: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="use-pdf" className="text-sm font-semibold text-gray-700">
                Display PDF version instead of HTML content on public page
              </label>
            </div>
            {formData.use_pdf && !formData.pdf_url && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ You have enabled PDF display but no PDF is uploaded. Please upload a PDF
                  file.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
