import React from "react";
import { BsLightningChargeFill } from "react-icons/bs";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HeaderSection = ({ darkMode, toggleDarkMode }) => (
  <>
    {/* Top Icons */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex justify-center flex-1">
        <div className="flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full shadow dark:bg-gray-800">
          <BsLightningChargeFill className="w-10 h-10 text-blue-600 dark:text-sky-300" />
        </div>
      </div>

      <button
        onClick={toggleDarkMode}
        aria-label="Toggle Dark Mode"
        className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow dark:bg-gray-800"
      >
        <FontAwesomeIcon
          icon={darkMode ? faSun : faMoon}
          className="text-purple-600 dark:text-purple-300"
        />
      </button>
    </div>
  </>
);

export default HeaderSection;
