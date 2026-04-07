import React from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TimeOptions = ({ selectedAmount, selectTime }) => {
  const isActiveTime = (amount) => selectedAmount === amount;

  const times = [
    {
      label: "$0.75",
      amount: 0.75,
      icon: (
        <svg
          className="h-5 w-5 shrink-0 text-emerald-400 sm:h-6 sm:w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="9" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.5v5l3.2 2"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mx-3 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-3 text-center text-white shadow-md sm:mx-4 sm:px-5 sm:py-4">
        <h1 className="text-base font-black leading-tight sm:text-lg">
          Danab-Arena Cafe
          <br />
          Mogadishu
        </h1>
      </div>

      <div className="mx-auto mt-4 grid w-[200px] grid-cols-1 gap-3 sm:mt-5 sm:w-[210px] sm:gap-4">
        {times.map((time, idx) => (
          <button
            key={idx}
            onClick={() => selectTime(time.amount)}
            className={`group relative flex h-[50px] items-center justify-center gap-2 overflow-hidden rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] sm:h-[60px] ${
              isActiveTime(time.amount)
                ? "border-2 border-emerald-400 bg-white"
                : "border-2 border-gray-200 bg-gray-50 hover:border-violet-300"
            }`}
          >
            {time.icon}
            <span
              className={`text-sm font-bold sm:text-base ${
                isActiveTime(time.amount) ? "text-violet-500" : "text-gray-700"
              }`}
            >
              {time.label}
            </span>
            {isActiveTime(time.amount) && (
              <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full border border-emerald-300 bg-white text-[8px] text-emerald-400">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-[8px] text-emerald-400"
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeOptions;
