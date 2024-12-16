import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import RegisterPage from './pages/Authentication/RegisterPage';
import LoginPage from './pages/Authentication/LoginPage';
import ProfilePage from './pages/Profile/ProfilePage';
import WebStoreDetailsPage from './pages/Home/WebStoreDetailsPage';
import StoresPage from './pages/Stores/StoresPage';
import AddStorePage from './pages/Stores/AddStorePage';
import StoreDetailsPage from './pages/Stores/StoreDetailsPage';
import CreateStorePage from './pages/Stores/CreateStore';
import CreateMerchantPage from './pages/Stores/CreateMerchantPage';
import MiStorePage from './pages/MiStore/MiStorePage';
import CreateWebStorePage from './pages/MiStore/CreateWebStorePage';
import InterestedUsersPage from './pages/InterestedUsers/InterestedUsersPage';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/webStoreDetails/:webStoreId/:storeId" element={<WebStoreDetailsPage />} />
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/addStore" element={<AddStorePage />} />
        <Route path="/storeDetails" element={<StoreDetailsPage />} />
        <Route path="/createStore" element={<CreateStorePage />} />
        <Route path="/createMerchant" element={<CreateMerchantPage />} />
        <Route path="/miStore" element={<MiStorePage />} />
        <Route path="/createWebStore" element={<CreateWebStorePage />} />
        <Route path="/interestedUsers" element={<InterestedUsersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
