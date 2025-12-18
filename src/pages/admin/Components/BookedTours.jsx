import React from "react"
const BookedTours = () => {
  return (
    <div className='flex flex-col items-center pt-5 px-5 sm:pt-12 sm:pl-16 w-full'>
      <div className="relative h-[80vh] overflow-x-auto mt-4 border border-gray-400 w-9/10 scrolling">
      <div className="flex justify-center">
        <p className="text-lg pt-5">No Tours Booked . . . .</p>
      </div>
     </div>   
    </div>
  )
}

export default BookedTours
