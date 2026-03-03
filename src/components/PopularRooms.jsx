import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import RoomCard from './RoomCard';

const PopularRooms = () => {
  const { roomData, navigate } = useContext(AppContext);

  return (
    <section className='py-20 bg-gray-50'>
      <div className="container mx-auto px-4 md:px-10 lg:px-20">
        <div className="text-center mb-12">
          <h2 className='text-3xl md:text-4xl font-bold text-heading mb-4'>
            Popular Rooms
          </h2>
          <p className='text-paragraph max-w-xl mx-auto'>
            Discover spacious and elegant rooms designed for your ultimate relaxation and comfort.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {
            roomData.slice(0, 8).map((room) => (
              <RoomCard key={room._id} room={room} />
            ))
          }
        </div>

        <div className="flex justify-center mt-12">
          <button onClick={() => navigate('/rooms')} className="px-8 py-3 border border-primary text-primary font-medium rounded-full hover:bg-primary hover:text-white transition-all duration-300">
            View All Rooms
          </button>
        </div>

      </div>
    </section>
  )
}

export default PopularRooms