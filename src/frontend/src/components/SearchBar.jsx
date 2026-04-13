import { useState } from 'react';
import logo from "../assets/logo.jpg";

export default function SearchBar() {
    const seasons = [
        "2016-2017", "2017-2018", "2018-2019",
        "2019-2020", "2020-2021", "2021-2022",
        "2022-2023", "2023-2024", "2024-2025"
    ];

    const [query, setQuery] = useState("");
    const [responses, setResponses] = useState([]);
    const [season, setSeason] = useState("2016-2017");

    const handleSearch = async () => {
        if (!query.trim()) return;
    
        const response = await fetch("http://localhost:8000/api/questions/ask", {
            method: "POST",
            headers: { "Content-Type": "application/JSON" },
            body: JSON.stringify({
                question: query,
                season: season.slice(2, 5) + season.slice(7)
            })
        });
        
        const data = await response.json();
        setResponses([data.answer, ...responses]);
        setQuery("");
    };

    return (
        <div className="flex flex-col items-center mt-10 px-4 pb-4">

            {/* Responses List */}
            <div className="w-full max-w-md mb-4 space-y-2">
                {responses.map((res, index) => (
                    <div
                        key={index}
                        className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow flex justify-between items-start"
                    >          
                        <div>{res}</div>                 
                        <span
                            onClick={() => setResponses(prev => prev.filter((_, i) => i !== index))}
                            className="cursor-pointer text-gray-500 hover:text-red-500 font-bold ml-4 select-none"
                        >
                            &times;
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex w-full max-w-md gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type your query..."
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 border-none cursor-pointer"
                >
                    {seasons.map((season) => (
                        <option key={season} value={season}>
                            {season}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleSearch}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
                >
                    Search
                </button>
            </div>
        </div>

    );
}
