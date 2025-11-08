import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { assets } from '../../../assets/assets';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [token, setToken] = useState('');
  const [data, setData] = useState({
    tourname: "",
    description: "",
  })
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData(data => ({ ...data, [name]: value }))
    console.log(data)
  }

  const onsubmitHandler = async (e) => {
    e.preventDefault(); // this is used for avoiding refreshing the page after the summit button click
    const formdata = new FormData();
    formdata.append('tourname', data.tourname)
    formdata.append('description', data.description)
    formdata.append('category', data.category)
    formdata.append('transport', data.transport)
    formdata.append('room', data.room)
    formdata.append('fooding', data.fooding)
    formdata.append('location', data.location)
    formdata.append('image', image)
    formdata.append('token', token)
    const response = await axios.post('/api/blog', formdata)

    console.log(response)
    if (response.data.status == "success") {
      toast.success('Tour Added Successfully')
      setImage(false)
      setData({
        tourname: "",
        description: ""
      })
    }
    else {
      toast.error(response.data.msg)
    }
  }
  useEffect(()=>{
    const localtoken = localStorage.getItem('token')
    setToken(localtoken)
  },[])
  return (
    <>
      <form onSubmit={onsubmitHandler} className="flex flex-col pt-5 px-5 sm:pt-12 sm:pl-16">
          <div className='flex flex-col items-center py-2 border w-full sm:w-[500px] '>
          <p>Upload Thumbnail</p>
          <label htmlFor="image">
            <Image className='mt-1 cursor-pointer' src={!image ? assets.upload_area : URL.createObjectURL(image)} alt='' width={140} height={70} />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image'/>
        </div>
        <input className="w-full sm:w-[500px] mt-2 px-4 py-3 border" name='tourname' onChange={onChangeHandler} value={data.tourname} type="text" placeholder='Tour Name' required />
        <textarea className="w-full sm:w-[500px] mt-2 px-4 py-3 border" type="text" name='description' onChange={onChangeHandler} value={data.description} placeholder='Tour Description' required />
        <select name="category" onChange={onChangeHandler} value={data.category} className='w-full sm:w-[500px] mt-2 px-4 py-2 border text-grey-500'>
          <option>Select Tour-Type</option>
          <option value="Cultural">Cultural</option>
          <option value="Weekend">Weekend</option>
          <option value="Adventure">Adventure</option>
          <option value="International">International</option>
        </select>

        <select name="transport" onChange={onChangeHandler} value={data.transport} className='w-full sm:w-[500px] mt-2 px-4 py-2 border text-grey-500'>
          <option value="no">Select Transport Facility</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <select name="room" onChange={onChangeHandler} value={data.room} className='w-full sm:w-[500px] mt-2 px-4 py-2 border text-grey-500'>
          <option value="no">Select Room Facility</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <select name="fooding" onChange={onChangeHandler} value={data.fooding} className='w-full sm:w-[500px] mt-2 px-4 py-2 border text-grey-500'>
          <option value="no">Select Fooding Faclity</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <input className="w-full sm:w-[500px] mt-2 px-4 py-3 border" name='location' onChange={onChangeHandler} value={data.location} type="text" placeholder='Add Location' required />
        <button type='submit' className='mt-4 px-10 py-2 bg-black text-white cursor-pointer'>ADD</button>
      </form>
    </>
  )
}

export default AddProduct
