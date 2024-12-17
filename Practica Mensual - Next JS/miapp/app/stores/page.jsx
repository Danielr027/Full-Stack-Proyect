"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/styles/Estilos.css';

export default function StoresPage() {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        setToken(t);
    }, []);

    useEffect(() => {
        if (token) {
            axios.get("http://localhost:3002/api/store", { headers: { Authorization: `Bearer ${token}` } })
                .then(response => setStores(response.data))
                .catch(error => console.error("Ha habido un error:", error));
        }
    }, [token]);

    const handleStoreClick = (comercio) => {
        // En Next.js pasaremos CIF en la URL y recuperaremos la información en storeDetails/[CIF]
        // Debes ajustar el backend para que la ruta /api/store/:CIF retorne info de la store.
        router.push(`/storeDetails/${comercio.CIF}`);
    }

    return (
        <div>
            <NavBar />
            <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
                <div className="flex justify-end mb-6 space-x-4">
                    <Link href="/createStore" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300">
                        Crear Comercio
                    </Link>
                    <Link href="/createMerchant" style={{color: "green"}} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300">
                        Crear Merchant
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {stores.length > 0 ? (
                        stores.map(comercio => (
                            <div
                                key={comercio._id}
                                className="tienda-card shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition duration-300"
                                onClick={() => handleStoreClick(comercio)}
                            >
                                <h2 className="tienda-title text-xl font-semibold mb-2">{comercio.storeName}</h2>
                                <p className="tienda-info"><strong>CIF:</strong> {comercio.CIF}</p>
                                <p className="tienda-info"><strong>Email:</strong> {comercio.email}</p>
                                <p className="tienda-info"><strong>Dirección:</strong> {comercio.address}</p>
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron comercios.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
