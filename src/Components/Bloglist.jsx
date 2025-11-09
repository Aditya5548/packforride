import React, { useState } from 'react';
import { useRouter } from "next/router";
import Image from 'next/image';
import { assets } from '../assets/assets';
import { format } from 'timeago.js';
const Bloglist = (data) => {
  const [menu, setMenu] = useState("All");
  const [blogs] = useState(data.Blogs.blogs);
  const router = useRouter()
  function handleClick(response) {
    router.push({
      pathname: `/blogs/${response._id}`,
      query: response
    })
  }
  return (
    <div>
      <div className='text-center my-10'>
        <h1 className='text-2xl sm:text-4xl font-medium'>Find Your Desire Journey</h1>
        <p className='mt-5  md:max-w-[740px] m-auto text-xs px-10 sm:text-base'>Plan the perfect getaway with family and friends! Enjoy all-in-one travel packages, hotels, food, transport, and activities ,designed for comfort, fun, and unforgettable memories.</p>
        <form className='flex justify-between max-w-[300px] sm:max-w-[500px] scale-75 sm:scale-100 mx-auto mt-5 border border-black'>
          <input type="text" placeholder='Search Your Place' className='w-full pl-4 outline-none'/>
          <button type="submit" className='border-l border-black p-2 sm:px-8 active:bg-gray-600 text-white bg-black'>Search</button>
        </form>
      </div>
      <div className="flex justify-center gap-6 mb-5">
        <button onClick={() => setMenu('All')} className={menu == "All" ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>All</button>
        <button onClick={() => setMenu('Cultural')} className={menu == "Cultural" ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>Cultural</button>
        <button onClick={() => setMenu('Weekend')} className={menu == "Weekend" ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>Weekend</button>
        <button onClick={() => setMenu('Adventure')} className={menu == "Adventure" ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>Adventure</button>
        {/* <button onClick={() => setMenu('International')} className={menu == "International" ? 'bg-black text-white py-1 px-4 rounded-sm' : ""}>International</button> */}
      </div>
      <div className="flex flex-wrap justify-center gap-10 mb-16 xl:mx-24">
        {blogs.filter((item) => menu == "All" ? true : item.category === menu).map((item) => (
          <div className='max-w-[330px] bg-white rounded-md shadow-lg hover:shadow-[-7px_7px_0px_#00000]' key={item._id}>
            <div onClick={() => { handleClick(item) }} className='h-[150px]'>
              <Image src={item.image} alt='' width={330} height={100} className='absolute z-0 border-b border-gray-500 w-[330px] h-[150px] rounded-t-md' />
              <div className='flex justify-end'><p className=' bg-black/80 text-white w-fit p-1 rounded-sm text-sm relative top-2 right-2'> {format(item.createdAt)}</p></div>
            </div>
            <p className='ml-5 mt-5 px-5 py-1 inline-block bg-black text-white text-sm'>{item.category} </p>
            <div className="p-5">
              <h2 className='font-bold'>{item.tourname}</h2>
              <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900'>{item.title}</h5>
              <p className="mb-3 text-sm tracking-tight text-gray-700" dangerouslySetInnerHTML={{ __html: item.description.slice(0, 100) }}></p>
              <div className='inline-flex items-center py-2 font-semibold text-center'>
                <p onClick={() => { handleClick(item) }} className="flex px-3 py-1 cursor-pointer text-black bold">View <Image src={assets.arrow} width={15} height={3} className='ml-2' alt='' /></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};


export default Bloglist
