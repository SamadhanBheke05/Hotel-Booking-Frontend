import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Phone, Mail, Award, Shield, Users } from 'lucide-react';

const About = () => {
  const { navigate } = useContext(AppContext);

  const stats = [
    { label: "Best Stays", value: "20+" },
    { label: "Cities covered", value: "5+" },
    { label: "Hotel Partners", value: "10+" },
    { label: "Support", value: "24/7" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Your data and payments are protected with top-tier security standards."
    },
    {
      icon: Award,
      title: "Best Price Guarantee",
      description: "We ensure you get the best rates for premium stays across all locations."
    },
    {
      icon: Users,
      title: "Verified Reviews",
      description: "Read genuine feedback from verified guests who have completed their stays."
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-12">

      {/* Header / Mission Section - Centered, No Image */}
      <div className="container mx-auto px-4 md:px-10 lg:px-20 mb-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-full text-sm font-bold tracking-wide uppercase">
            About QuickStay
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading leading-tight">
            Redefining <br /> <span className="text-primary">Travel Experiences</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our mission is to bridge the gap between luxury and accessibility. We believe that finding the perfect stay should be as relaxing as the vacation itself.
            By partnering with top-rated properties, we guarantee quality, safety, and comfort for every traveler.
          </p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 border-t border-gray-100">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-50 py-20 mb-20">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-heading mb-4">Why Choose QuickStay</h2>
            <p className="text-gray-600">We prioritize your comfort and peace of mind with features designed for modern travelers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-heading mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Support Section - Redesigned (Clean/White Theme) */}
      <div className="container mx-auto px-4 md:px-10 lg:px-20 mb-20">
        <div className="bg-white rounded-3xl p-8 md:p-16 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/3 -translate-y-1/3"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-heading">We're here to help</h2>
              <p className="text-gray-600 text-lg max-w-lg mx-auto lg:mx-0">
                Have questions or need assistance? Our dedicated support team is available 24/7 to ensure your trip goes smoothly.
              </p>
              <button onClick={() => navigate('/contact')} className="bg-heading hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl inline-block">
                Contact Support
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
              {/* Contact Card 1 */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-primary/20 hover:bg-blue-50/30 transition-all group">
                <Phone className="w-8 h-8 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Support Line 1</p>
                <p className="text-xl font-bold text-heading">+91 98765 43210</p>
              </div>

              {/* Contact Card 2 */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-primary/20 hover:bg-blue-50/30 transition-all group">
                <Phone className="w-8 h-8 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Support Line 2</p>
                <p className="text-xl font-bold text-heading">+91 12345 67890</p>
              </div>

              {/* Email Card */}
              <div className="sm:col-span-2 bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-primary/20 hover:bg-blue-50/30 transition-all group flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-primary group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Email Support</p>
                  <p className="text-xl font-bold text-heading">support@quickstay.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
