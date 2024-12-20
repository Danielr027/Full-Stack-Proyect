"use client";
import { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import '@/styles/Estilos.css';
import { checkIfAdmin, decodeToken } from "@/utils/Decode";

function NavBar() {
    // Solo accedemos a localStorage en useEffect para evitar errores durante SSR
    const [token, setToken] = useState(null);

    useEffect(() => {
        const t = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        setToken(t);
    }, []);

    const isAdmin = token ? checkIfAdmin(token) : false;
    const isMerchant = token ? decodeToken(token) === "merchant" : false;

    const [state, setState] = useState(false);
    const navRef = useRef();

    // Aquí si quieres mantener el sticky y el overflow-hidden:
    // Nota: Esto puede causar problemas en SSR, revisa que te funcione correctamente.
    useEffect(() => {
        const body = document.body;
        const customBodyStyle = ["overflow-hidden", "lg:overflow-visible"];
        if (state) body.classList.add(...customBodyStyle);
        else body.classList.remove(...customBodyStyle);

        const customStyle = ["sticky-nav", "fixed", "border-b"];
        window.onscroll = () => {
            if (window.scrollY > 80) navRef.current.classList.add(...customStyle);
            else navRef.current.classList.remove(...customStyle);
        };
    }, [state]);

    const navigation = [
        { title: "Inicio", path: "/" },
        ...(isAdmin ? [{ title: "Comercios", path: "/stores" }] : []),
        ...(isMerchant ? [{ title: "Crear Web", path: "/createWebStore" }] : []),
        ...(isMerchant ? [{ title: "Usuarios Interesados", path: "/interestedUsers" }] : [])
    ];

    return (
        <nav ref={navRef} className="bg-white w-full top-0 z-20 p-5">
            <div className="items-center px-4 max-w-screen-xl mx-auto md:px-8 lg:flex">
                <div className="flex items-center justify-between py-4 lg:py-4 lg:block">
                    <div className="lg:hidden">
                        <button
                            className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
                            onClick={() => setState(!state)}
                        >
                            {state ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 8h16M4 16h16"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                <div
                    className={`flex-1 justify-between flex-row-reverse lg:overflow-visible lg:flex lg:pb-0 lg:pr-0 lg:h-auto ${state ? "h-screen pb-20 overflow-auto pr-4" : "hidden"
                        }`}
                >
                    <div>
                        <ul className="flex flex-col-reverse space-x-0 lg:space-x-6 lg:flex-row">
                            {token && (
                                <li className="mt-8 mb-8 lg:mt-0 lg:mb-0">
                                    <Link
                                        href="/profile"
                                        className="text-gray-600 hover:text-indigo-600"
                                    >
                                        Perfil
                                    </Link>
                                </li>
                            )}
                            {!token ? (
                                <li className="mt-4 lg:mt-0">
                                    <Link
                                        href="/login"
                                        className="py-3 px-4 text-center border text-gray-600 hover:text-indigo-600 rounded-md block lg:inline lg:border-0"
                                    >
                                        Login
                                    </Link>
                                </li>) :
                                (
                                    <li className="mt-4 lg:mt-0">
                                        <Link
                                            href="/login"
                                            onClick={() => {
                                                if (typeof window !== 'undefined') localStorage.clear();
                                            }}
                                            className="py-3 px-4 text-center border text-red-600 hover:text-red-400 rounded-md block lg:inline lg:border-0"
                                        >
                                            Logout
                                        </Link>
                                    </li>
                                )
                            }
                            {!token && (
                                <li className="mt-8 lg:mt-0">
                                    <Link
                                        href="/register"
                                        className="py-3 px-4 text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow block lg:inline"
                                    >
                                        Sign Up
                                    </Link>
                                </li>)
                            }
                        </ul>
                    </div>
                    <div className="flex-1">
                        <ul className="justify-center items-center space-y-8 lg:flex lg:space-x-6 lg:space-y-0">
                            {navigation.map((item, idx) => (
                                <li
                                    key={idx}
                                    className="text-gray-600 hover:text-indigo-600"
                                >
                                    <Link href={item.path}>{item.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
