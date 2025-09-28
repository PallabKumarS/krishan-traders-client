import React, { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBox({
  setSearchValue,
}: {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(
    localStorage.getItem("searchKey") || ""
  );

  const handleClear = () => {
    setInputValue("");
    setSearchValue("");
    localStorage.removeItem("searchKey");
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setSearchValue(inputValue.trim());
      localStorage.setItem("searchKey", inputValue.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        {/* Main Search Box */}
        <div className="relative">
          <div
            className={`relative flex items-center transition-all duration-200 ${
              isFocused
                ? "ring-2 ring-blue-500 ring-offset-2"
                : "ring-1 ring-gray-300 hover:ring-gray-400"
            } rounded-lg bg-white shadow-sm`}
          >
            {/* Search Icon */}
            <div className="absolute left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search anything..."
              className="w-full pl-10 pr-12 py-3 text-sm bg-transparent border-none outline-none placeholder:text-gray-500 sm:py-4 sm:text-base"
            />

            {/* Clear Button */}
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-10 p-1 hover:bg-gray-100 rounded-full transition-colors duration-150"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}

            {/* Search Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inputValue.trim()}
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
