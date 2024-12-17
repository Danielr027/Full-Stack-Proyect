"use client";
import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Filtros from "@/components/Filtros";
import ListaTiendas from "@/components/ListaTiendas";
import "@/styles/Estilos.css";
import { decodeToken, checkIfAdmin } from "@/utils/Decode.js";

export default function HomePage() {
    const [webStores, setWebStores] = useState([]);
    const [filteredWebStores, setFilteredWebStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ city: "", activity: "" });
    const [token, setToken] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        setToken(t);
        if (t) {
            const role = decodeToken(t);
            setUserRole(role);
            setIsAdmin(checkIfAdmin(t));
        }
    }, []);

    useEffect(() => {
        const fetchWebStores = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:3002/api/webStore');
                const data = await response.json();
                setWebStores(data);
                setFilteredWebStores(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Ocurrió un error al obtener las tiendas. Por favor, intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        };
        fetchWebStores();
    }, []);

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        let listaFiltrada = webStores;
        if (newFilters.city) {
            listaFiltrada = listaFiltrada.filter(webStore =>
                webStore.city.toLowerCase().includes(newFilters.city.toLowerCase())
            );
        }
        if (newFilters.activity) {
            listaFiltrada = listaFiltrada.filter(webStore =>
                webStore.activity.toLowerCase().includes(newFilters.activity.toLowerCase())
            );
        }
        setFilteredWebStores(listaFiltrada);
    };

    const handleSort = () => {
        const listaOrdenada = [...filteredWebStores].sort((a, b) => {
            const scoringA = a.reviews?.scoring || 0;
            const scoringB = b.reviews?.scoring || 0;
            return scoringB - scoringA;
        });
        setFilteredWebStores(listaOrdenada);
    };

    const renderRoleMessage = () => {
        if (!token) return <h1>Es un usuario anónimo</h1>;
        if (isAdmin) return <h1>¡¡¡Es Admin!!!</h1>;
        if (userRole === "user") return <h1>Es un usuario normal</h1>;
        if (userRole === "merchant") return <h1>Es un merchant</h1>;
        return <h1>Algo ha fallado</h1>;
    };

    return (
        <>
            <NavBar />
            <div>
                {renderRoleMessage()}
            </div>
            <div className="home-container">
                <h1 className="home-header">Páginas Web</h1>
                <div className="home-content">
                    <Filtros onFilterChange={handleApplyFilters} onSort={handleSort} />
                    {loading ? <p>Cargando...</p> : <ListaTiendas webList={filteredWebStores} />}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </div>
        </>
    );
}
