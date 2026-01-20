import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ReactNode } from "react";
import { AuthProvider as CustomAuthProvider, useAuth } from "@/react-app/hooks/useAuth";
import CustomCursor from "@/react-app/components/CustomCursor";
import HomePage from "@/react-app/pages/Home";
import AboutPage from "@/react-app/pages/About";
import DestinationsPage from "@/react-app/pages/Destinations";
import DestinationDetailPage from "@/react-app/pages/DestinationDetail";
import PackagesPage from "@/react-app/pages/Packages";
import PackageDetailPage from "@/react-app/pages/PackageDetail";
import ServicesPage from "@/react-app/pages/Services";
import OffersPage from "@/react-app/pages/Offers";
import TestimonialsPage from "@/react-app/pages/Testimonials";
import BlogPage from "@/react-app/pages/Blog";
import BlogPostPage from "@/react-app/pages/BlogPost";
import ContactPage from "@/react-app/pages/Contact";
import FAQPage from "@/react-app/pages/FAQ";
import AdminDashboard from "@/react-app/pages/admin/Dashboard";
import AdminDestinations from "@/react-app/pages/admin/Destinations";
import AdminPackages from "@/react-app/pages/admin/Packages";
import AdminOffers from "@/react-app/pages/admin/Offers";
import AdminTestimonials from "@/react-app/pages/admin/Testimonials";
import AdminEnquiries from "@/react-app/pages/admin/Enquiries";
import AdminSettings from "@/react-app/pages/admin/Settings";
import CRMPage from "@/react-app/pages/admin/CRM";
import LeadsPage from "@/react-app/pages/admin/Leads";
import LeadDetailPage from "@/react-app/pages/admin/LeadDetail";
import TeamPage from "@/react-app/pages/admin/Team";
import InfluencerPage from "@/react-app/pages/Influencer";
import OfficeSettingsPage from "@/react-app/pages/admin/OfficeSettings";
import PrivacyPolicyPage from "@/react-app/pages/PrivacyPolicy";
import TermsAndConditionsPage from "@/react-app/pages/TermsAndConditions";
import CancellationPolicyPage from "@/react-app/pages/CancellationPolicy";
import LegalDocumentsPage from "@/react-app/pages/admin/LegalDocuments";
import InfluencerRequestsPage from "@/react-app/pages/admin/InfluencerRequests";
import InfluencersPage from "@/react-app/pages/admin/Influencers";
import PaymentSettingsPage from "@/react-app/pages/admin/PaymentSettings";
import AccessRequiredPage from "@/react-app/pages/AccessRequired";

function AccessGuard({ children }: { children: ReactNode }) {
  const { loading, accessDenied, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07060c] text-white flex items-center justify-center">
        <div className="glass-panel rounded-2xl px-8 py-6 text-white/80">
          Checking access...
        </div>
      </div>
    );
  }

  if (accessDenied || !user) {
    return <AccessRequiredPage />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <CustomAuthProvider>
      <Router>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:slug" element={<PackageDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/influencer" element={<InfluencerPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
          <Route path="/admin" element={<AccessGuard><AdminDashboard /></AccessGuard>} />
          <Route path="/admin/crm" element={<AccessGuard><CRMPage /></AccessGuard>} />
          <Route path="/admin/crm/leads" element={<AccessGuard><LeadsPage /></AccessGuard>} />
          <Route path="/admin/crm/leads/:id" element={<AccessGuard><LeadDetailPage /></AccessGuard>} />
          <Route path="/admin/team" element={<AccessGuard><TeamPage /></AccessGuard>} />
          <Route path="/admin/destinations" element={<AccessGuard><AdminDestinations /></AccessGuard>} />
          <Route path="/admin/packages" element={<AccessGuard><AdminPackages /></AccessGuard>} />
          <Route path="/admin/offers" element={<AccessGuard><AdminOffers /></AccessGuard>} />
          <Route path="/admin/testimonials" element={<AccessGuard><AdminTestimonials /></AccessGuard>} />
          <Route path="/admin/enquiries" element={<AccessGuard><AdminEnquiries /></AccessGuard>} />
          <Route path="/admin/settings" element={<AccessGuard><AdminSettings /></AccessGuard>} />
          <Route path="/admin/office" element={<AccessGuard><OfficeSettingsPage /></AccessGuard>} />
          <Route path="/admin/legal" element={<AccessGuard><LegalDocumentsPage /></AccessGuard>} />
          <Route path="/admin/influencer-requests" element={<AccessGuard><InfluencerRequestsPage /></AccessGuard>} />
          <Route path="/admin/influencers" element={<AccessGuard><InfluencersPage /></AccessGuard>} />
          <Route path="/admin/payments" element={<AccessGuard><PaymentSettingsPage /></AccessGuard>} />
        </Routes>
      </Router>
    </CustomAuthProvider>
  );
}
