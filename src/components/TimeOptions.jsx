import React from "react";
import { TfiTimer } from "react-icons/tfi";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TimeOptions = ({ selectedAmount, selectTime }) => {
  const isActiveTime = (amount) => selectedAmount === amount;

  const times = [
    {
      label: "1 Saac",
      amount: "$0.50",
      icon: (
        <svg
          className="w-12 h-12 mx-auto mb-2 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6l4 2"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      label: "2 Saac",
      amount: "$1.00",
      icon: <TfiTimer className=" w-12 h-12 mx-auto mb-2 text-blue-500" />,
    },
  ];

  return (
    <div>
      <div className="px-4 py-6 text-center text-white rounded-b-[1.5rem] shadow-lg bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-400">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase text-white/80">
          Station #62
        </p>
        <h1 className="text-2xl font-black leading-tight">
          Arena Cafe
          <br />
          Mogadishu
        </h1>
        <p className="mt-2 text-sm font-medium text-white/90">
          Dooro muddada kugu habboon
        </p>
      </div>

      <div className="flex justify-between gap-3 mt-6 ml-3 mr-3">
        {times.map((time, idx) => (
          <div
            key={idx}
            onClick={() => selectTime(time.amount)}
            className={`flex-1 relative text-center rounded-xl p-4 cursor-pointer shadow hover:scale-105 transition ${
              isActiveTime(time.amount)
                ? "border-2 border-blue-500 bg-white dark:bg-gray-700 active-time"
                : "bg-slate-50 dark:bg-gray-600"
            }`}
          >
            {time.icon}
            <p
              className={`text-base font-bold ${
                isActiveTime(time.amount) ? "text-blue-600" : ""
              }`}
            >
              {time.label}
            </p>
            <p
              className={`text-sm ${
                isActiveTime(time.amount)
                  ? "text-blue-500"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {time.amount}
            </p>
            {isActiveTime(time.amount) && (
              <div className="absolute flex items-center justify-center w-5 h-5 border border-blue-500 rounded-full top-1 right-1">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-xs text-blue-500"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeOptions;
