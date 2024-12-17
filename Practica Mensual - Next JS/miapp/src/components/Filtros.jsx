"use client";
import React, { useState } from "react";
import "@/styles/Estilos.css";

function Filtros({ onFilterChange, onSort }) {
    const [localFilters, setLocalFilters] = useState({ city: "", activity: "" });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLocalFilters({
            ...localFilters,
            [name]: value
        });
    };

    const handleFilter = (event) => {
        event.preventDefault();
        onFilterChange(localFilters);
    };

    const handleSortClick = (event) => {
        event.preventDefault();
        onSort();
    };

    return (
        <form className="filtros-container" onSubmit={handleFilter}>
            <div className="filtros-form">
                <div>
                    <label htmlFor="city">Ciudad: </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={localFilters.city}
                        onChange={handleInputChange}
                        placeholder="Filtrar por ciudad"
                    />
                </div>
                <div>
                    <label htmlFor="activity">Actividad: </label>
                    <input
                        type="text"
                        id="activity"
                        name="activity"
                        value={localFilters.activity}
                        onChange={handleInputChange}
                        placeholder="Filtrar por actividad"
                    />
                </div>
                <div className="filtros-buttons">
                    <button type="submit">Filtrar</button>
                    <button type="button" onClick={handleSortClick}>Ordenar por Scoring</button>
                </div>
            </div>
        </form>
    );
}

export default Filtros;
