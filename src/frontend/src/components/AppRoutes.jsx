import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import { Login } from "./Pages/Login";
import Profile from "./Pages/Profile";
import Home from "./Pages/Home";

import MainLayout from "./Layout/MainLayout";

function AppRoutes() {

    return (

        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
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