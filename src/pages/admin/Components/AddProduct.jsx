import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { assets } from "../../../assets/assets";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    tourname: "",
    description: "",
    category: "",
    transport: "no",
    room: "no",
    fooding: "no",
    city: "",
    lon: "",
    lat: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onsubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload thumbnail image");
      return;
    }

    try {
      setLoading(true);

      const formdata = new FormData();
      formdata.append("tourname", data.tourname);
      formdata.append("description", data.description);
      formdata.append("category", data.category);
      formdata.append("transport", data.transport);
      formdata.append("room", data.room);
      formdata.append("fooding", data.fooding);
      formdata.append("city", data.city);
      formdata.append("image", image);
      formdata.append("token", token);
      formdata.append("longitute", data.lon);
      formdata.append("latitute", data.lat);

      const response = await axios.post("/api/tours", formdata);

      if (response.data.status === "success") {
        toast.success("Tour Added Successfully");
        setImage(false);
        setData({
          tourname: "",
          description: "",
          category: "",
          transport: "no",
          room: "no",
          fooding: "no",
          city: "",
          lon: "",
          lat: "",
        });
      } else {
        toast.error(response.data.msg || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to add tour");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const localtoken = localStorage.getItem("token");
    setToken(localtoken || "");
  }, []);

  return (
    <div className="min-h-screen px-3 py-4 sm:px-5 sm:py-6">
      <div className="mx-auto max-w-6xl">
        <form
          onSubmit={onsubmitHandler}
          className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-stretch"
        >
          {/* Left Side */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm h-full">
            <div className="mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                Tour Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Tour Name
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none transition-all duration-200 focus:border-black focus:bg-white"
                  name="tourname"
                  onChange={onChangeHandler}
                  value={data.tourname}
                  type="text"
                  placeholder="Enter tour name"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Tour Description
                </label>
                <textarea
                  className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none transition-all duration-200 focus:border-black focus:bg-white"
                  name="description"
                  onChange={onChangeHandler}
                  value={data.description}
                  placeholder="Write tour description"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Tour Type
                </label>
                <select
                  name="category"
                  onChange={onChangeHandler}
                  value={data.category}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none transition-all duration-200 focus:border-black focus:bg-white"
                  required
                >
                  <option value="">Select Tour Type</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Weekend">Weekend</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  City
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none transition-all duration-200 focus:border-black focus:bg-white"
                  name="city"
                  onChange={onChangeHandler}
                  value={data.city}
                  type="text"
                  placeholder="Add city"
                  required
                />
              </div>
            </div>

            <div className="mb-4 mt-5 border-b border-slate-100 pb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                Facilities
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Transport
                </label>
                <select
                  name="transport"
                  onChange={onChangeHandler}
                  value={data.transport}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none transition-all duration-200 focus:border-black focus:bg-white"
                >
                  <option value="no">Select Transport Facility</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Room
                </label>
                <select
                  name="room"
                  onChange={onChangeHandler}
                  value={data.room}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none transition-all duration-200 focus:border-black focus:bg-white"
                >
                  <option value="no">Select Room Facility</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Fooding
                </label>
                <select
                  name="fooding"
                  onChange={onChangeHandler}
                  value={data.fooding}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none transition-all duration-200 focus:border-black focus:bg-white"
                >
                  <option value="no">Select Fooding Facility</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div className="mb-4 mt-5 border-b border-slate-100 pb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                Location Coordinates
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Longitude
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none transition-all duration-200 focus:border-black focus:bg-white"
                  name="lon"
                  onChange={onChangeHandler}
                  value={data.lon}
                  type="text"
                  placeholder="Add longitude"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Latitude
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none transition-all duration-200 focus:border-black focus:bg-white"
                  name="lat"
                  onChange={onChangeHandler}
                  value={data.lat}
                  type="text"
                  placeholder="Add latitude"
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex h-full flex-col">
            <div className="mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                Thumbnail Upload
              </h2>
            </div>

            <label
              htmlFor="image"
              className="flex min-h-[190px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center transition-all duration-200 hover:border-black hover:bg-slate-100"
            >
              <Image
                className="rounded-xl object-cover"
                src={!image ? assets.upload_area : URL.createObjectURL(image)}
                alt="upload"
                width={150}
                height={100}
              />
              <p className="mt-2 text-xs font-medium text-slate-700">
                {image ? "Change Thumbnail" : "Upload Thumbnail"}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Click here to select image
              </p>
            </label>

            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="mb-2 text-xs font-semibold text-slate-700">
                Quick Preview
              </p>

              <div className="space-y-1 text-xs text-slate-600">
                <p>
                  <span className="font-medium text-slate-800">Tour:</span>{" "}
                  {data.tourname || "Not added"}
                </p>
                <p>
                  <span className="font-medium text-slate-800">Category:</span>{" "}
                  {data.category || "Not selected"}
                </p>
                <p>
                  <span className="font-medium text-slate-800">City:</span>{" "}
                  {data.city || "Not added"}
                </p>
                <p>
                  <span className="font-medium text-slate-800">Transport:</span>{" "}
                  {data.transport}
                </p>
                <p>
                  <span className="font-medium text-slate-800">Room:</span>{" "}
                  {data.room}
                </p>
                <p>
                  <span className="font-medium text-slate-800">Fooding:</span>{" "}
                  {data.fooding}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-auto w-full rounded-xl bg-black px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Add Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;