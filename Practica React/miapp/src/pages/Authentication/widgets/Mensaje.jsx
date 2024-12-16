function Mensaje({ login }) {

    if(login) {
        return (
            <div>
                <h2>¡Registro Exitoso!</h2>
            </div>
        );
    } else {
        return (
            <div>
                <h2>¡Algo ha fallado!</h2>
            </div>
        );
    }
    
}

export default Mensaje;