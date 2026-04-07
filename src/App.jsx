import React, { useState } from "react";
import HeaderSection from "./components/HeaderSection ";
import TimeOptions from "./components/TimeOptions";
import PaymentSection from "./components/PaymentSection";

const WiFiPayment = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("$0.50");
  const [selectedMethod, setSelectedMethod] = useState("EVC Plus");

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const selectTime = (amount) => setSelectedAmount(amount);
  const selectMethod = (method) => setSelectedMethod(method);

  return (
    <div
      className={`${darkMode ? "dark" : ""} min-h-screen bg-[radial-gradient(circle_at_top,#f3f0ff,#f7fbff_42%,#eefbf5)] px-4 py-6 transition-colors duration-500 dark:bg-[#0f172a]`}
    >
      <div className="max-w-sm mx-auto p-5 overflow-hidden rounded-[2rem] border border-white/80 shadow-2xl bg-white/95 text-gray-800 backdrop-blur dark:border-slate-700 dark:bg-[#111827] dark:text-white">
        <HeaderSection darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="overflow-hidden bg-white border border-slate-100 rounded-[1.5rem] shadow-sm dark:border-slate-700 dark:bg-gray-800">
          <TimeOptions
            selectedAmount={selectedAmount}
            selectTime={selectTime}
          />
          <PaymentSection
            selectedAmount={selectedAmount}
            selectedMethod={selectedMethod}
            selectMethod={selectMethod}
            darkMode={darkMode}
          />
        </div>
        <footer className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Arena Cafe support{" "}
          <span className="font-semibold text-gray-800 dark:text-white">
            616586503 / 616251068
          </span>
        </footer>
      </div>
    </div>
  );
};

export default WiFiPayment;
