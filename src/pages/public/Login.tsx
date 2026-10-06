import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
    AlertCircle,
    CheckCircle2,
    ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

const Login = () => {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const [successMessage, setSuccessMessage] =
        useState<string | null>(null);

    const handleGoogleLogin = async (
        credential: string
    ) => {
        try {
            setErrorMessage(null);

            const response = await api.post(
                "/auth/google",
                {
                    idToken: credential,
                }
            );

            login(
                response.data.user,
                response.data.token
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            setSuccessMessage(
                "¡Inicio de sesión exitoso! Redirigiendo..."
            );

            setTimeout(() => {
                navigate("/dashboard");
            }, 800);
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 404
            ) {
                setErrorMessage(
                    "No existe una cuenta AtomPay asociada a esta cuenta de Google. Registrate primero."
                );

                return;
            }

            console.error(
                "Error durante el login:",
                error
            );

            setErrorMessage(
                "No se pudo iniciar sesión. Intentá nuevamente."
            );
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#EEF7FF] text-[#4D869C] transition-colors duration-300 dark:bg-[#000000] dark:text-white">

            {/* Decoración de fondo */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#CDE8E5]/70 blur-3xl dark:bg-[#3E432E]/40"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#7AB2B2]/30 blur-3xl dark:bg-[#616F39]/30"
                />
            </div>

            {/* Notificaciones */}
            <AnimatePresence>
                {errorMessage && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: -25,
                            x: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            x: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -25,
                            x: 20,
                        }}
                        transition={{
                            duration: 0.3,
                        }}
                        className="fixed right-5 top-5 z-50 flex w-[calc(100%-40px)] max-w-md items-center gap-4 rounded-2xl border border-red-200 bg-white/95 p-4 text-red-600 shadow-2xl backdrop-blur-md dark:border-red-900/50 dark:bg-[#171717]/95 dark:text-red-400"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/60">
                            <AlertCircle className="h-5 w-5" />
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-bold">
                                No se pudo iniciar sesión
                            </p>

                            <p className="mt-0.5 text-xs leading-relaxed opacity-80">
                                {errorMessage}
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                setErrorMessage(null)
                            }
                            className="text-lg opacity-50 transition-opacity hover:opacity-100"
                            aria-label="Cerrar"
                        >
                            ×
                        </button>
                    </motion.div>
                )}

                {successMessage && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: -25,
                            x: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            x: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -25,
                            x: 20,
                        }}
                        transition={{
                            duration: 0.3,
                        }}
                        className="fixed right-5 top-5 z-50 flex w-[calc(100%-40px)] max-w-md items-center gap-4 rounded-2xl border border-emerald-200 bg-white/95 p-4 text-emerald-600 shadow-2xl backdrop-blur-md dark:border-emerald-900/50 dark:bg-[#171717]/95 dark:text-emerald-400"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm font-bold">
                                ¡Bienvenido a AtomPay!
                            </p>

                            <p className="mt-0.5 text-xs opacity-80">
                                {successMessage}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navbar */}
            <motion.nav
                initial={{
                    opacity: 0,
                    y: -20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.5,
                }}
                className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12"
            >
                <Link
                    to="/"
                    className="text-2xl font-bold tracking-tight text-[#4D869C] transition-transform hover:scale-105 dark:text-[#A7D129]"
                >
                    AtomPay
                </Link>

                <Link
                    to="/register"
                    className="text-sm font-medium text-[#4D869C] transition-colors hover:text-[#7AB2B2] dark:text-[#A7D129] dark:hover:text-white"
                >
                    Crear cuenta
                </Link>
            </motion.nav>

            {/* Login */}
            <main className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-10">

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 35,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                        ease: "easeOut",
                    }}
                    className="w-full max-w-md"
                >
                    <div className="overflow-hidden rounded-[2rem] border border-[#CDE8E5] bg-white/90 p-8 shadow-[0_25px_70px_rgba(77,134,156,0.15)] backdrop-blur-xl dark:border-[#616F39] dark:bg-[#111111]/95 dark:shadow-black/40 md:p-10">

                        {/* Icono */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.8,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            transition={{
                                delay: 0.2,
                                duration: 0.4,
                            }}
                            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#CDE8E5] text-[#4D869C] shadow-sm dark:bg-[#3E432E] dark:text-[#A7D129]"
                        >
                            <ShieldCheck className="h-8 w-8" />
                        </motion.div>

                        {/* Título */}
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold tracking-tight text-[#4D869C] dark:text-white">
                                Bienvenido de nuevo
                            </h1>

                            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#4D869C]/70 dark:text-white/60">
                                Iniciá sesión para continuar gestionando tus gastos con AtomPay.
                            </p>
                        </div>

                        {/* Google */}
                        <div className="flex w-full justify-center">
                            <GoogleLogin
                                onSuccess={(response) => {
                                    if (!response.credential) {
                                        setErrorMessage(
                                            "Google no devolvió las credenciales necesarias."
                                        );
                                        return;
                                    }

                                    handleGoogleLogin(
                                        response.credential
                                    );
                                }}
                                onError={() => {
                                    setErrorMessage(
                                        "No se pudo autenticar con Google."
                                    );
                                }}
                                useOneTap={false}
                            />
                        </div>

                        {/* Separador */}
                        <div className="my-8 flex items-center gap-4">
                            <div className="h-px flex-1 bg-[#CDE8E5] dark:bg-[#3E432E]" />

                            <span className="text-xs font-medium text-[#4D869C]/50 dark:text-white/40">
                                Acceso seguro
                            </span>

                            <div className="h-px flex-1 bg-[#CDE8E5] dark:bg-[#3E432E]" />
                        </div>

                        {/* Registro */}
                        <p className="text-center text-sm text-[#4D869C]/70 dark:text-white/60">
                            ¿Todavía no tenés una cuenta?{" "}

                            <Link
                                to="/register"
                                className="font-bold text-[#4D869C] transition-colors hover:text-[#7AB2B2] hover:underline dark:text-[#A7D129] dark:hover:text-white"
                            >
                                Registrate
                            </Link>
                        </p>
                    </div>

                    {/* Texto inferior */}
                    <p className="mt-6 text-center text-xs text-[#4D869C]/50 dark:text-white/30">
                        Tus datos están protegidos y almacenados de forma segura.
                    </p>
                </motion.div>
            </main>
        </div>
    );
};

export default Login;