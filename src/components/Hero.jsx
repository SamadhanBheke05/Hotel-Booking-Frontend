import React, { useContext } from 'react'
import { cities, homePageData } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { MapPin, Calendar, Users, Search, ArrowRight, Star } from 'lucide-react'

const Hero = () => {
    const { navigate, search, setSearch } = useContext(AppContext);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/hotels');
    }

    return (
        <section className="relative w-full min-h-screen bg-bg-soft flex flex-col justify-center pt-24 pb-12 overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -z-10 rounded-l-[100px] hidden lg:block" />

            <div className="container mx-auto px-4 md:px-10 lg:px-20 h-full">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 h-full">

                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">


                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-heading">
                            Find Your Next <br />
                            <span className="text-gradient">Perfect Stay</span>
                        </h1>

                        <p className="text-lg text-paragraph max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Discover handpicked hotels, resorts, and homes for your next adventure.
                            Comfort and luxury are just a tap away.
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <button onClick={() => navigate('/hotels')} className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium shadow-lg shadow-blue-500/30 transition-all hover:scale-105 flex items-center gap-2">
                                Explore Hotels <ArrowRight size={20} />
                            </button>
                            <button onClick={() => navigate('/about')} className="bg-white text-gray-700 hover:text-primary px-8 py-4 rounded-full font-medium border border-gray-200 hover:border-gray-300 transition-all flex items-center gap-2">
                                Learn More
                            </button>
                        </div>

                        {/* Stats Section */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-12 pt-8">
                            {homePageData.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <img src={item.icon} className="w-5 h-5 opacity-80" alt="" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xl text-heading">{item.value}</p>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="flex-1 relative w-full max-w-lg lg:max-w-xl animate-in fade-in zoom-in duration-1000 delay-200">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] rotate-3 opacity-20 blur-2xl -z-10" />
                        <img
                            src="/hero-img.png"
                            alt="Vacation"
                            className="w-full h-auto object-cover rounded-[2rem] shadow-2xl shadow-blue-900/10 border-4 border-white transform -rotate-2 hover:rotate-0 transition-all duration-500"
                        />

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce duration-[3000ms]">
                            <div className="bg-yellow-100 p-2 rounded-full">
                                <Star className="text-yellow-600 fill-yellow-600" size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Best Stays</p>
                                <p className="text-xs text-gray-500">Top Rated</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar - Floating */}
                <div className="relative mt-20 lg:mt-32">
                    <form onSubmit={handleSearch} className="bg-white p-4 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col lg:flex-row gap-4 max-w-5xl mx-auto transform translate-y-0 hover:-translate-y-1 transition-transform duration-300">

                        <div className="flex-1 bg-gray-50 p-3 rounded-2xl flex items-center gap-3 border border-transparent focus-within:border-primary/20 focus-within:bg-blue-50/30 transition-all">
                            <MapPin className="text-primary ml-2" size={20} />
                            <div className="w-full">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</label>
                                <input
                                    list='destinations'
                                    type="text"
                                    placeholder="Where do you want to go?"
                                    className="w-full bg-transparent outline-none text-gray-800 font-medium placeholder-gray-400"
                                    value={search.city}
                                    onChange={(e) => setSearch({ ...search, city: e.target.value })}
                                />
                                <datalist id='destinations'>
                                    {cities.map((city, index) => <option key={index} value={city} />)}
                                </datalist>
                            </div>
                        </div>

                        <div className="flex-1 bg-gray-50 p-3 rounded-2xl flex items-center gap-3 border border-transparent focus-within:border-primary/20 focus-within:bg-blue-50/30 transition-all">
                            <Calendar className="text-primary ml-2" size={20} />
                            <div className="w-full">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Check In</label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-transparent outline-none text-gray-800 font-medium"
                                    value={search.checkIn}
                                    onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex-1 bg-gray-50 p-3 rounded-2xl flex items-center gap-3 border border-transparent focus-within:border-primary/20 focus-within:bg-blue-50/30 transition-all">
                            <Calendar className="text-primary ml-2" size={20} />
                            <div className="w-full">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Check Out</label>
                                <input
                                    type="date"
                                    min={search.checkIn || new Date().toISOString().split('T')[0]}
                                    className="w-full bg-transparent outline-none text-gray-800 font-medium"
                                    value={search.checkOut}
                                    onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="w-full lg:w-40 bg-gray-50 p-3 rounded-2xl flex items-center gap-3 border border-transparent focus-within:border-primary/20 focus-within:bg-blue-50/30 transition-all">
                            <Users className="text-primary ml-2" size={20} />
                            <div className="w-full">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Guests</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    placeholder="1"
                                    className="w-full bg-transparent outline-none text-gray-800 font-medium"
                                    value={search.guests}
                                    onChange={(e) => setSearch({ ...search, guests: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="bg-primary hover:bg-blue-700 text-white rounded-2xl px-8 py-4 lg:py-0 font-medium transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                            <Search size={20} /> Search
                        </button>

                    </form>
                </div>

            </div>
        </section>
    )
}

export default Hero
