import React, { useState } from "react";
import "./Header.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import logo from '../../assets/logo.jpg';

function Header() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const toggleMenu = () => setOpen(!open);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('questions_used');
        navigate("/");
    };

    return (
        <header className="header">
            <div className="logo">
                <img src={logo} alt="Premier League" className="h-10 w-auto" />
            </div>

            <nav className="menu">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/subscriptions">Plans</NavLink>
            </nav>

            <div className="right-section">
                <i className="fa-regular fa-bell notification"></i>
                <div className="profile" onClick={toggleMenu}>
                    <img src="https://i.pravatar.cc/35" alt="avatar" />
                    <span>{user?.username}</span>
                    <i className="fa-solid fa-chevron-down"></i>
                    {open && (
                        <div className="dropdown" id="userMenu">
                            <a href="/profile"><i className="fa fa-user"></i> Profile</a>
                            <a href="/dashboard"><i className="fa fa-gauge"></i> Dashboard</a>
                            <a href="#" onClick={handleLogout}>
                                <i className="fa fa-right-from-bracket"></i> Logout
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;

