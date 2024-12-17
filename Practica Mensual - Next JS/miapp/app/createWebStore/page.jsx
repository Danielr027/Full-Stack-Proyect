"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from 'next/navigation';

export default function CreateWebStorePage() {
    const router = useRouter();
    const [webStoreData, setWebStoreData] = useState({
        city: "",
        activity: "",
        title: "",
        resume: "",
        textsArray: [""],
        imagesArray: [""],
        storeId: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [webStoreId, setWebStoreId] = useState(null);
    const [copyState, setCopyState] = useState(false);

    const handleChange = (event, field, index = null) => {
        if (index !== null) {
            const updatedArray = [...webStoreData[field]];
            updatedArray[index] = event.target.value;
            setWebStoreData((prev) => ({ ...prev, [field]: updatedArray }));
        } else {
            setWebStoreData((prev) => ({ ...prev, [field]: event.target.value }));
        }
    };

    const handleAddField = (field) => {
        setWebStoreData((prevData) => ({
            ...prevData,
            [field]: [...prevData[field], ""],
        }));
    };

    const handleRemoveField = (field, index) => {
        setWebStoreData((prevData) => ({
            ...prevData,
            [field]: prevData[field].filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

            const payload = {
                city: webStoreData.city,
                activity: webStoreData.activity,
                title: webStoreData.title,
                resume: webStoreData.resume,
                textsArray: webStoreData.textsArray.filter(t => t.trim() !== ""),
                imagesArray: webStoreData.imagesArray.filter(i => i.trim() !== ""),
                storeId: webStoreData.storeId
            };

            const response = await axios.post(
                "http://localhost:3002/api/webStore",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Asumiendo que la respuesta contiene el id de la webStore
            const createdWebStoreId = response.data.webStore?._id;
            setWebStoreId(createdWebStoreId);
            setSuccess(true);
            setWebStoreData({
                city: "",
                activity: "",
                title: "",
                resume: "",
                textsArray: [""],
                imagesArray: [""],
                storeId: "",
            });
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Hubo un error al crear la página web del comercio. Por favor, intenta nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (webStoreId) {
            navigator.clipboard.writeText(webStoreId).then(
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
            <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Crear Nueva Página Web de Comercio</h2>

                    {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6">
                            {/* City */}
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={webStoreData.city}
                                    onChange={(e) => handleChange(e, 'city')}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese la ciudad"
                                />
                            </div>

                            {/* Activity */}
                            <div>
                                <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-1">
                                    Actividad
                                </label>
                                <input
                                    type="text"
                                    id="activity"
                                    name="activity"
                                    value={webStoreData.activity}
                                    onChange={(e) => handleChange(e, 'activity')}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese la actividad"
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={webStoreData.title}
                                    onChange={(e) => handleChange(e, 'title')}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese el título de la página web"
                                />
                            </div>

                            {/* Resume */}
                            <div>
                                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                                    Resumen
                                </label>
                                <textarea
                                    id="resume"
                                    name="resume"
                                    value={webStoreData.resume}
                                    onChange={(e) => handleChange(e, 'resume')}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese un resumen de la página web"
                                    rows={3}
                                ></textarea>
                            </div>

                            {/* Texts Array */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Textos
                                </label>
                                {webStoreData.textsArray.map((text, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <input
                                            type="text"
                                            value={text}
                                            onChange={(e) => handleChange(e, 'textsArray', index)}
                                            required
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder={`Texto ${index + 1}`}
                                        />
                                        {webStoreData.textsArray.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveField('textsArray', index)}
                                                className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleAddField('textsArray')}
                                    className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Agregar Texto
                                </button>
                            </div>

                            {/* Images Array */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Imágenes (URLs)
                                </label>
                                {webStoreData.imagesArray.map((image, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <input
                                            type="url"
                                            value={image}
                                            onChange={(e) => handleChange(e, 'imagesArray', index)}
                                            required
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder={`URL de la imagen ${index + 1}`}
                                        />
                                        {webStoreData.imagesArray.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveField('imagesArray', index)}
                                                className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleAddField('imagesArray')}
                                    className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Agregar Imagen
                                </button>
                            </div>

                            {/* Store ID */}
                            <div>
                                <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-1">
                                    ID del Comercio Asociado
                                </label>
                                <input
                                    type="text"
                                    id="storeId"
                                    name="storeId"
                                    value={webStoreData.storeId}
                                    onChange={(e) => handleChange(e, 'storeId')}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese el ID del comercio asociado"
                                />
                            </div>
                        </div>

                        {/* Botón de Envío */}
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                                    loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                        Creando...
                                    </>
                                ) : (
                                    'Crear Página Web'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

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
                                <Dialog.Title className="text-lg font-medium text-gray-800 text-center mt-3">Página Web Creada Exitosamente</Dialog.Title>
                                <Dialog.Description className="mt-2 text-sm leading-relaxed text-center text-gray-500">
                                    ¡Tu página web ha sido creada exitosamente!
                                </Dialog.Description>
                                {webStoreId && (
                                    <div className="p-2 border rounded-lg flex items-center justify-between mt-4 w-full">
                                        <p className="text-sm text-gray-600 overflow-hidden break-all">{webStoreId}</p>
                                        <button
                                            className={`relative text-gray-500 ${copyState ? "text-indigo-600 pointer-events-none" : ""}`}
                                            onClick={handleCopy}
                                            aria-label="Copiar ID de la Página Web"
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
                                        onClick={() => router.push("/")}
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
