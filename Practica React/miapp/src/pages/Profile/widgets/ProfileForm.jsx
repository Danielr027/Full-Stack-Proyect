import { useState } from "react";
import axios from "axios";
import './../../../styles/LoginPage.css';

function ProfileForm({ token }) {
    const [nuevoInteres, setNuevoInteres] = useState('');
    const [mensajeExito, setMensajeExito] = useState(false);

    const [userData, setUserData] = useState({
        userName: '',
        email: '',
        edad: 0,
        ciudad: '',
        intereses: []
    });

    const handleChange = (event, field) => {
        setUserData({
            ...userData,
            [field]: event.target.value
        })
    }

    const addInteres = () => {
        setUserData({
            ...userData,
            intereses: [...userData.intereses, nuevoInteres]
        });

        setNuevoInteres('');
    }

    const handleClick = (event) => {
        event.preventDefault()

        const body = {
            "nombre": userData.userName,
            "edad": parseInt(userData.edad),
            "ciudad": userData.ciudad,
            "intereses": userData.intereses
        }

        console.log(body);

        axios.put('http://localhost:3002/api/user', body, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log("Modificación exitosa:", response);
                setMensajeExito(true);
                setTimeout(() => setMensajeExito(false), 3000);
            })
            .catch(error => console.log(error));
    }

    return (
        <div className="profile-form w-full">
            <form className="flex flex-col space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
                    <input 
                        type="text" 
                        onChange={(event) => handleChange(event, 'userName')} 
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad:</label>
                    <input 
                        type="number" 
                        onChange={(event) => handleChange(event, 'edad')} 
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad:</label>
                    <input 
                        type="text" 
                        onChange={(event) => handleChange(event, 'ciudad')} 
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                {/* Si en un futuro quieres añadir intereses:
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Intereses:</label>
                    <div className="flex space-x-2 items-center mb-2">
                        <input 
                            type="text" 
                            onChange={(event) => setNuevoInteres(event.target.value)} 
                            value={nuevoInteres}
                            placeholder="Nuevo interés"
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button 
                            type="button" 
                            onClick={addInteres}
                            className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                        >
                            Añadir
                        </button>
                    </div>
                    <ul className="list-disc ml-5 text-gray-700">
                        {userData.intereses.map((interes, index) => (
                            <li key={index}>{interes}</li>
                        ))}
                    </ul>
                </div>
                */}

                <button 
                    onClick={handleClick} 
                    className="boton-formulario w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 transition"
                >
                    Modificar Datos
                </button>
            </form>

            {mensajeExito && (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-green-700">
                    ¡Se han modificado los datos con éxito!
                </div>
            )}
        </div>
    )
}

export default ProfileForm;
