import React, { useState } from "react";
import HeaderSection from "./components/HeaderSection ";
import TimeOptions from "./components/TimeOptions";
import PaymentSection from "./components/PaymentSection";

const DEFAULT_AMOUNT = 0.75;

const WiFiPayment = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(DEFAULT_AMOUNT);
  const [selectedMethod, setSelectedMethod] = useState("EVC Plus");

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const selectTime = (amount) => setSelectedAmount(amount);
  const selectMethod = (method) => setSelectedMethod(method);

  return (
    <div
      className={`${darkMode ? "dark" : ""} relative min-h-screen overflow-hidden px-3 py-6 transition-colors sm:px-4 sm:py-12 ${
        darkMode
          ? "bg-gradient-to-b from-[#1a1333] via-[#1e1b2e] to-[#151520]"
          : "bg-gray-100"
      }`}
    >
      {darkMode && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-20 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="absolute -right-24 top-[40%] h-[300px] w-[300px] rounded-full bg-emerald-500/12 blur-[90px]" />
          <div className="absolute -bottom-16 left-[20%] h-[260px] w-[260px] rounded-full bg-indigo-500/15 blur-[80px]" />
        </div>
      )}

      <main
        className={`relative mx-auto w-full max-w-md rounded-3xl border p-4 shadow-lg sm:p-5 ${
          darkMode
            ? "border-white/[0.08] bg-white/[0.06] text-white shadow-2xl shadow-violet-500/10 backdrop-blur-xl"
            : "border-gray-200 bg-white text-slate-800"
        }`}
      >
        <HeaderSection darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <section className="rounded-3xl pb-6">
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
        </section>
        <footer
          className={`mt-6 px-4 py-3 text-center text-xs sm:text-sm ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Call us any feedback or problem{" "}
          <span className="font-semibold text-gray-800 dark:text-white">
            616586503 / 616251068
          </span>
        </footer>
      </main>
    </div>
  );
};

export default WiFiPayment;
