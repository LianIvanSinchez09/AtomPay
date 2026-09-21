import { ChartNoAxesCombined } from "lucide-react";
import "./Logo.css";
import { motion } from "motion/react";

const Core = () => {
  return (
    <motion.div className="core rounded-full backdrop-blur-2xl" >
      <ChartNoAxesCombined color="#ccf846" size={56} strokeWidth={3}/>
    </motion.div>
  );
};

export default Core;