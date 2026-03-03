import React from 'react'
import { Star } from 'lucide-react'

const testimonials = [
    {
        name: "Sanket Kenjale",
        image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
        text: "I've been using this platform for multiple times for my travel vlogs. The booking process is seamless and the hotels are always top-notch."
    },
    {
        name: "Rahul Shivkar",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop",
        text: "The best travel companion I could ask for. Finding aesthetic stays for my photoshoots has never been easier. Highly recommended!"
    },
    {
        name: "Lalit patil",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
        text: "As someone who works remotely, consistent wifi and comfort are key. This app helps me find the perfect work-cation spots every time."
    }
]

const Testimonials = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-10 lg:px-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">What Our Guests Say</h2>
                    <p className="text-paragraph max-w-xl mx-auto">
                        Real stories from real travelers. Discover why thousands trust us for their perfect getaway.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                            <div className="mb-4">
                                <h4 className="font-bold text-heading text-lg mb-1">{item.name}</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{item.role}</p>
                            </div>

                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className="text-secondary fill-secondary" />
                                ))}
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed italic">
                                "{item.text}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials