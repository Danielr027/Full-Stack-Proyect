"use client";
import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";
import "@/styles/RegisterPage.css";

export default function RegisterPage() {

    const handleRegister = (resultado) => {
        console.log(resultado);
    }

    return (
        <div className="register-container">
            <div className="register-box">
                <h1>REGISTRARSE</h1>
                <RegisterForm enviaData={handleRegister} />
                <Link href="/login">Iniciar Sesión</Link>
            </div>
        </div>
    );
}
