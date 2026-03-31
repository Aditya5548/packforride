import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const AnimatedNumber = ({ value, suffix = "" }) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    Math.floor(latest)
  );

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 2 });
    return controls.stop;
  }, [value]);

  return (
    <span>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

const Countdown = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const colorChange = {
    hidden: { color: "#111827" },
    visible: {
      color: "#db63f3",
      transition: { duration: 0.8, delay: 0.2 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <section className="bg-gray-100 py-4 md:py-8 font-inter overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-5xl text-gray-900 leading-tight">
            Plan Your Perfect Trip with Smart Travel Tools
          </h2>

          <p className="mt-2 text-gray-600 text-sm md:text-lg max-w-2xl mx-auto">
            Discover destinations, plan itineraries, and book your journey — all in one place.
          </p>
        </motion.div>

        {/* Big Stat */}
        <motion.div
          className="mt-2"
          initial={isMobile ? "hidden" : "visible"}
          whileInView={isMobile ? "visible" : ""}
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="text-4xl md:text-6xl text-[#db63f3] font-bold">
            <AnimatedNumber value={5000} suffix="+" />
          </h3>
          <p className="mt-3 text-gray-700">
            Trips Planned Successfully
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <motion.h4
              variants={colorChange}
              className="text-3xl font-bold"
            >
              <AnimatedNumber value={500} suffix="+" />
            </motion.h4>
            <p className="text-gray-600">Destinations Covered</p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <motion.h4
              variants={colorChange}
              className="text-3xl font-bold"
            >
              <AnimatedNumber value={27} />
            </motion.h4>
            <p className="text-gray-600">States Support</p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <motion.h4
              variants={colorChange}
              className="text-2xl font-bold"
            >
              <AnimatedNumber value={1000} suffix="+" />
            </motion.h4>
            <p className="text-gray-600">Happy Travelers</p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Countdown;