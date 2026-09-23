import { Link } from "react-router-dom";
import { motion } from "motion/react";
import Logo from "./Logo";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#EEF7FF] text-[#4D869C] dark:bg-[#000000] dark:text-white transition-colors duration-300">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 py-5 md:px-12"
      >
        <Link
          to="/"
          className="text-2xl font-bold text-[#4D869C] dark:text-[#A7D129]"
        >
          AtomPay
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 font-medium transition hover:bg-[#CDE8E5] dark:hover:bg-[#3E432E]"
          >
            Iniciar sesión
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-[#4D869C] px-4 py-2 font-medium text-white transition hover:bg-[#7AB2B2] dark:bg-[#A7D129] dark:text-[#000000] dark:hover:bg-[#616F39]"
          >
            Registrarse
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl items-center px-6 py-16">
        <div className="grid w-full items-center gap-12 md:grid-cols-2">
          {/* Logo animado */}
          <motion.div className="relative flex items-center justify-center">
            {/* Aura detrás del logo */}
            <motion.div className="absolute h-50 w-50 rounded-full bg-[#7AB2B2] blur-3xl dark:bg-[#A7D129]" />
            <Logo />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="mb-4 inline-block rounded-full bg-[#CDE8E5] px-4 py-2 text-sm font-medium text-[#4D869C] dark:bg-[#3E432E] dark:text-[#A7D129]">
              Gestión inteligente de gastos
            </span>

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
  );
};

export default Home;
