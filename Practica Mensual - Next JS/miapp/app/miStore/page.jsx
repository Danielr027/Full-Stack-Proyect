"use client";
import Link from 'next/link';
import NavBar from "@/components/NavBar";

export default function MiStorePage() {
    return (
        <>
            <NavBar />
            <div className="flex justify-end mb-6 space-x-4">
                <Link 
                    href="/createWebStore" 
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 m-5"
                >
                    Crear Web
                </Link>
            </div>
            <h1>Mi Store Page</h1>
        </>
    );
}
