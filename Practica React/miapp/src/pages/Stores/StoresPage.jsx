// StoresPage.jsx
import NavBar from "../../widgets/NavBar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../styles/Estilos.css';

function StoresPage() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [stores, setStores] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3002/api/store", { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setStores(response.data))
            .catch(error => console.error("Ha habido un error:", error))
    }, [token]);

    return (
        <div>
            <NavBar />
            <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
                {/* Botones "Crear Comercio" y "Crear Merchant" alineados a la derecha */}
                <div className="flex justify-end mb-6 space-x-4">
                    <Link 
                        to="/createStore" 
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                    >
                        Crear Comercio
                    </Link>
                    <Link 
                        to="/createMerchant" 
                        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300"
                    >
                        Crear Merchant
                    </Link>
                </div>

                {/* Contenedor de tarjetas de tiendas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {
                        stores.length > 0 ? (
                            stores.map(comercio => (
                                <div
                                    key={comercio._id}
                                    className="tienda-card shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition duration-300"
                                    onClick={() => {
                                        navigate('/storeDetails', { state: { store: comercio } });
                                    }}
                                > 
                                    <h2 className="tienda-title text-xl font-semibold mb-2">{comercio.storeName}</h2>
                                    <p className="tienda-info"><strong>CIF:</strong> {comercio.CIF}</p>
                                    <p className="tienda-info"><strong>Email:</strong> {comercio.email}</p>
                                    <p className="tienda-info"><strong>Dirección:</strong> {comercio.address}</p>
                                </div>
                            ))
                        ) : (
                            <p>No se encontraron comercios.</p>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default StoresPage;
