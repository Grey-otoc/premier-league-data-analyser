import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Register from './Pages/Register/Register';
import { Login } from "./Pages/Login";
import Profile from "./Pages/Profile";
import Home from "./Pages/Home";
import Subscriptions from "./Pages/Subscriptions";

import MainLayout from "./Layout/MainLayout";
<<<<<<< Updated upstream
=======
import Dashboard from "./Pages/Dashboard/Dashboard";
>>>>>>> Stashed changes

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

               <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/subscriptions"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Subscriptions />
                        </MainLayout>
                    </ProtectedRoute>
                }a
            />

            <Route path="/register" element={<Register />} />

        </Routes>

    );

}

export default AppRoutes;