import React, { useState, useEffect } from "react";
import NavBar from "../../widgets/NavBar";
import Filtros from "./widgets/Filtros";
import ListaTiendas from "./widgets/ListaTiendas";
import '../../styles/Estilos.css';
import { decodeToken, checkIfAdmin } from "../../utils/Decode";

function HomePage() {
  const [webStores, setWebStores] = useState([]);
  const [filteredWebStores, setFilteredWebStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ city: "", activity: "" });

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Función para obtener todas las tiendas al cargar la página
    const fetchWebStores = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3002/api/webStore');
        const data = await response.json();
        console.log("Datos recibidos", data);
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

  // Función para aplicar filtros al hacer clic en "Filtrar"
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

  // Función para ordenar las tiendas por scoring
  const handleSort = () => {
    const listaOrdenada = [...filteredWebStores].sort((a, b) => {
      const scoringA = a.reviews?.scoring || 0;
      const scoringB = b.reviews?.scoring || 0;
      return scoringB - scoringA;
    });
    setFilteredWebStores(listaOrdenada);
  };

  // Función para renderizar el mensaje de rol del usuario
  const renderRoleMessage = () => {
    if (!token) {
      return <h1>Es un usuario anónimo</h1>
    }

    const userRole = decodeToken(token);

    if (checkIfAdmin(token)) {
      return <h1>¡¡¡Es Admin!!!</h1>
    } else if (userRole === "user") {
      return <h1>Es un usuario normal</h1>
    } else if (userRole === "merchant") {
      return <h1>Es un merchant</h1>
    } else {
      return <h1>Algo ha fallado</h1>
    }
  }

  return (
    <>
      <NavBar />

      <div>
        {renderRoleMessage()}
      </div>

      <div className="home-container">
        <h1 className="home-header">Páginas Web</h1>

        <div className="home-content">
          <Filtros 
            onFilterChange={handleApplyFilters} 
            onSort={handleSort} 
          />

          <ListaTiendas webList={filteredWebStores} />
        </div>
      </div>
    </>
  );
}

export default HomePage;
