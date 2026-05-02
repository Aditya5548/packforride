"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

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

  const reviewfind = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/review", { params: { tourid } });

      const cleanData = (res.data || [])
        .filter((r) => r && r._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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

  const handleAddReview = async () => {
    if (!newReview.name || !newReview.rating || !newReview.comment) {
      toast.error("All fields required");
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

      setReviews((prev) => [tempReview, ...prev]);

      await axios.post("/api/review", data);
      reviewfind();

      setNewReview({ name: "", rating: 0, comment: "" });
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to add review");
    }
  };

  const scroll = (dir) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = window.innerWidth < 768 ? window.innerWidth * 0.88 : 340;
    container.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = window.innerWidth < 768 ? window.innerWidth * 0.88 : 340;
    const index = Math.round(container.scrollLeft / cardWidth);
    setCurrentIndex(index);
  };

  return (
    <section className="rounded-[22px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden">
      <div className="px-4 sm:px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-[#f7f7f7] via-[#ffffff] to-[#f1f1f1]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-600">
              Customer Feedback
            </p>
            <h2 className="text-sm sm:text-lg font-bold text-slate-900 mt-1">
              View and Review
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
              See what travelers are saying and share your own experience
            </p>
          </div>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="self-start sm:self-auto rounded-full bg-gray-900 hover:bg-black text-white px-4 py-2 text-[10px] sm:text-xs font-semibold shadow-md transition"
          >
            Share your Experience
          </motion.button>
        </div>
      </div>

      <div className="relative px-3 sm:px-4 py-5">
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm text-slate-700 shadow-md hover:bg-gray-100 transition"
        >
          ‹
        </button>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto px-8 sm:px-10 snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {loading ? (
            <div className="w-full flex justify-center py-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-[3px] border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
                <p className="mt-3 text-[10px] sm:text-xs text-slate-500">
                  Loading reviews...
                </p>
              </div>
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review, index) => {
              if (!review || !review._id) return null;
              const isExpanded = expanded === review._id;

              return (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="snap-center min-w-[85%] sm:min-w-[78%] md:min-w-[320px] lg:min-w-[340px] bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-[20px] p-4 sm:p-5 shadow-[0_8px_25px_rgba(15,23,42,0.05)] flex-shrink-0"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      {review.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-900">
                        {review.username || "Anonymous"}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                        {review.date || "No date"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm sm:text-base ${
                          star <= (review.rating || 0)
                            ? "text-amber-400"
                            : "text-slate-200"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="text-[10px] sm:text-xs text-slate-600 leading-6">
                    {isExpanded ? review.comment : review.comment?.slice(0, 110)}
                    {review.comment?.length > 110 && (
                      <span
                        onClick={() => setExpanded(isExpanded ? null : review._id)}
                        className="text-gray-700 font-medium cursor-pointer ml-1"
                      >
                        {isExpanded ? " Show less" : "... Read more"}
                      </span>
                    )}
                  </p>
                </motion.div>
              );
            })
          ) : (
            <div className="w-full flex justify-center py-10">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5 text-center">
                <p className="text-[10px] sm:text-xs text-slate-500">
                  No reviews yet
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm text-slate-700 shadow-md hover:bg-gray-100 transition"
        >
          ›
        </button>

        {reviews.length > 1 && (
          <div className="flex justify-center mt-5 gap-2">
            {reviews.map((_, index) => (
              <div
                key={index}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-5 h-2 bg-gray-800"
                    : "w-2 h-2 bg-slate-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            onClick={() => setShowModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md rounded-[24px] border border-gray-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.18)] overflow-hidden"
            >
              <div className="px-5 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#f7f7f7] via-[#ffffff] to-[#f1f1f1] flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Add Feedback
                  </p>
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 mt-1">
                    Share Your Review
                  </h3>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 text-slate-600 hover:bg-gray-50 transition"
                >
                  ×
                </button>
              </div>

              <div className="p-5 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-slate-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={newReview.name}
                      onChange={(e) =>
                        setNewReview({ ...newReview, name: e.target.value })
                      }
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-[10px] sm:text-xs text-slate-800 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] sm:text-xs font-medium text-slate-700 mb-2">
                      Rating
                    </p>
                    <div className="flex gap-1.5 text-xl cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.span
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          key={star}
                          onClick={() =>
                            setNewReview({ ...newReview, rating: star })
                          }
                          className={
                            star <= newReview.rating
                              ? "text-amber-400"
                              : "text-slate-300"
                          }
                        >
                          ★
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-slate-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      placeholder="Write your review..."
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                      rows={5}
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-[10px] sm:text-xs text-slate-800 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddReview}
                    className="w-full rounded-2xl bg-gray-900 hover:bg-black text-white py-3 text-[10px] sm:text-xs font-semibold shadow-md transition"
                  >
                    Submit Review
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ReviewSection;