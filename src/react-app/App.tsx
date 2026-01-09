import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import { AuthProvider as CustomAuthProvider } from "@/react-app/hooks/useAuth";
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
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
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

export default function App() {
  return (
    <AuthProvider>
      <CustomAuthProvider>
        <Router>
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
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/crm" element={<CRMPage />} />
            <Route path="/admin/crm/leads" element={<LeadsPage />} />
            <Route path="/admin/crm/leads/:id" element={<LeadDetailPage />} />
            <Route path="/admin/team" element={<TeamPage />} />
            <Route path="/admin/destinations" element={<AdminDestinations />} />
            <Route path="/admin/packages" element={<AdminPackages />} />
            <Route path="/admin/offers" element={<AdminOffers />} />
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
            <Route path="/admin/enquiries" element={<AdminEnquiries />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/office" element={<OfficeSettingsPage />} />
            <Route path="/admin/legal" element={<LegalDocumentsPage />} />
            <Route path="/admin/influencer-requests" element={<InfluencerRequestsPage />} />
            <Route path="/admin/influencers" element={<InfluencersPage />} />
          </Routes>
        </Router>
      </CustomAuthProvider>
    </AuthProvider>
  );
}
