import NavBar from "../../widgets/NavBar";
import { Link } from "react-router-dom";
function MiStorePage() {


    

    return(
        <>
        
            <NavBar />

            <div className="flex justify-end mb-6 space-x-4">
                                
                <Link 
                    to="/createWebStore" 
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 m-5">
                        Crear Web
                </Link>
            </div>

            <h1>Mi Store Page</h1>
        
        </>
    );
}

export default MiStorePage;