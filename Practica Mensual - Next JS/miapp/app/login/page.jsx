"use client";
import LoginForm from "@/components/LoginForm";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import "@/styles/LoginPage.css";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = (autenticado) => {
        if (autenticado) {
            router.push('/');
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>INICIAR SESIÓN</h1>
                <LoginForm enviaData={handleLogin} />
                <Link href="/register">Registrarse</Link>
            </div>
        </div>
    );
}
