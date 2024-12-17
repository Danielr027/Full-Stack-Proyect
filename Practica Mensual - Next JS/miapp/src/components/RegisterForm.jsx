"use client";
import { useState } from "react";
import axios from "axios";

export default function RegisterForm({ enviaData }) {
    const [nuevoInteres, setNuevoInteres] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    const [userData, setUserData] = useState({
        userName: '',
        password: '',
        email: '',
        edad: 0,
        ciudad: '',
        intereses: []
    });

    const handleChange = (event, field) => {
        setUserData({
            ...userData,
            [field]: event.target.value
        });
    }

    const addInteres = () => {
        setUserData({
            ...userData,
            intereses: [...userData.intereses, nuevoInteres]
        });
        setNuevoInteres('');
    }

    const handleBody = (body) => {
        const token = body.token; 
        if (token) {
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
            }
            enviaData(true);
            setMensajeExito('¡Te has registrado con éxito!');
        } else {
            enviaData(false);
            setMensajeError('¡Algo ha fallado! Vuelve a intentar registrarte.');
        }
    }

    const handleClick = (event) => {
        event.preventDefault();

        const body = {
            "nombre": userData.userName,
            "email": userData.email,
            "password": userData.password,
            "edad": parseInt(userData.edad),
            "ciudad": userData.ciudad,
            "intereses": userData.intereses
        }

        axios.post('http://localhost:3002/api/user/register', body)
            .then(response => handleBody(response.data))
            .catch(error => {
                console.log(error);
                setMensajeError('Algo ha fallado durante el registro. Comprueba que tus datos sean válidos.');
            });
    }

    return (
        <form>
            <div>
                <label>Nombre: </label>
                <input type="text" onChange={(event) => handleChange(event, 'userName')} />
            </div>

            <div>
                <label>Email: </label>
                <input type="text" onChange={(event) => handleChange(event, 'email')} />
            </div>
            
            <div>
                <label>Edad: </label>
                <input type="number" onChange={(event) => handleChange(event, 'edad')} />
            </div>

            <div>
                <label>Ciudad: </label>
                <input type="text" onChange={(event) => handleChange(event, 'ciudad')} />
            </div>
            
            <div>
                <label>Intereses</label>
                <div>
                    <label>Añadir nuevo interes: </label>
                    <div style={{display: "flex", gap: "5px", flex: "nowrap"}}>
                        <input type="text" value={nuevoInteres} onChange={(event) => setNuevoInteres(event.target.value)} />
                        <button type="button" onClick={addInteres}>Añadir Nuevo Interes</button>
                    </div>
                </div>
                <ul>
                    {userData.intereses.map((interes, index) => (
                        <li key={index}>
                            {interes}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <label>Contraseña: </label>
                <input type="password" onChange={(event) => handleChange(event, 'password')} />
            </div>

            <br />

            <button onClick={handleClick} className="boton-formulario">Registrarse</button>

            {mensajeExito && (
                <div className="mensaje-exito">
                    <p>{mensajeExito}</p>
                </div>
            )}

            {mensajeError && (
                <div className="mensaje-error">
                    <p>{mensajeError}</p>
                </div>
            )}

        </form>
    );
}
