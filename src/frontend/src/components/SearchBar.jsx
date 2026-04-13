import { useState, useRef } from 'react';
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
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const handleSearch = async () => {
        if (!query.trim()) {
            // focus input
            inputRef.current?.focus();
            return;
        }
        setLoading(true);
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
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center mt-10 px-4 pb-4">

            {/* Responses List */}
            <div className="w-full max-w-2xl mb-4 space-y-2">
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

            <div className="flex w-full max-w-2xl gap-2">
                <div className="flex flex-col w-full">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type your query..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                    />              
                </div>

                <div className="relative w-40">
                    <select
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        className="appearance-none block w-full rounded-md bg-white px-3 py-2 pr-10 text-sm font-semibold text-gray-900 shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {seasons.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg
                            className="h-4 w-4 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>

                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg ${loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                >
                    {loading && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}

                    {loading ? "Searching..." : "Search"}
                </button>
            </div>
        </div>

    );
}
