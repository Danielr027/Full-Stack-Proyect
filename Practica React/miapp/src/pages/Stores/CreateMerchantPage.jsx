// CreateMerchantPage.jsx
import { useState, useEffect } from "react";
import NavBar from "../../widgets/NavBar";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";

function CreateMerchantPage() {
    const [merchantData, setMerchantData] = useState({
        nombre: "",
        email: "",
        password: "",
        edad: "",
        ciudad: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [merchantId, setMerchantId] = useState(null);
    const [copyState, setCopyState] = useState(false);

    const handleChange = (event, field) => {
        setMerchantData({
            ...merchantData,
            [field]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = localStorage.getItem('token');

            // Preparar los datos para la solicitud
            const payload = {
                nombre: merchantData.nombre,
                email: merchantData.email,
                password: merchantData.password,
                edad: parseInt(merchantData.edad),
                ciudad: merchantData.ciudad
            };

            // Realizar la solicitud POST al backend
            const response = await axios.post(
                "http://localhost:3002/api/user/register-merchant",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Obtener el merchantId de la respuesta (ajusta según tu backend)
            const createdMerchantId = response.data.user._id; // Asegúrate de que esta ruta es correcta
            setMerchantId(createdMerchantId);

            // Manejar la respuesta exitosa
            setSuccess(true);
            setMerchantData({
                nombre: "",
                email: "",
                password: "",
                edad: "",
                ciudad: ""
            });
        } catch (err) {
            console.error(err);
            // Manejar errores específicos si están disponibles
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Hubo un error al crear el merchant. Por favor, intenta nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (merchantId) {
            navigator.clipboard.writeText(merchantId).then(
                () => {
                    setCopyState(true);
                },
                (err) => {
                    console.error("Async: Could not copy text: ", err);
                }
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
                <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Crear Nuevo Merchant</h2>

                    {/* Mensajes de Error */}
                    {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Nombre del Merchant */}
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre del Merchant
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={merchantData.nombre}
                                    onChange={(e) => handleChange(e, 'nombre')}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese el nombre del merchant"
                                />
                            </div>

                            {/* Correo Electrónico del Merchant */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={merchantData.email}
                                    onChange={(e) => handleChange(e, 'email')}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese el correo electrónico"
                                />
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={merchantData.password}
                                    onChange={(e) => handleChange(e, 'password')}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese la contraseña"
                                />
                            </div>

                            {/* Edad */}
                            <div>
                                <label htmlFor="edad" className="block text-sm font-medium text-gray-700 mb-1">
                                    Edad
                                </label>
                                <input
                                    type="number"
                                    id="edad"
                                    name="edad"
                                    value={merchantData.edad}
                                    onChange={(e) => handleChange(e, 'edad')}
                                    required
                                    min="18"
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese la edad"
                                />
                            </div>

                            {/* Ciudad */}
                            <div className="sm:col-span-2">
                                <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    id="ciudad"
                                    name="ciudad"
                                    value={merchantData.ciudad}
                                    onChange={(e) => handleChange(e, 'ciudad')}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ingrese la ciudad"
                                />
                            </div>
                        </div>

                        {/* Botón de Envío */}
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                                    loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300`}
                            >
                                {loading ? 'Creando...' : 'Crear Merchant'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Popup de Éxito con Radix UI Dialog */}
            <Dialog.Root open={success} onOpenChange={(open) => { if (!open) setSuccess(false); }}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
                    <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4">
                        <div className="bg-white rounded-md shadow-lg px-4 py-6">
                            <div className="flex items-center justify-between">
                                <Dialog.Title className="text-lg font-medium text-gray-800 ">
                                    Merchant Creado Exitosamente
                                </Dialog.Title>
                                <Dialog.Close className="p-2 text-gray-400 rounded-md hover:bg-gray-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 mx-auto"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Dialog.Close>
                            </div>
                            <Dialog.Description className="mt-3 text-sm leading-relaxed text-left text-gray-500">
                                Tu Merchant ha sido creado exitosamente. A continuación, se muestra su ID (vas a necesitarlo para poder crear un comercio asociado):
                            </Dialog.Description>
                            <div className="p-2 border rounded-lg flex items-center justify-between mt-4">
                                <p className="text-sm text-gray-600 overflow-hidden">{merchantId}</p>
                                <button
                                    className={`relative text-gray-500 ${
                                        copyState ? "text-indigo-600 pointer-events-none" : ""
                                    }`}
                                    onClick={handleCopy}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 pointer-events-none"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    {copyState ? (
                                        <div className="absolute -top-12 -left-3 px-2 py-1.5 rounded-xl bg-indigo-600 font-semibold text-white text-[10px] after:absolute after:inset-x-0 after:mx-auto after:top-[22px] after:w-2 after:h-2 after:bg-indigo-600 after:rotate-45">
                                            Copiado
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </button>
                            </div>
                            <Dialog.Close asChild>
                                <button className="text-sm mt-3 py-2.5 px-8 flex-1 text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2">
                                    Hecho
                                </button>
                            </Dialog.Close>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}

export default CreateMerchantPage;
