import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Register from './Pages/Register/Register';
import { Login } from "./Pages/Login";
import Profile from "./Pages/Profile";
import Home from "./Pages/Home";
import Memberships from "./Pages/Memberships";

import MainLayout from "./Layout/MainLayout";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/"         element={<Home />} />

            <Route
                path="/memberships"
                element={
                    <MainLayout>
                        <Memberships />
                    </MainLayout>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Profile />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;