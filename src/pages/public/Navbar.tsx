import { motion } from 'motion/react'
import { Link } from "react-router-dom";
import NavLogo from './NavLogo/NavLogo';

const Navbar = () => {
  return (
    <>
     <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="homeItem flex items-center justify-between px-6 py-5 md:px-12"
      >
        <NavLogo/>

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
    </>
  )
}

export default Navbar
