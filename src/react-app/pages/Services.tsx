import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import WhatsAppButton from "@/react-app/components/WhatsAppButton";
import { FileText, Hotel, Car, Shield, CheckCircle2 } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Comprehensive travel solutions for a seamless journey
            </p>
          </div>
        </div>
      </section>

      {/* Visa Assistance */}
      <section id="visa" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Visa Assistance</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Navigating visa requirements can be complex and time-consuming. Our expert team provides
                complete visa assistance to make the process smooth and hassle-free.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Document verification and preparation</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Application submission and tracking</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Expert guidance on visa requirements</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Support for tourist, business, and transit visas</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800"
                alt="Visa Assistance"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hotel Booking */}
      <section id="hotel" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
                alt="Hotel Booking"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Hotel className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Hotel Booking</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                From budget-friendly stays to luxury resorts, we curate the perfect accommodations
                that match your preferences and budget.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Handpicked hotels in prime locations</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Best rates and exclusive deals</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Options for all budgets and preferences</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">24/7 support for any accommodation issues</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transport & Transfers */}
      <section id="transport" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Car className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Transport & Transfers
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Enjoy seamless transportation throughout your journey with our reliable and comfortable
                transfer services.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Airport pickup and drop-off</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Inter-city transfers</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Private and shared vehicle options</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Professional, licensed drivers</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800"
                alt="Transport Services"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Travel Insurance */}
      <section id="insurance" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800"
                alt="Travel Insurance"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Travel Insurance</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Travel with peace of mind knowing you're protected against unexpected events with our
                comprehensive travel insurance options.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Medical emergency coverage</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Trip cancellation and interruption protection</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Lost baggage and personal belongings coverage</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">24/7 emergency assistance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help with Your Travel Plans?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Our team is ready to assist you with all your travel service needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition shadow-xl inline-block"
              >
                Contact Us
              </a>
              <a
                href="tel:8248596124"
                className="bg-blue-500/20 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-500/30 transition inline-block"
              >
                Call 8248596124
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
