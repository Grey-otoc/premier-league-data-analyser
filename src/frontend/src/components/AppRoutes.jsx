import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Register from './Pages/Register/Register';
import { Login } from "./Pages/Login";
import Profile from "./Pages/Profile";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Subscriptions from "./Pages/Subscriptions";

import MainLayout from "./Layout/MainLayout";
import Dashboard1 from "./Pages/Dashboard/Dashboard1";

function AppRoutes() {

    return (

        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout>
                <Home />
            </MainLayout>} />

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
                path="/dashboard1"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Dashboard1 />
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
                } a
            />

            <Route path="/register" element={<Register />} />

        </Routes>

    );

}

export default AppRoutes;