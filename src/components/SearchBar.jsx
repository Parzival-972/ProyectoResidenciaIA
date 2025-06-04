"use client";

import { useState } from "react";

const SearchBar = ({ onSearch, toggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Track the search input

  // Handle input change and pass the search term to the parent
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // Send the input value to the parent component
  };

  return (
    <div className="p-2  flex items-center justify-between w-full border-b-2">
      <div className="relative flex-grow">
        <div className="bg-gray-100 rounded border border-gray-200 flex items-center">
          <button className="py-2 px-4 bg-white text-gray-600 rounded-l border-r border-gray-200 hover:bg-gray-50 active:bg-gray-200 disabled:opacity-50 inline-flex items-center focus:outline-none">
            Buscar
          </button>
          <input
            value={searchTerm}
            onChange={handleSearch}
            type="text"
            placeholder="Nombre o Apellido..."
            className="bg-transparent py-1 text-gray-600 px-4 focus:outline-none w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
