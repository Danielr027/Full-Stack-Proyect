// WebStoreDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/solid"; 
import "./../../styles/Estilos.css";

function WebStoreDetailsPage() {
    const { webStoreId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    console.log("Recibido - webStoreId:", webStoreId);

    const [webStore, setWebStore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Estados para la edición de detalles
    const [isEditing, setIsEditing] = useState(false);
    const [modifiedDetails, setModifiedDetails] = useState({
        title: '',
        city: '',
        activity: '',
        resume: ''
    });
    const [modifyLoading, setModifyLoading] = useState(false);
    const [modifyError, setModifyError] = useState(null);

    // Estados para añadir reseña
    const [score, setScore] = useState('');
    const [valoracion, setValoracion] = useState('');

    // Estados para la subida de imágenes
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    // Estados para añadir texto
    const [newText, setNewText] = useState('');
    const [addTextLoading, setAddTextLoading] = useState(false);
    const [addTextError, setAddTextError] = useState(null);

    // Estados para el popup de eliminación
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        if (!webStoreId) return; // Salir si no hay webStoreId proporcionado

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
            // Reiniciamos los detalles editables con los datos actuales de la webStore
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

        // Validaciones básicas
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
            console.log("Respuesta Modificación:", response.data);
            setWebStore(response.data); // Actualizar los detalles con los nuevos datos
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

        // Validaciones básicas
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
            console.log("Respuesta:", response.data);
            setWebStore(response.data); // Actualizar los detalles con la nueva review
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
            console.log("Respuesta Subida de Imagen:", response.data);
            setWebStore(response.data); // Actualizar los detalles con la nueva imagen
            setSuccessMessage("Imagen subida exitosamente.");
            setSelectedImage(null); // Resetear el input
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
            console.log("Respuesta Añadir Texto:", response.data);
            setWebStore(response.data); // Actualizar los detalles con el nuevo texto
            setSuccessMessage("Texto añadido exitosamente.");
            setNewText(''); // Resetear el input
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
            navigate("/");
        } catch (error) {
            console.error("Este es el error: ", error.response?.data?.error);
            console.log("Este es el id:", webStoreId);
            if (error.response?.data?.error === "STORE_NOT_FOUND_OR_UNAUTHORIZED") {
                setDeleteError("No tienes permiso para eliminar esta web. Sólo el dueño puede borrarla.");
            } else {
                setDeleteError("Hubo un error al eliminar la página web. Por favor, intenta nuevamente.");
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    if (!webStoreId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <h2 className="text-xl font-semibold text-gray-700">Ninguna página seleccionada</h2>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <h2 className="text-xl font-semibold text-gray-700">Cargando detalles...</h2>
            </div>
        );
    }

    if (!webStore) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <h2 className="text-xl font-semibold text-gray-700">No se encontraron detalles para esta página web.</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{webStore.title}</h2>
                    {/* Botón para eliminar la página web */}
                    <Dialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        <Dialog.Trigger asChild>
                            <button className="flex items-center text-red-600 hover:text-red-800 focus:outline-none">
                                <TrashIcon className="h-6 w-6 mr-1" />
                                Eliminar Página Web
                            </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                            <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-lg font-semibold text-gray-800">Confirmar Eliminación</Dialog.Title>
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
                                        className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none flex items-center ${
                                            deleteLoading ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
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

                {/* Mensajes de éxito y error generales */}
                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                {modifyError && <div className="mb-4 text-red-500 text-center">{modifyError}</div>}
                {uploadError && <div className="mb-4 text-red-500 text-center">{uploadError}</div>}
                {addTextError && <div className="mb-4 text-red-500 text-center">{addTextError}</div>}
                {successMessage && <div className="mb-4 text-green-500 text-center">{successMessage}</div>}

                {/* Datos de la webStore */}
                <div className="space-y-4">
                    <p><strong>Ciudad:</strong> {isEditing ? (
                        <input
                            type="text"
                            name="city"
                            value={modifiedDetails.city}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    ) : (
                        webStore.city
                    )}</p>
                    <p><strong>Actividad:</strong> {isEditing ? (
                        <input
                            type="text"
                            name="activity"
                            value={modifiedDetails.activity}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    ) : (
                        webStore.activity
                    )}</p>
                    <p><strong>Descripción:</strong> {isEditing ? (
                        <textarea
                            name="resume"
                            value={modifiedDetails.resume}
                            onChange={handleInputChange}
                            rows="4"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                    ) : (
                        webStore.resume
                    )}</p>
                    <p><strong>Puntuación:</strong> {webStore.reviews ? webStore.reviews.scoring : 'N/A'}</p>
                    <p><strong>Total de Calificaciones:</strong> {webStore.reviews ? webStore.reviews.totalRatings : 'N/A'}</p>

                    {/* Reseñas */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Reseñas:</h3>
                        {webStore.reviews && webStore.reviews.reviews.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                                {webStore.reviews.reviews.map((review, index) => (
                                    <li key={index} className="text-gray-600">{review}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No hay reseñas aún.</p>
                        )}
                    </div>

                    {/* Textos (textsArray) */}
                    {webStore.textsArray && webStore.textsArray.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Textos:</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {webStore.textsArray.map((textItem, index) => (
                                    <li key={index} className="text-gray-600">{textItem}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Imágenes */}
                    {webStore.imagesArray && webStore.imagesArray.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Imágenes:</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {webStore.imagesArray.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Imagen ${index + 1} de ${webStore.title}`}
                                        className="w-full h-48 object-cover rounded-md shadow-sm"
                                        onError={(e) => { 
                                            e.target.onerror = null; 
                                            e.target.src = 'https://via.placeholder.com/200?text=Imagen+no+disponible'; 
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Botones para Editar/Guardar/Cancelar */}
                <div className="flex justify-end mt-6 space-x-4">
                    {!isEditing && (
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            onClick={handleEditToggle}
                        >
                            Editar Detalles
                        </button>
                    )}
                    {isEditing && (
                        <>
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                                onClick={handleEditToggle}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                                onClick={handleSaveChanges}
                                disabled={modifyLoading}
                            >
                                {modifyLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                        Guardando...
                                    </>
                                ) : (
                                    'Guardar Cambios'
                                )}
                            </button>
                        </>
                    )}
                </div>

                {/* Formulario para añadir una nueva reseña (ahora sólo visible si no estamos en modo edición) */}
                {!isEditing && token && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Añadir una Reseña:</h3>
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
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ej. Excelente servicio"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                        Añadiendo...
                                    </>
                                ) : (
                                    'Añadir Reseña'
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Estas opciones ahora solo aparecen si se está en modo edición */}
                {isEditing && (
                    <>
                        {/* Formulario para subir imágenes */}
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Subir Imagen a la Página Web:</h3>
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
                                        className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                                >
                                    {uploadLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                            </svg>
                                            Subiendo...
                                        </>
                                    ) : (
                                        'Subir Imagen'
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Formulario para añadir texto */}
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Añadir Texto a la Página Web:</h3>
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
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Escribe el nuevo texto para la página web."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                >
                                    {addTextLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                            </svg>
                                            Añadiendo...
                                        </>
                                    ) : (
                                        'Añadir Texto'
                                    )}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>

            {/* Popup de Éxito */}
            <Dialog.Root open={!!successMessage} onOpenChange={() => setSuccessMessage(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                    <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
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
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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

export default WebStoreDetailsPage;
