import React from "react";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HeaderSection = ({ darkMode, toggleDarkMode }) => (
  <header className="mb-5 flex items-center justify-between px-1">
    <div className="mx-auto flex flex-1 justify-center">
      <img
        src="/danab-logo.svg"
        alt="Danab Powerbank Station"
        className={`h-14 w-auto sm:h-16 ${darkMode ? "brightness-0 invert" : ""}`}
      />
    </div>

    <button
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition ${
        darkMode
          ? "border-white/15 bg-slate-800 text-amber-300 hover:bg-slate-700"
          : "border-slate-200 bg-white text-purple-700 hover:bg-slate-50"
      }`}
    >
      <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
    </button>
  </header>
);

export default HeaderSection;
