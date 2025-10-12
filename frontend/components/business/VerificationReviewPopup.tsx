"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VerificationReviewPopupProps {
  show: boolean; // pass true when verification enters review stage
}

const VerificationReviewPopup: React.FC<VerificationReviewPopupProps> = ({
  show,
}) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000); // auto hide after 3 sec
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-gray-900 text-white shadow-lg px-5 py-4 border border-gray-700"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <p className="text-white font-medium">Verification in Review</p>
            <p className="text-gray-300 text-sm">
              We’ll notify you once your verification is completed.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerificationReviewPopup;
