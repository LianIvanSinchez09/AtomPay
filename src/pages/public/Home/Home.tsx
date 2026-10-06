import { Link } from "react-router-dom";
import { motion } from "motion/react";
import Logo from "./Logo";
import Navbar from "../Navbar";
import "./Home.css";
import Footer from "../../../components/Footer";

const Home = () => {
  return (
    <>
      <div className=" dark:bg-[#000000] dark:text-white transition-colors duration-300">
      <Navbar />
        <main className="homeContainer mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl items-center">
          <div className="homeItem introContainer w-full">
            <motion.div className="relative flex items-center justify-center">
              <motion.div className="absolute h-50 w-50 rounded-full bg-[#7AB2B2] blur-3xl dark:bg-[#A7D129]" />
              <Logo />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="flex gap-1 flex-col text-xl font-bold leading-tight md:text-6xl">
                Tu dinero tiene patrones.
                <span className="text-[#4D869C] dark:text-[#A7D129]">
                  AtomPay los encuentra.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-[#4D869C]/80 dark:text-white/70">
                AtomPay organiza tus facturas, servicios y gastos recurrentes para
                que tengas el control de tus finanzas de forma simple.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-xl bg-[#4D869C] px-6 py-3 font-semibold text-white shadow-lg transition dark:bg-[#A7D129] dark:text-[#000000]"
                  >
                    Comenzar ahora
                  </motion.button>
                </Link>

                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-xl border-2 border-[#7AB2B2] px-6 py-3 font-semibold text-[#4D869C] transition hover:bg-[#CDE8E5] dark:border-[#616F39] dark:text-[#A7D129] dark:hover:bg-[#3E432E]"
                  >
                    Iniciar sesión
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
