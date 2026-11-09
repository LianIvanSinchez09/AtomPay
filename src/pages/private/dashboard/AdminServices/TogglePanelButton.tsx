import React from "react";
import { motion } from "motion/react";

const TogglePanelButton = ({ fn, children, param, panel }) => {

  const handleFn = () => {
    fn(param);
  };

  return (
    <>
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        onClick={() => handleFn(param)}
        aria-expanded={panel === "upload"}
        className={`rounded-2xl border p-5 text-left shadow-sm transition-colors ${
          panel === "upload"
            ? "border-[#4D869C] bg-[#CDE8E5] dark:border-[#A7D129] dark:bg-[#3E432E]"
            : "border-[#CDE8E5] bg-white hover:bg-[#F7FCFF] dark:border-[#616F39] dark:bg-[#3E432E] dark:hover:bg-[#484D35]"
        }`}
      >
        {children}
      </motion.button>
    </>
  );
};

export default TogglePanelButton;
