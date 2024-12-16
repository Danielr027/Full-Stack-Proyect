import { useState } from "react";
import axios from "axios";
import './../../../styles/LoginPage.css';

function LoginForm({ enviaData }) {
    const [userData, setUserData] = useState({userName: '', password: ''});

    const handleChange = (event, field) => {
        setUserData({
            ...userData,
            [field]: event.target.value
        })
    }

    const handleBody = (body) => {
        // Guardar el TOKEN en caché
        const token = body.token; 

        if(token) {
            localStorage.setItem('token', token);
            console.log(token)
            enviaData(true);
        } else {
            enviaData(false);
        }
    }

    const handleClick = (event) => {
        event.preventDefault()

        const body = {
            "email": userData.userName,
            "password": userData.password
        }

        axios.post('http://localhost:3002/api/user/login', body)
            .then(response => handleBody(response.data))
            .catch(error => console.log(error));
        
        
    }

    return (
        <form className="form">
            <div className="form">
                <label>Email del usuario: </label>
                <input type="text" onChange={(event) => handleChange(event, 'userName')} />
            </div>

            <div>
                <label>Contraseña: </label>
                <input type="password" onChange={(event) => handleChange(event, 'password')} />
            </div>

            <br />

            <button onClick={handleClick}>INICIAR SESIÓN</button>
        </form>
    )
}

export default LoginForm;