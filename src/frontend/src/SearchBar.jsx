import { useState } from 'react';

export default function SearchBar() {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        alert("you entered " + search);
       // window.location.href = `https://www.google.com{search}`;
    };


    return (
        <div className="search-wrapper">
            <img src="https://upload.wikimedia.org" alt="Firefox Logo" className="logo" />
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type your question"
                    className="search-bar"
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>
        </div>
    );
}