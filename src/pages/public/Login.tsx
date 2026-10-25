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
        <div className="min-h-screen bg-[#EEF7FF] text-[#4D869C] transition-colors duration-300 dark:bg-[#000000] dark:text-white">

            <AnimatePresence>
                {errorMessage && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: -20,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: -20,
                        }}
                        className="fixed right-6 top-6 z-50 flex max-w-sm items-center gap-3 rounded-2xl bg-red-500 px-5 py-4 text-white shadow-xl"
                    >
                        <AlertCircle className="h-6 w-6 shrink-0" />

                        <span className="text-sm font-semibold">
                            {errorMessage}
                        </span>
                    </motion.div>
                )}

                {successMessage && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: -20,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: -20,
                        }}
                        className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-4 text-white shadow-xl"
                    >
                        <CheckCircle2 className="h-6 w-6 shrink-0" />

                        <span className="text-sm font-semibold">
                            {successMessage}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.nav
                initial={{
                    y: -30,
                    opacity: 0,
                }}
                animate={{
                    y: 0,
                    opacity: 1,
                }}
                transition={{
                    duration: 0.5,
                }}
                className="flex items-center justify-between px-6 py-5 md:px-12"
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

            <main className="flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-10">

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                    className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-[#3E432E]"
                >

                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold">
                            Bienvenido de nuevo
                        </h1>

                        <p className="mt-2 text-sm opacity-70">
                            Ingresá a tu cuenta para continuar
                        </p>
                    </div>

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

                    <p className="mt-8 text-center text-sm opacity-70">
                        ¿No tenés una cuenta?{" "}

                        <Link
                            to="/register"
                            className="font-semibold text-[#4D869C] hover:underline dark:text-[#A7D129]"
                        >
                            Registrate
                        </Link>
                    </p>
                </motion.div>
            </main>
        </div>
    );
};

export default Login;