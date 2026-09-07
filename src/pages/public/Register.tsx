import { Link } from "react-router-dom";
import { motion } from "motion/react";

const Register = () => {
    return (
        <div className="min-h-screen bg-[#EEF7FF] text-[#4D869C] transition-colors duration-300 dark:bg-[#000000] dark:text-white">

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
            </motion.nav>

            {/* Register */}
            <main className="flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-10">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-[#3E432E]"
                >

                    {/* Título */}
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold">
                            Crear una cuenta
                        </h1>

                        <p className="mt-2 text-sm opacity-70">
                            Empezá a gestionar tus gastos con AtomPay
                        </p>
                    </div>

                    {/* Google */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-[#CDE8E5] bg-white px-4 py-3 font-medium text-[#4D869C] transition hover:bg-[#EEF7FF] dark:border-[#616F39] dark:bg-[#000000] dark:text-white dark:hover:bg-[#3E432E]"
                    >
                        <span className="text-lg font-bold">
                            G
                        </span>

                        Registrarse con Google
                    </motion.button>

                    {/* Registro con email */}

                    {/*
                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-[#CDE8E5] dark:bg-[#616F39]" />

                        <span className="text-xs opacity-50">
                            O REGISTRATE CON EMAIL
                        </span>

                        <div className="h-px flex-1 bg-[#CDE8E5] dark:bg-[#616F39]" />
                    </div>

                    <form className="space-y-4">

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Nombre
                            </label>

                            <input
                                type="text"
                                placeholder="Tu nombre"
                                className="w-full rounded-xl border-2 border-[#CDE8E5] bg-[#EEF7FF] px-4 py-3 outline-none transition placeholder:text-[#4D869C]/50 focus:border-[#4D869C] dark:border-[#616F39] dark:bg-[#000000] dark:text-white dark:focus:border-[#A7D129]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="w-full rounded-xl border-2 border-[#CDE8E5] bg-[#EEF7FF] px-4 py-3 outline-none transition placeholder:text-[#4D869C]/50 focus:border-[#4D869C] dark:border-[#616F39] dark:bg-[#000000] dark:text-white dark:focus:border-[#A7D129]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Contraseña
                            </label>

                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full rounded-xl border-2 border-[#CDE8E5] bg-[#EEF7FF] px-4 py-3 outline-none transition placeholder:text-[#4D869C]/50 focus:border-[#4D869C] dark:border-[#616F39] dark:bg-[#000000] dark:text-white dark:focus:border-[#A7D129]"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-2 w-full rounded-xl bg-[#4D869C] px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-[#7AB2B2] dark:bg-[#A7D129] dark:text-[#000000] dark:hover:bg-[#616F39]"
                        >
                            Crear cuenta
                        </motion.button>

                    </form>
                    */}

                    {/* Login */}
                    <p className="mt-8 text-center text-sm opacity-70">
                        ¿Ya tenés una cuenta?{" "}

                        <Link
                            to="/login"
                            className="font-semibold text-[#4D869C] hover:underline dark:text-[#A7D129]"
                        >
                            Iniciá sesión
                        </Link>
                    </p>

                </motion.div>
            </main>
        </div>
    );
};

export default Register;