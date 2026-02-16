import './App.css';
import SearchBar from './SearchBar';
import Banners from './Banners';
import AdBanner from './AdBanner';

function App() {

  return (
    <div className="firefox-container">
      <SearchBar />
      <Banners />
      <AdBanner/>
    </div>
  );
}

export default App;
