import SearchBar from '../../SearchBar';
import Banners from '../../Banners';
import AdBanner from '../../AdBanner';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.jpg';

export default function Home() {

    return (<>
       <div className="firefox-container">
            <main className="container mx-auto">
                <SearchBar />
                <Banners />
               
            </main>
        </div>
    </>
    );
}