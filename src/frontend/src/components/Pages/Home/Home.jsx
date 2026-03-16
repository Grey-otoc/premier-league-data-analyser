import SearchBar from '../../SearchBar';
import Banners from '../../Banners';
import AdBanner from '../../AdBanner';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.jpg';

export default function Home() {

    return (<>


        <header className="flex items-center justify-between px-4 py-3 bg-white shadow">

            <div className="flex items-center space-x-6">

                <img src={logo} alt="Premier League" className="h-10 w-auto" />

                <nav className="hidden md:flex space-x-4">
                    <Link to="/" className="text-black hover:text-blue-500 font-medium">
                        Home
                    </Link>
                    <Link to="/Contact" className="text-black hover:text-blue-500 font-medium">
                        Contact 
                    </Link>
                   
                </nav>
            </div>

            {/* Sign In button on the right */}
            <Link
                to="/login"
                className="signin-btn"
            >
                Sign In
            </Link>
        </header>
        <div className="firefox-container">
            <main className="container mx-auto">
                <SearchBar />
                <Banners />
               
            </main>
        </div>
    </>
    );
}