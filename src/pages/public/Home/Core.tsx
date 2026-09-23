import { ChartNoAxesCombined } from "lucide-react";
import "./Logo.css";
import { motion } from "motion/react";

const Core = () => {
  return (
    <motion.div className="core rounded-full" >
      <ChartNoAxesCombined className="coreinner" color="#FFFFFF" size={56} strokeWidth={3}/>
    </motion.div>
  );
};

export default Core;