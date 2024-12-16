import RegisterForm from "./widgets/RegisterForm";
import { Link } from "react-router-dom";
import './../../styles/RegisterPage.css';

function RegisterPage() {
    
    const handleRegister = (resultado) => {
        console.log(resultado)
    }

    return (
        <div className="register-container">

            <div className="register-box">

                <h1>REGISTRARSE</h1>

                <RegisterForm enviaData={handleRegister} />

                <Link to="/">Iniciar Sesión</Link>
            </div>
            
        </div>
    );
}

export default RegisterPage;