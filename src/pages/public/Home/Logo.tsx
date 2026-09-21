import { motion } from "motion/react";
import "./Logo.css";
import Core from "./Core";


const Logo = () => {
  return (
    <>
      <motion.div className="logoContainer drop-shadow-2xl md:h-120 md:w-120">
        <div className="orbit1"></div>
        <div className="orbit1Back"></div>
        <div className="orbit2"></div>
        <Core/>
        <div className="orbit3"></div>
        <div className="orbit3Back"></div>
      </motion.div>
    </>
  );
};

export default Logo;
