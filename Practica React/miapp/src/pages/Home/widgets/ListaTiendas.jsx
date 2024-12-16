// ListaTiendas.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import './../../../styles/Estilos.css';

function ListaTiendas({ webList }) {

    const navigate = useNavigate();

    const webStoreList = webList.map(webStore => (
        <div 
            key={webStore.storeId} 
            className="tienda-card"
            onClick={() => {
                console.log(webStore.storeId);
                navigate(`/webStoreDetails/${webStore._id}/${webStore.storeId}`);
            }}
        >
            <h3 className="tienda-title">{webStore.title}</h3>
            <p className="tienda-info"><strong>Ciudad:</strong> {webStore.city}</p>
            <p className="tienda-info"><strong>Actividad:</strong> {webStore.activity}</p>
            <p className="tienda-info"><strong>Puntuación:</strong> {webStore.reviews?.scoring || 'N/A'}</p>
        </div>
    ));

    return (
        <div className="lista-tiendas-container">
            {webStoreList.length > 0 ? webStoreList : <p>No se encontraron páginas web.</p>}
        </div>
    );
}

export default ListaTiendas;
