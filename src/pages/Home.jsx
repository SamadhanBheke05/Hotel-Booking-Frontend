import React from 'react'
import Hero from '../components/Hero'
import MostPicked from '../components/MostPicked'
import PopularRooms from '../components/PopularRooms'
import Testimonials from '../components/Testimonials'

const Home = () => {
  return (
    <div className='py-24'>
      <Hero/>
      <MostPicked/>
      <PopularRooms/>
      <Testimonials/>
    </div>
  )
}

export default Home