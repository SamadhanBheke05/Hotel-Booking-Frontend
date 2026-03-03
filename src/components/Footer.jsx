import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
                <div className="flex flex-col md:flex-row justify-between w-full gap-12 border-b border-gray-800 pb-12">

                    {/* Brand Section */}
                    <div className="md:max-w-xs space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white tracking-wide">QuickStay</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Dedicated to transparency and excellence in hospitality.
                            Our platform connects you with handpicked accommodations,
                            ensuring every journey is defined by comfort.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="flex-1 flex flex-col sm:flex-row gap-12 md:justify-end">
                        <div>
                            <h2 className="font-semibold text-white mb-6 text-lg">Company</h2>
                            <ul className="text-sm space-y-4">
                                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                                <li><Link to="/about" className="hover:text-primary transition-colors">About us</Link></li>
                                <li><Link to="/hotels" className="hover:text-primary transition-colors">Our Hotels</Link></li>
                                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="font-semibold text-white mb-6 text-lg">Support</h2>
                            <ul className="text-sm space-y-4">
                                <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                                <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="font-semibold text-white mb-6 text-lg">Get in touch</h2>
                            <div className="text-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-primary" />
                                    <p>+91 9167637488</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-primary" />
                                    <p>Quickstay@gmail.com</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin size={16} className="text-primary" />
                                    <p>Mumbai, India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 text-center text-xs md:text-sm text-gray-500">
                    <p>
                        Copyright {new Date().getFullYear()} © <span className="text-white font-medium">Quick Stay</span>. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer