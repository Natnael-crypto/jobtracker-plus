import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const LoadingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-white">
      {/* Logo / App Name */}
      <motion.h1
        className="text-3xl md:text-4xl font-semibold tracking-tight mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-black">JobTracker</span>
        <span className="text-green-800">+</span>
      </motion.h1>

      {/* Loader Icon */}
      <motion.div
        className="flex items-center justify-center"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
        }}
      >
        <Loader2 className="w-12 h-12 text-green-500" />
      </motion.div>

      {/* Loading Text */}
      <motion.p
        className="mt-6 text-gray-800 text-sm tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Loading, please wait...
      </motion.p>
    </div>
  );
};

export default LoadingPage;
