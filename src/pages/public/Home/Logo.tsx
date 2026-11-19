import { motion } from "motion/react";
import "./Logo.css";
import Core from "./Core";

type LogoProps = {
  circle?: boolean;
  bubbles?: boolean;
  spinning?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
};

const Logo = ({
  circle = true,
  bubbles = true,
  spinning = true,
  width,
  height,
  className = "",
}: LogoProps) => {
  return (
    <>
      <motion.div
        className={`logoContainer drop-shadow-2xl ${
          width === undefined ? "md:w-120" : ""
        } ${height === undefined ? "md:h-120" : ""} ${
          spinning ? "" : "logoPaused"
        } ${className}`}
        style={{ width, height }}
      >
        <div className="orbit1"></div>
        <div className="orbit1Back"></div>
        {circle && <div className="orbit2"></div>}
        {!(Number(width) <= 100 && Number(height) <= 100) ? <Core /> : ""}
        <div className="orbit3"></div>
        <div className="orbit3Back"></div>
        <div className="orbit4FHalf"></div>
        <div className="orbit4SHalf"></div>
        <div className="orbit4SHalfBack"></div>

        {bubbles && (
          <div className="bubbles">
            <span className="bubble bubble1"></span>
            <span className="bubble bubble2"></span>
            <span className="bubble bubble3"></span>
            <span className="bubble bubble4"></span>
            <span className="bubble bubble5"></span>
            <span className="bubble bubble6"></span>
            <span className="bubble bubble7"></span>
            <span className="bubble bubble8"></span>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Logo;