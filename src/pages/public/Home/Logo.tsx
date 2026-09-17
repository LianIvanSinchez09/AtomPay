import { motion } from "motion/react";
import "./Logo.css";

const Logo = () => {
  return (
    <>
      <motion.div className="logoContainer drop-shadow-2xl md:h-120 md:w-120">
        <div className="orbit1"></div>
        <div className="orbit2"></div>
        <div className="orbit3"></div>
      </motion.div>
    </>
  );
};

export default Logo;
