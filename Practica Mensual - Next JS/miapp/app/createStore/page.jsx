"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from 'next/navigation';

export default function CreateStorePage() {
    const router = useRouter();
    const [storeData, setStoreData] = useState({
        storeName: "",
        CIF: "",
        address: "",
        email: "",
        contactNumber: "",
        merchantId: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [storeId, setStoreId] = useState(null);
    const [copyState, setCopyState] = useState(false);

    const handleChange = (event, field) => {
        setStoreData({...storeData, [field]: event.target.value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const payload = { ...storeData };

            const response = await axios.post(
                "http://localhost:3002/api/store",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const createdStoreId = response.data.store._id;
            setStoreId(createdStoreId);
            setSuccess(true);
            setStoreData({
                storeName: "",
                CIF: "",
                address: "",
                email: "",
                contactNumber: "",
                merchantId: ""
            });
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Hubo un error al crear el comercio. Por favor, intenta nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (storeId) {
            navigator.clipboard.writeText(storeId).then(
                () => setCopyState(true),
                (err) => console.error("Async: Could not copy text: ", err)
            );
        }
    };

    useEffect(() => {
        if (copyState) {
            const timer = setTimeout(() => setCopyState(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [copyState]);

    return (
        <div>
            <NavBar />
            {/* Código del formulario, similar a lo que tenías, adaptando Link a next/link y useNavigate a useRouter */}
            {/* ... */}
            <Dialog.Root open={success} onOpenChange={(open) => { if (!open) setSuccess(false); }}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
                    <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-4 w-full max-w-lg mx-auto">
                        <div className="bg-white rounded-md shadow-lg px-4 py-6">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6 text-green-600"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414L10 12.414l-6.707-6.707a1 1 0 011.414-1.414L10 9.586l5.293-5.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <Dialog.Title className="text-lg font-medium text-gray-800 text-center mt-3">
                                    Comercio Creado Exitosamente
                                </Dialog.Title>
                                <Dialog.Description className="mt-2 text-sm leading-relaxed text-center text-gray-500">
                                    Tu comercio ha sido creado exitosamente.
                                </Dialog.Description>
                                {storeId && (
                                    <div className="p-2 border rounded-lg flex items-center justify-between mt-4 w-full">
                                        <p className="text-sm text-gray-600 overflow-hidden break-all">{storeId}</p>
                                        <button
                                            className={`relative text-gray-500 ${copyState ? "text-indigo-600 pointer-events-none" : ""}`}
                                            onClick={handleCopy}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            {copyState && (
                                                <div className="absolute -top-12 -left-3 px-2 py-1.5 rounded-xl bg-indigo-600 font-semibold text-white text-[10px]">
                                                    Copiado
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Dialog.Close asChild>
                                    <button 
                                        className="py-2 px-6 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                        onClick={() => router.push("/stores")}
                                    >
                                        Continuar
                                    </button>
                                </Dialog.Close>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}