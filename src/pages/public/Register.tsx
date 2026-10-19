import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { api } from "../../services/api";

const Register = () => {
    const navigate = useNavigate();

    const { register } = useAuth();

    const [message, setMessage] = useState<string | null>(
        null
    );

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const handleGoogleRegister = async (
        credential: string
    ) => {
        try {
            setMessage(null);
            setErrorMessage(null);

            const response = await api.post(
                "/auth/google/register",
                {
                    idToken: credential,
                }
            );

            register(
                response.data.user,
                response.data.token
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            setMessage(
                "¡Registro exitoso! Redirigiendo al Dashboard..."
            );

            setTimeout(() => {
                navigate("/dashboard");
            }, 1200);
        } catch (error) {
    console.error("ERROR COMPLETO:", error);

    if (axios.isAxiosError(error)) {
        console.error("STATUS:", error.response?.status);
        console.error("DATA:", error.response?.data);
    }

    setErrorMessage(
        axios.isAxiosError(error)
            ? error.response?.data?.message ??
              "Error desconocido del servidor."
            : "No se pudo completar el registro."
    );
}
    };

    return (
        <div className="relative min-h-screen bg-[#EEF7FF] text-[#4D869C] transition-colors duration-300 dark:bg-[#000000] dark:text-white">

<<<<<<< HEAD
            {/* Alertas */}
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
=======
            <AnimatePresence>
                {message && (
>>>>>>> b75b05db808b16eb0cef75707722f62462b5a79f
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
<<<<<<< HEAD
                        className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-4 text-white shadow-xl dark:bg-emerald-600"
=======
                        className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-4 text-white shadow-xl"
>>>>>>> b75b05db808b16eb0cef75707722f62462b5a79f
                    >
                        <CheckCircle2 className="h-6 w-6 shrink-0" />

                        <span className="text-sm font-semibold">
<<<<<<< HEAD
                            {successMessage}
=======
                            {message}
                        </span>
                    </motion.div>
                )}

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
>>>>>>> b75b05db808b16eb0cef75707722f62462b5a79f
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
                    className="text-2xl font-bold text-[#4D869C] dark:text-[#A7D129]"
                >
                    AtomPay
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
                            Crear una cuenta
                        </h1>

                        <p className="mt-2 text-sm opacity-70">
                            Empezá a gestionar tus gastos con AtomPay
                        </p>
                    </div>

<<<<<<< HEAD
                    {/* Google */}
=======
>>>>>>> b75b05db808b16eb0cef75707722f62462b5a79f
                    <div className="flex w-full justify-center">
                        <GoogleLogin
                            onSuccess={(response) => {
                                if (!response.credential) {
                                    setErrorMessage(
                                        "Google no devolvió las credenciales necesarias."
                                    );
<<<<<<< HEAD

                                    return;
                                }

=======
                                    return;
                                }

>>>>>>> b75b05db808b16eb0cef75707722f62462b5a79f
                                handleGoogleRegister(
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

<<<<<<< HEAD
                    {/* Login */}
=======
>>>>>>> b75b05db808b16eb0cef75707722f62462b5a79f
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