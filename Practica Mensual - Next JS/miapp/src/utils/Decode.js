import { jwtDecode } from "jwt-decode";

const decodeToken = (token) => {
    try {
        // Decodificar el token
        const decoded = jwtDecode(token);

        // Acceder al rol del usuario
        const role = decoded.role;
        return role;

    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}

const checkIfAdmin = (token) => {
    const role = decodeToken(token);
    return role === "admin";
}

export {  decodeToken, checkIfAdmin };