import axios from "axios";
import React, { useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import ProcessingModal from "./ProcessingModal";

const BACKEND_URL =
  import.meta.env.VITE_USERS_BACKEND_URL ||
  (import.meta.env.DEV ? "https://usersbackend-6yhs.onrender.com" : "");
const STATION_CODE = import.meta.env.VITE_STATION_CODE || "62";
const PAYMENT_REQUEST_TIMEOUT_MS = 280_000;

function getWaafiMessage(data) {
  return (
    data?.waafiResponse?.responseMsg ||
    data?.waafiMsg ||
    data?.waafiMessage ||
    ""
  );
}

function mapBackendErrorMessage(errorMsg, waafiMsg) {
  if (waafiMsg) {
    return waafiMsg;
  }

  if (errorMsg.includes("No available battery")) {
    return "Ma jiro baytari diyaar ah hadda, fadlan mar kale isku day";
  }

  if (errorMsg.includes("already have an active rental")) {
    return "Waxaad hore u haysataa battery, fadlan soo celi midkaas ka hor intaadan mid kale kireysanin";
  }

  if (errorMsg.includes("battery is already rented")) {
    return "Battery-gan waa la kireystay, fadlan mar kale isku day";
  }

  if (errorMsg.includes("blocked") || errorMsg.includes("blacklist")) {
    return "Macamiil waxa kugu maqan battery hore fadlan soo celi midkaas";
  }

  if (errorMsg.includes("Payment hold not approved")) {
    return "Lacag bixinta ma dhicin, fadlan hubi numberkaaga iyo haraagaaga";
  }

  if (errorMsg.includes("Battery could not be released. Payment hold was cancelled.")) {
    return "Battery-gu ma soo bixin. Hold-kii lacagta waa la cancel gareeyay.";
  }

  return errorMsg || "Khalad dhacay, fadlan mar kale isku day";
}

const PaymentSection = ({ selectedAmount, selectedMethod, selectMethod }) => {
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("processing");
  const [processingStep, setProcessingStep] = useState("verify");
  const [errorMessage, setErrorMessage] = useState("");
  const [reason, setReason] = useState("");
  const [batteryInfo, setBatteryInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🛡️ Prevent double-click
  const [statusMessage, setStatusMessage] = useState(""); // Progress message
  const [waafiMessage, setWaafiMessage] = useState(""); // Waafi confirmation

  const [phone, setPhone] = useState("");
  const [agree1, setAgree1] = useState(true);

  const [errors, setErrors] = useState({});

  const handlePayment = async () => {
    // 🛡️ PREVENT DOUBLE-CLICK
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    const number = phone;
    const amount = Number(selectedAmount);
    let isSuccess = false;

    try {
      setProcessingStep("hold");
      setStatusMessage("Abuuraya hold-ka lacagta...");
      const res = await axios.post(
        `${BACKEND_URL}/api/pay/${STATION_CODE}`,
        {
          phoneNumber: number,
          amount: amount,
          stationCode: STATION_CODE,
        },
        {
          validateStatus: () => true, // Prevent axios from throwing error on 400/500
          timeout: PAYMENT_REQUEST_TIMEOUT_MS,
        },
      );

      const data = res.data;
      const waafiMsg = getWaafiMessage(data);

      if (res.status === 200 && data.success === true) {
        setProcessingStep("commit");
        setProcessingStatus("success");
        setBatteryInfo({ battery_id: data.battery_id, slot_id: data.slot_id });
        setWaafiMessage(waafiMsg || "Lacag bixinta waa guulaysatay!"); // Payment successful!
        setStatusMessage("");
        isSuccess = true;
      } else if (data.error) {
        // Handle backend error messages
        setProcessingStatus("failed");
        const errorMsg = data.error;
        setErrorMessage(mapBackendErrorMessage(errorMsg, waafiMsg));

        // Detect specific error types from message
        if (errorMsg.includes("No available battery")) {
          setReason("NO_BATTERY_AVAILABLE");
        } else if (errorMsg.includes("already have an active rental")) {
          setReason("ALREADY_RENTED");
        } else if (errorMsg.includes("battery is already rented")) {
          setReason("BATTERY_TAKEN");
        } else if (errorMsg.includes("blocked from renting")) {
          setReason("BLACKLISTED");
        } else if (
          errorMsg.includes("Payment not approved") ||
          errorMsg.includes("Payment hold not approved")
        ) {
          setReason("PAYMENT_FAILED");
        } else if (
          errorMsg.includes("blocked") ||
          errorMsg.includes("blacklist")
        ) {
          setReason("BLACKLISTED");
        } else {
          setReason("PAYMENT_FAILED");
        }
      } else {
        // Fallback for other error cases
        setProcessingStatus("failed");
        setReason("unknown_error");
        setErrorMessage("Khalad dhacay, fadlan mar kale isku day");
      }
      // 🛡️ Reset isSubmitting for failed payments (allow retry)
      if (!isSuccess) {
        setIsSubmitting(false);
      }
    } catch {
      // Catch block will rarely be triggered now unless there is a network failure
      setProcessingStatus("failed");
      setReason("network_error");
      setErrorMessage("Network error, please try again.");
      setIsSubmitting(false); // Reset on error
    }

    if (isSuccess) {
      setTimeout(() => {
        setShowProcessing(false);
        setProcessingStatus("processing");
        setProcessingStep("verify");
        setReason("");
        setErrorMessage("");
        setBatteryInfo(null);
        setWaafiMessage("");
        setStatusMessage("");
        setPhone("");
        setAgree1(false);
        setIsSubmitting(false); // Reset on success

        setErrors({});
        selectMethod(null);
      }, 5000);
    }
  };

  const isActiveMethod = (method) => selectedMethod === method;

  const validate = () => {
    const newErrors = {};
    if (!phone || phone.length < 7) {
      newErrors.phone = "Fadlan gali number sax ah (ugu yaraan 7 digit)";
    }
    if (!agree1) {
      newErrors.agree1 = "Fadlan ogolow shuruudaha koowaad";
    }

    return newErrors;
  };

  const getplaceholders_Input = () => {
    if (selectedMethod === "EVC Plus") return "61 xxxxx";
    if (selectedMethod === "ZAAD") return "63 xxxxx";
    if (selectedMethod === "SAHAL") return "37 xxxxx";
    return "Telefoon Numberka";
  };

  const handlePay = () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setShowProcessing(true);
      setProcessingStatus("processing");
      setProcessingStep("verify");
      setStatusMessage("Hubinaya macluumaadka...");
      handlePayment();
    }
  };

  return (
    <>
      {showProcessing && (
        <ProcessingModal
          status={processingStatus}
          errorMessage={errorMessage}
          reason={reason}
          batteryInfo={batteryInfo}
          statusMessage={statusMessage}
          waafiMessage={waafiMessage}
          processingStep={processingStep}
          onClose={() => setShowProcessing(false)}
        />
      )}

      {/* Amount to Pay */}
      <div className="mx-3 mt-4 rounded-2xl bg-violet-50/70 px-4 py-5 text-center shadow-sm sm:mx-4 sm:mt-5 sm:px-6 sm:py-6">
        <p className="text-sm font-semibold text-violet-500">
          Amount to Pay:
        </p>
        <p className="mt-2 text-4xl font-black text-violet-600 sm:text-5xl">
          ${selectedAmount.toFixed(2)}
        </p>
      </div>

      {/* Payment Method */}
      <div className="mx-3 mt-6 sm:mx-4">
        <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Habka Lacag Bixinta
        </p>
        <div className="grid grid-cols-3 gap-2.5 text-xs font-bold sm:gap-3">
          {["EVC Plus", "ZAAD", "SAHAL"].map((method) => (
            <button
              key={method}
              onClick={() => selectMethod(method)}
              className={`rounded-full px-3 py-2.5 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] sm:px-4 sm:py-3 ${
                isActiveMethod(method)
                  ? "bg-violet-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Phone Number Input */}
      <div className="mx-3 mt-5 sm:mx-4">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Telefoon Numberka
        </label>
        <div
          className={`flex overflow-hidden rounded-xl border shadow-sm transition-all focus-within:ring-2 focus-within:ring-violet-200 ${
            errors.phone
              ? "border-red-500 bg-red-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <span className="flex items-center gap-2 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700">
            <span aria-hidden="true">🇸🇴</span>
            +252
          </span>
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400"
            placeholder={getplaceholders_Input()}
          />
        </div>
        {errors.phone && (
          <p className="mt-2 text-xs font-medium text-red-600">
            {errors.phone}
          </p>
        )}
        <label className="mt-2 block text-xs text-gray-500">
          Fadlan Gali Numberka lacagta la Dirayo
        </label>
      </div>

      {/* Checkboxes */}
      <div className="mx-3 mt-5 sm:mx-4">
        <button
          type="button"
          onClick={() => setAgree1(!agree1)}
          className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left shadow-sm transition ${
            agree1
              ? "border-violet-400 bg-violet-50/60"
              : "border-gray-200 bg-white hover:border-violet-200"
          } ${errors.agree1 ? "border-red-400 dark:border-red-500" : ""}`}
        >
          {/* Custom Checkbox */}
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-md border-2 transition-all duration-200 flex-shrink-0 ${
              agree1
                ? "border-violet-500 bg-violet-500 text-white"
                : "border-gray-300 bg-white text-transparent"
            }`}
          >
            {agree1 && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>

          {/* Label Content */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">
              Waan ogolahay
            </span>
            <a
              href="/rules.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-medium text-violet-500 underline decoration-dotted underline-offset-2 hover:text-violet-600"
            >
              Shuruudaha iyo xeerarka isticmaalka Danab
            </a>
          </div>
        </button>
        {errors.agree1 && (
          <p className="mt-1 ml-1 text-xs text-red-500">{errors.agree1}</p>
        )}
      </div>

      {/* <div className="flex items-start mt-5 ml-3 mr-3 space-x-2">
        <input
          type="checkbox"
          checked={agree2}
          onChange={(e) => setAgree2(e.target.checked)}
          className="w-4 h-4 mt-0.5"
        />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Qofkale shuruudaha iyo xeerarka isticmaala Danab
          {errors.agree2 && (
            <p className="mt-1 text-xs text-red-500">{errors.agree2}</p>
          )}
        </span>
      </div> */}

      {/* Pay Button */}
      <div className="mx-3 sm:mx-4">
        <button
          onClick={handlePay}
          disabled={isSubmitting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-emerald-400 px-4 py-4 text-lg font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 sm:py-4"
        >
          {isSubmitting ? "Processing..." : "Bixi Hadda"}
          <FaLongArrowAltRight className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};

export default PaymentSection;
