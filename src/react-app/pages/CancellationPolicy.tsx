import { useEffect, useState } from "react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import { FileText, Download, Calendar } from "lucide-react";

interface LegalDocument {
  id: number;
  type: string;
  title: string;
  html_content: string;
  pdf_url: string | null;
  use_pdf: boolean;
  last_updated: string;
}

export default function CancellationPolicyPage() {
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocument();
  }, []);

  const fetchDocument = async () => {
    try {
      const response = await fetch("/api/legal/cancellation");
      const data = await response.json();
      setDocument(data);
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!document) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Not Found</h1>
            <p className="text-gray-600">The requested document could not be found.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{document.title}</h1>
              {document.use_pdf && document.pdf_url && (
                <a
                  href={document.pdf_url}
                  download
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </a>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              Last updated on {formatDate(document.last_updated)}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {document.use_pdf && document.pdf_url ? (
              <div className="space-y-6">
                <iframe
                  src={document.pdf_url}
                  className="w-full h-[800px] rounded-lg border border-gray-200"
                  title={document.title}
                />
                <div className="text-center">
                  <a
                    href={document.pdf_url}
                    download
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF Version
                  </a>
                </div>
              </div>
            ) : (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: document.html_content }}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
