import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import Navbar from "../Components/Navbar";
import Footer from '../Components/Footer';
import Tourlist from '../Components/Tourlist';
export default function Home(props) {

  return (
    <>
    <ToastContainer/>
    <Navbar/>
    <Tourlist Blogs={props}/>
    <Footer/>
    </>
  );
}

export const getServerSideProps = async () => {
  try {
    const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/tours`,{ params: {token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkFkaXR5YTkzNzciLCJpYXQiOjE3NjA1MzM0NzN9.CqdnBoA0eNMwLa7U8dWtDhuw7QLa3tsgbL8Q8hxSvAo"}});
    return {
      props: {blogs:res.data},
    };
  } catch (error) {
    console.error("Error fetching blogs:", error.message);
    return {
      props: { blogs: [] },
    };
  }
};
