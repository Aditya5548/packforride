"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ReviewSection = ({ tourid }) => {
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    comment: "",
  });

  // 🔥 FETCH REVIEWS
  const reviewfind = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/review", { params: { tourid } });

      const cleanData = (res.data || [])
        .filter((r) => r && r._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // latest first

      setReviews(cleanData);
    } catch (err) {
      toast.error("Error fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tourid) reviewfind();
  }, [tourid]);

  // 🔥 ADD REVIEW
  const handleAddReview = async () => {
    if (!newReview.name || !newReview.rating || !newReview.comment) {
      toast.error("All Fields Required");
      return;
    }

    try {
      const data = {
        username: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        tourid: tourid,
        date: new Date().toLocaleDateString(),
      };

      const tempReview = {
        _id: Date.now().toString(),
        ...data,
      };

      // Add optimistically at the start
      setReviews((prev) => [tempReview, ...prev]);

      await axios.post("/api/review", data);
      reviewfind(); // sync with backend

      setNewReview({ name: "", rating: 0, comment: "" });
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to add review");
    }
  };

  // 🔥 SLIDER SCROLL
  const scroll = (dir) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = window.innerWidth < 768 ? window.innerWidth * 0.9 : 336;
    container.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = window.innerWidth < 768 ? window.innerWidth * 0.9 : 336;
    const index = Math.round(container.scrollLeft / cardWidth);
    setCurrentIndex(index);
  };

  return (
    <div>
      {/* ADD BUTTON */}
      <div className="flex justify-end my-4 mr-5">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 md:text-lg"
        >
          Add Review
        </button>
      </div>

      {/* SLIDER */}
      <div className="relative bg-gray-100 py-8 rounded-xl">
        {/* LEFT ARROW */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-lg px-3 py-2 rounded-full z-10"
        >
          ‹
        </button>

        {/* CARDS */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto px-4 md:px-10 snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {loading ? (
            <p className="text-center w-full">Loading...</p>
          ) : reviews.length > 0 ? (
            reviews.map((review) => {
              if (!review || !review._id) return null;
              const isExpanded = expanded === review._id;

              return (
                <div
                  key={review._id}
                  className="snap-center min-w-[85%] md:min-w-[300px] bg-white border rounded-2xl p-5 shadow-md flex-shrink-0"
                >
                  {/* USER */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                      {review.username?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {review.username || "Anonymous"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {review.date || "No date"}
                      </p>
                    </div>
                  </div>

                  {/* STARS */}
                  <div className="text-yellow-500 text-lg mb-2">
                    {"★".repeat(review.rating || 0)}
                    {"☆".repeat(5 - (review.rating || 0))}
                  </div>

                  {/* COMMENT */}
                  <p className="text-gray-600 text-sm">
                    {isExpanded ? review.comment : review.comment?.slice(0, 80)}
                    {review.comment?.length > 80 && (
                      <span
                        onClick={() =>
                          setExpanded(isExpanded ? null : review._id)
                        }
                        className="text-orange-500 cursor-pointer ml-1"
                      >
                        {isExpanded ? " Show less" : "... Read more"}
                      </span>
                    )}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-center w-full text-gray-500">No reviews yet</p>
          )}
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-lg px-3 py-2 rounded-full z-10"
        >
          ›
        </button>

        {/* DOTS */}
        <div className="flex justify-center mt-4 gap-2">
          {reviews.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-gray-200/40 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 w-[350px] shadow-lg relative"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-xl"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-4">Add Review</h2>

            <input
              type="text"
              placeholder="Your Name"
              value={newReview.name}
              onChange={(e) =>
                setNewReview({ ...newReview, name: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <div className="mb-3">
              <p className="text-sm mb-1">Facility Rating</p>
              <div className="flex gap-1 text-2xl cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() =>
                      setNewReview({ ...newReview, rating: star })
                    }
                    className={
                      star <= newReview.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Write your comment..."
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <button
              onClick={handleAddReview}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;