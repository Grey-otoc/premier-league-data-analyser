import { useState } from 'react';
import logo from "../assets/logo.jpg";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [responses, setResponses] = useState([]);

    const handleSearch = () => {
        if (!query.trim()) return;

        // Simulate API response (replace with your API call)
        const newResponse = `Response for: "${query}"`;

        // Add new response to top of array
        setResponses([newResponse, ...responses]);

        // Clear input
        setQuery("");
    };

    return (
        <div className="flex flex-col items-center mt-10 px-4">

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


            <div className="flex w-full max-w-md">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type your query..."
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
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