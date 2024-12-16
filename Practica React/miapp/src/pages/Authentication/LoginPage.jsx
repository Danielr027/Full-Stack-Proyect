import LoginForm from "./widgets/LoginForm";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import './../../styles/LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = (autenticado) => {
        if (autenticado) {
            navigate('/');
        }
    }

    return (
        <div className="login-container">

            <div className="login-box">

                <h1>INICIAR SESIÓN</h1>


                <LoginForm enviaData={handleLogin} />

                <Link to="/register">Registrarse</Link>

            </div>
        </div>
    );
}

export default LoginPage;