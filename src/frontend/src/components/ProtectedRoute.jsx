import React from "react";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {

    // check if token exists in localStorage
    const isAuthenticated = !!localStorage.getItem("access_token"); 
    if (!isAuthenticated) {
        // user not logged in, redirect to login
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;