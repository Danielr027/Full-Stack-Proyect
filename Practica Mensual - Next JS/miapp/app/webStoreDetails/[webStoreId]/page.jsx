"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/solid";
import "@/styles/Estilos.css";

export default function WebStoreDetailsPage() {
    const router = useRouter();
    const [webStoreId, setWebStoreId] = useState(null);
    const [token, setToken] = useState(null);

    const [webStore, setWebStore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [modifiedDetails, setModifiedDetails] = useState({
        title: '',
        city: '',
        activity: '',
        resume: ''
    });
    const [modifyLoading, setModifyLoading] = useState(false);
    const [modifyError, setModifyError] = useState(null);

    const [score, setScore] = useState('');
    const [valoracion, setValoracion] = useState('');

    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const [newText, setNewText] = useState('');
    const [addTextLoading, setAddTextLoading] = useState(false);
    const [addTextError, setAddTextError] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pathParts = window.location.pathname.split('/');
            const id = pathParts[pathParts.length - 1];
            setWebStoreId(id);
        }
    }, []);

    useEffect(() => {
        const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        setToken(t);
    }, []);

    useEffect(() => {
        if (!webStoreId || !token) return;
        const fetchWebStore = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3002/api/webStore/${webStoreId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setWebStore(response.data);
                setModifiedDetails({
                    title: response.data.title || '',
                    city: response.data.city || '',
                    activity: response.data.activity || '',
                    resume: response.data.resume || ''
                });
            } catch (err) {
                console.error('Error fetching data:', err);
                setError("Hubo un error al obtener los detalles de la página web.");
            } finally {
                setLoading(false);
            }
        };
        fetchWebStore();
    }, [webStoreId, token]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setModifyError(null);
        setSuccessMessage(null);
        if (!isEditing && webStore) {
            setModifiedDetails({
                title: webStore.title || '',
                city: webStore.city || '',
                activity: webStore.activity || '',
                resume: webStore.resume || ''
            });
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setModifiedDetails({
            ...modifiedDetails,
            [name]: value
        });
    };

    const handleSaveChanges = async (event) => {
        event.preventDefault();
        setModifyLoading(true);
        setModifyError(null);
        setSuccessMessage(null);

        if (!modifiedDetails.title.trim() || !modifiedDetails.city.trim()) {
            setModifyError("El título y la ciudad no pueden estar vacíos.");
            setModifyLoading(false);
            return;
        }

        const body = {
            "title": modifiedDetails.title,
            "city": modifiedDetails.city,
            "activity": modifiedDetails.activity,
            "resume": modifiedDetails.resume
        };

        try {
            const response = await axios.put(`http://localhost:3002/api/webStore/${webStoreId}`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setWebStore(response.data);
            setSuccessMessage("Detalles de la página web modificados exitosamente.");
            setIsEditing(false);
        } catch (error) {
            console.error("Error al modificar la página web:", error);
            setModifyError("Hubo un error al modificar los detalles. Por favor, intenta nuevamente.");
        } finally {
            setModifyLoading(false);
        }
    };

    const handleAddReview = async (event) => {
        event.preventDefault();

        if (score < 0 || score > 5) {
            setError("La puntuación debe estar entre 0 y 5.");
            return;
        }
        if (!valoracion.trim()) {
            setError("La valoración no puede estar vacía.");
            return;
        }

        const body = {
            "scoring": parseFloat(score),
            "review": valoracion
        };

        try {
            const response = await axios.patch(`http://localhost:3002/api/webStore/${webStoreId}/review`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setWebStore(response.data);
            setScore('');
            setValoracion('');
            setSuccessMessage("Reseña añadida exitosamente.");
            setError(null);
        } catch (error) {
            console.error(error);
            setError("Hubo un error al añadir la reseña. Por favor, intenta nuevamente.");
        }
    };

    const handleUploadImage = async (event) => {
        event.preventDefault();

        if (!selectedImage) {
            setUploadError("Por favor, selecciona una imagen para subir.");
            return;
        }

        setUploadLoading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append("image", selectedImage);

        try {
            const response = await axios.patch(`http://localhost:3002/api/webStore/${webStoreId}/uploadImage`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setWebStore(response.data);
            setSuccessMessage("Imagen subida exitosamente.");
            setSelectedImage(null);
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            setUploadError("Hubo un error al subir la imagen. Por favor, intenta nuevamente.");
        } finally {
            setUploadLoading(false);
        }
    };

    const handleAddText = async (event) => {
        event.preventDefault();

        if (!newText.trim()) {
            setAddTextError("El texto no puede estar vacío.");
            return;
        }

        setAddTextLoading(true);
        setAddTextError(null);

        const body = {
            "text": newText
        };

        try {
            const response = await axios.post(`http://localhost:3002/api/webStore/${webStoreId}/addText`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setWebStore(response.data);
            setSuccessMessage("Texto añadido exitosamente.");
            setNewText('');
        } catch (error) {
            console.error("Error al añadir el texto:", error);
            setAddTextError("Hubo un error al añadir el texto. Por favor, intenta nuevamente.");
        } finally {
            setAddTextLoading(false);
        }
    };

    const handleDeleteWebStore = async () => {
        if (!webStoreId) {
            setDeleteError("webStoreId no está disponible. No se puede eliminar la tienda.");
            return;
        }

        setDeleteLoading(true);
        setDeleteError(null);
        try {
            await axios.delete(`http://localhost:3002/api/webStore/${webStoreId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsDeleteOpen(false);
            router.push("/home");
        } catch (error) {
            console.error("Este es el error: ", error.response?.data?.error);
            if (error.response?.data?.error === "STORE_NOT_FOUND_OR_UNAUTHORIZED") {
                setDeleteError("No tienes permiso para eliminar esta web. Sólo el dueño puede borrarla.");
            } else {
                setDeleteError("Hubo un error al eliminar la página web. Por favor, intenta nuevamente.");
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-700 animate-pulse">Cargando detalles...</h2>
            </div>
        );
    }

    if (!webStore) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-700">No se encontraron detalles para esta página web.</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
                {/* Encabezado */}
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {webStore.title}
                    </h2>
                    <Dialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        <Dialog.Trigger asChild>
                            <button className="flex items-center text-red-600 hover:text-red-800 focus:outline-none transition-colors">
                                <TrashIcon className="h-6 w-6 mr-1" />
                                <span className="font-medium">Eliminar Página Web</span>
                            </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 z-40" />
                            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-lg font-semibold text-gray-800">
                                        Confirmar Eliminación
                                    </Dialog.Title>
                                    <Dialog.Close asChild>
                                        <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </Dialog.Close>
                                </div>
                                <Dialog.Description className="text-gray-600 mb-6">
                                    ¿Estás seguro de que deseas eliminar esta página web? Esta acción no se puede deshacer.
                                </Dialog.Description>
                                {deleteError && <div className="mb-4 text-red-500">{deleteError}</div>}
                                <div className="flex justify-end space-x-4">
                                    <Dialog.Close asChild>
                                        <button
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                                        >
                                            Cancelar
                                        </button>
                                    </Dialog.Close>
                                    <button
                                        onClick={handleDeleteWebStore}
                                        disabled={deleteLoading}
                                        className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none flex items-center ${deleteLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                                    >
                                        {deleteLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                                </svg>
                                                Eliminando...
                                            </>
                                        ) : (
                                            "Eliminar"
                                        )}
                                    </button>
                                </div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                </div>

                {/* Mensajes de estado */}
                <div className="space-y-2 mb-6">
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    {modifyError && <div className="text-red-500 text-center">{modifyError}</div>}
                    {uploadError && <div className="text-red-500 text-center">{uploadError}</div>}
                    {addTextError && <div className="text-red-500 text-center">{addTextError}</div>}
                    {successMessage && <div className="text-green-500 text-center font-semibold">{successMessage}</div>}
                </div>

                {/* Detalles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <strong className="text-gray-700">Ciudad:</strong>{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="city"
                                    value={modifiedDetails.city}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                />
                            ) : (
                                <span className="text-gray-600">{webStore.city}</span>
                            )}
                        </div>

                        <div>
                            <strong className="text-gray-700">Actividad:</strong>{" "}
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="activity"
                                    value={modifiedDetails.activity}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                />
                            ) : (
                                <span className="text-gray-600">{webStore.activity}</span>
                            )}
                        </div>

                        <div>
                            <strong className="text-gray-700">Descripción:</strong>{" "}
                            {isEditing ? (
                                <textarea
                                    name="resume"
                                    value={modifiedDetails.resume}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                ></textarea>
                            ) : (
                                <span className="text-gray-600">{webStore.resume}</span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <strong className="text-gray-700">Puntuación:</strong>{" "}
                            <span className="text-gray-600">{webStore.reviews ? webStore.reviews.scoring : 'N/A'}</span>
                        </div>
                        <div>
                            <strong className="text-gray-700">Total Calificaciones:</strong>{" "}
                            <span className="text-gray-600">{webStore.reviews ? webStore.reviews.totalRatings : 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Reseñas:</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                            {webStore.reviews && webStore.reviews.reviews.length > 0 ? (
                                <ul className="list-disc list-inside space-y-1">
                                    {webStore.reviews.reviews.map((review, index) => (
                                        <li key={index} className="text-gray-700">{review}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No hay reseñas aún.</p>
                            )}
                        </div>
                    </div>

                    {webStore.textsArray && webStore.textsArray.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Textos:</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <ul className="list-disc list-inside space-y-1">
                                    {webStore.textsArray.map((textItem, index) => (
                                        <li key={index} className="text-gray-700">{textItem}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {webStore.imagesArray && webStore.imagesArray.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Imágenes:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {webStore.imagesArray.map((image, index) => (
                                <div key={index} className="relative overflow-hidden rounded-md shadow-sm">
                                    <img
                                        src={image}
                                        alt={`Imagen ${index + 1}`}
                                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/200?text=No+disponible';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Botones de Edición */}
                <div className="flex justify-end mt-8 space-x-4" style={{backgroundColor: "blue"}}>
                    {!isEditing && (
                        <button
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                            onClick={handleEditToggle}
                        >
                            Editar Detalles
                        </button>
                    )}
                    {isEditing && (
                        <>
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors"
                                onClick={handleEditToggle}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
                                onClick={handleSaveChanges}
                                disabled={modifyLoading}
                            >
                                {modifyLoading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </>
                    )}
                </div>

                {/* Añadir Reseña */}
                {!isEditing && token && (
                    <div className="mt-12 bg-gray-50 p-6 rounded-md shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Añadir una Reseña</h3>
                        <form onSubmit={handleAddReview} className="space-y-4">
                            <div>
                                <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
                                    Puntuación (0 - 5)
                                </label>
                                <input
                                    type="number"
                                    id="score"
                                    name="score"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="Ej. 4.5"
                                />
                            </div>
                            <div>
                                <label htmlFor="valoracion" className="block text-sm font-medium text-gray-700 mb-1">
                                    Valoración
                                </label>
                                <input
                                    type="text"
                                    id="valoracion"
                                    name="valoracion"
                                    value={valoracion}
                                    onChange={(e) => setValoracion(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="Ej. Excelente servicio"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Añadir Reseña
                            </button>
                        </form>
                    </div>
                )}

                {/* Opciones extra en modo edición */}
                {isEditing && (
                    <>
                        <div className="mt-12 bg-gray-50 p-6 rounded-md shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Subir Imagen a la Página Web</h3>
                            <form onSubmit={handleUploadImage} className="space-y-4" encType="multipart/form-data">
                                <div>
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                        Seleccionar Imagen
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={(e) => setSelectedImage(e.target.files[0])}
                                        required
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
                                >
                                    {uploadLoading ? 'Subiendo...' : 'Subir Imagen'}
                                </button>
                            </form>
                        </div>

                        <div className="mt-12 bg-gray-50 p-6 rounded-md shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Añadir Texto a la Página Web</h3>
                            <form onSubmit={handleAddText} className="space-y-4">
                                <div>
                                    <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                                        Texto
                                    </label>
                                    <textarea
                                        id="text"
                                        name="text"
                                        value={newText}
                                        onChange={(e) => setNewText(e.target.value)}
                                        required
                                        rows="4"
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                        placeholder="Escribe el nuevo texto para la página web."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors"
                                >
                                    {addTextLoading ? 'Añadiendo...' : 'Añadir Texto'}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>

            {/* Diálogo de Éxito */}
            <Dialog.Root open={!!successMessage} onOpenChange={() => setSuccessMessage(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <Dialog.Title className="text-lg font-semibold text-green-600">¡Éxito!</Dialog.Title>
                            <Dialog.Close asChild>
                                <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </Dialog.Close>
                        </div>
                        <Dialog.Description className="text-gray-700 mb-6">
                            {successMessage}
                        </Dialog.Description>
                        <div className="flex justify-end">
                            <Dialog.Close asChild>
                                <button
                                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                                >
                                    Entendido
                                </button>
                            </Dialog.Close>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}
