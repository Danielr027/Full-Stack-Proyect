"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import '@/styles/Estilos.css';

function ListaTiendas({ webList }) {
    const router = useRouter();

    const handleClick = (webStore) => {
        router.push(`/webStoreDetails/${webStore._id}`);
    };

    return (
        <div className="lista-tiendas-container">
            {webList && webList.length > 0 ? (
                webList.map((webStore) => (
                    <div
                        key={webStore.storeId}
                        className="tienda-card"
                        onClick={() => handleClick(webStore)}
                    >
                        <h3 className="tienda-title">{webStore.title}</h3>
                        <p className="tienda-info"><strong>Ciudad:</strong> {webStore.city}</p>
                        <p className="tienda-info"><strong>Actividad:</strong> {webStore.activity}</p>
                        <p className="tienda-info"><strong>Puntuación:</strong> {webStore.reviews?.scoring || 'N/A'}</p>
                    </div>
                ))
            ) : (
                <p>No se encontraron páginas web.</p>
            )}
        </div>
    );
}

export default ListaTiendas;
