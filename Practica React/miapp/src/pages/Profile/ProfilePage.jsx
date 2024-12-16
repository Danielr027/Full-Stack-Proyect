import NavBar from "../../widgets/NavBar";
import ProfileForm from "./widgets/ProfileForm";
import EliminarUsuario from "./widgets/EliminarUsuario";
import './../../styles/RegisterPage.css';

function ProfilePage() {
    const token = localStorage.getItem('token');

    return (
        <>
            <NavBar />

            <div className="profile-container max-w-4xl mx-auto mt-8 p-6 bg-white shadow rounded">
                <h1 className="profile-header text-2xl font-bold text-gray-800 mb-6">Modificar Datos</h1>

                <div className="profile-content grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileForm token={token} />
                    <div className="flex items-end justify-end">
                        <EliminarUsuario token={token} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;
