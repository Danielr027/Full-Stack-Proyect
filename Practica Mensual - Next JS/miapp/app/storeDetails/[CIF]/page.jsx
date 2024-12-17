"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import * as Dialog from "@radix-ui/react-dialog";
import '@/styles/StoreDetailsPage.css';

export default function StoreDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const CIF = params.CIF;

    const [token, setToken] = useState(null);
    const [storeData, setStoreData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        setToken(t);
    }, []);

    useEffect(() => {
        if (token && CIF) {
            // Fetch store data by CIF
            axios.get(`http://localhost:3002/api/store/getByCIF/${CIF}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setStoreData(response.data);
            })
            .catch(error => {
                console.error("Error fetching store:", error);
            });
        }
    }, [token, CIF]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (event, field) => {
        setStoreData((prev) => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSaveChanges = async (event) => {
        event.preventDefault();
        const body = {
            storeName: storeData.storeName,
            address: storeData.address,
            email: storeData.email,
            contactNumber: storeData.contactNumber,
            merchantId: storeData.merchantId
        };

        try {
            await axios.put(`http://localhost:3002/api/store/${storeData.CIF}`, body, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditing(false);
            router.push("/stores");
        } catch (error) {
            console.log("Hubo el siguiente error:", error);
        }
    };

    const deleteStore = async () => {
        try {
            await axios.delete(`http://localhost:3002/api/store/${storeData.CIF}?deleteType=logical`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            router.push("/stores");
        } catch (error) {
            console.log("Hubo el siguiente error:", error);
        }
    };

    const confirmDelete = () => {
        deleteStore();
        setIsConfirmOpen(false);
    };

    if (!storeData) {
        return <h1>Cargando información de la tienda...</h1>;
    }

    return (
        <div className="store-details-container">
            <h1 className="store-header">Detalles de la Tienda</h1>
            <div className="store-card">
                <div className="store-info">
                    <h2><strong>Store Name:</strong> {isEditing ? <input type="text" value={storeData.storeName} onChange={(e) => handleInputChange(e, 'storeName')} /> : storeData.storeName}</h2>
                    <p><strong>Store ID:</strong> {storeData._id}</p>
                    <p><strong>CIF:</strong> {storeData.CIF}</p>
                    <p><strong>Email:</strong> {isEditing ? <input type="text" value={storeData.email} onChange={(e) => handleInputChange(e, 'email')} /> : storeData.email}</p>
                    <p><strong>Número de contacto:</strong> {isEditing ? <input type="text" value={storeData.contactNumber} onChange={(e) => handleInputChange(e, 'contactNumber')} /> : storeData.contactNumber}</p>
                    <p><strong>Dirección:</strong> {isEditing ? <input type="text" value={storeData.address} onChange={(e) => handleInputChange(e, 'address')} /> : storeData.address}</p>
                    <p><strong>ID del Merchant Asociado:</strong> {storeData.merchantId}</p>
                </div>
                <div className="store-actions">
                    <button className="delete-button" onClick={() => setIsConfirmOpen(true)}>Eliminar Comercio</button>
                    <button className="edit-button" onClick={handleEditToggle}>{isEditing ? "Cancelar" : "Editar Datos"}</button>
                    {isEditing && (
                        <button className="save-button" onClick={handleSaveChanges}>Guardar Cambios</button>
                    )}
                </div>
            </div>

            <Dialog.Root open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
                    <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-4 w-full max-w-lg">
                        <div className="bg-white rounded-md shadow-lg px-4 py-6 sm:flex">
                            <div className="flex items-center justify-center flex-none w-12 h-12 mx-auto bg-red-100 rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 text-red-600"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="mt-2 text-center sm:ml-4 sm:text-left">
                                <Dialog.Title className="text-lg font-medium text-gray-800">Confirmar Eliminación</Dialog.Title>
                                <Dialog.Description className="mt-2 text-sm leading-relaxed text-gray-500">
                                    ¿Estás seguro de que deseas eliminar este comercio? Esta acción no se puede deshacer.
                                </Dialog.Description>
                                <div className="items-center gap-2 mt-3 text-sm sm:flex justify-end">
                                    <Dialog.Close asChild>
                                        <button
                                            className="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md"
                                            onClick={confirmDelete}
                                        >
                                            Eliminar
                                        </button>
                                    </Dialog.Close>
                                    <Dialog.Close asChild>
                                        <button
                                            aria-label="Close"
                                            className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md border"
                                        >
                                            Cancelar
                                        </button>
                                    </Dialog.Close>
                                </div>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}
