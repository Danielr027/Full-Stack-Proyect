"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";

export default function InterestedUsersPage() {
    const [token, setToken] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [actividad, setActividad] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        setToken(t);
    }, []);

    const fetchUsers = async (topic = '') => {
        if (!token) return; // Esperar a tener el token
        setLoading(true);
        setError('');
        try {
            const params = topic ? { topic } : {};
            const response = await axios.get('http://localhost:3002/api/store/interested-users', {
                params,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsersList(response.data);
        } catch (error) {
            console.error(error);
            setError("Ocurrió un error al obtener los usuarios. Por favor, intenta nuevamente.");
            setUsersList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token]);

    const handleChange = (event) => {
        setActividad(event.target.value);
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        if (!token) return;
        fetchUsers(actividad.trim());
    };

    return (
        <>
            <NavBar />
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <h1 className="text-2xl font-bold my-6 text-center">
                    Usuarios Interesados de mi ciudad por actividad
                </h1>

                <form
                    onSubmit={handleSearch}
                    className="max-w-md mx-auto mt-8 flex items-center space-x-2">
                    <div className="relative flex-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute top-1/2 left-3 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar por actividad"
                            value={actividad}
                            onChange={handleChange}
                            className="flex-1 py-3 pl-10 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-5 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300">
                        Buscar
                    </button>
                </form>

                {error && (
                    <p className="text-center mt-4 text-red-500">{error}</p>
                )}

                {loading ? (
                    <p className="text-center mt-8 text-gray-500">Cargando usuarios...</p>
                ) : (
                    usersList.length > 0 ? (
                        <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
                            <table className="w-full table-auto text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                    <tr>
                                        <th className="py-3 px-6">ID</th>
                                        <th className="py-3 px-6">Email</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 divide-y">
                                    {usersList.map((user, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4 whitespace-nowrap">{user._id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center mt-8 text-gray-500">No se encontraron usuarios para la actividad "{actividad}".</p>
                    )
                )}
            </div>
        </>
    );
}
