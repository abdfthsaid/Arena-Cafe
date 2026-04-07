import { useEffect } from "react";
import { FaRegCreditCard } from "react-icons/fa";
import { MdCheckCircle, MdError } from "react-icons/md";

const PROCESSING_STEPS = [
  { key: "verify", label: "Hubinta" },
  { key: "hold", label: "Hold" },
  { key: "unlock", label: "Battery" },
  { key: "commit", label: "Commit" },
];

const ProcessingModal = ({
  status = "processing",
  errorMessage,
  reason,
  batteryInfo,
  statusMessage,
  waafiMessage,
  processingStep = "verify",
  onClose,
}) => {
  // Auto-close for battery-related errors
  useEffect(() => {
    if (reason === "NO_BATTERY_AVAILABLE" || reason === "no_battery") {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [reason, onClose]);

  // Error display configuration
  const getErrorDisplay = () => {
    const apiMessage = errorMessage || "Something went wrong. Try again.";

    const errorConfigs = {
      PAYMENT_FAILED: {
        title: "Lacag bixinta ma dhicin",
        iconColor: "text-red-500",
        titleColor: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
      NO_BATTERY_AVAILABLE: {
        title: "Ma jiro baytari diyaar ah",
        iconColor: "text-yellow-500",
        titleColor: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      },
      BLACKLISTED: {
        title: "Digniin!",
        iconColor: "text-orange-500",
        titleColor: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      },
      network_error: {
        title: "Network Error",
        iconColor: "text-red-500",
        titleColor: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
    };

    const config = errorConfigs[reason] || {
      title: "Payment Failed",
      iconColor: "text-red-500",
      titleColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    };

    return {
      ...config,
      message: apiMessage,
    };
  };

  // Content rendering based on status
  const renderProcessingContent = () => (
    <>
      <h2 className="mb-2 text-3xl font-black tracking-tight text-slate-900">
        Lacag bixinta
      </h2>
      <p className="mt-2 text-xl text-slate-500">EVC Plus • $0.75</p>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        Waafi hold first, battery unlock second, commit last.
      </p>

      <div className="mt-6 flex items-start justify-between gap-2">
        {PROCESSING_STEPS.map((step, index) => {
          const activeStepIndex = PROCESSING_STEPS.findIndex(
            (item) => item.key === processingStep,
          );
          const isActive = index === activeStepIndex;
          const isDone = index < activeStepIndex;

          return (
            <div
              key={step.key}
              className="flex min-w-0 flex-1 flex-col items-center"
            >
              <div className="flex w-full items-center justify-center">
                {index > 0 && (
                  <span className="mr-2 h-[3px] w-full rounded-full bg-slate-200" />
                )}

                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-lg font-semibold transition ${
                    isActive
                      ? "border-blue-300 bg-blue-300/80 text-white"
                      : isDone
                        ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                        : "border-slate-200 bg-slate-200 text-slate-400"
                  }`}
                >
                  {isActive ? (
                    <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : isDone ? (
                    "✓"
                  ) : (
                    index + 1
                  )}
                </span>

                {index < PROCESSING_STEPS.length - 1 && (
                  <span className="ml-2 h-[3px] w-full rounded-full bg-slate-200" />
                )}
              </div>

              <p className="mt-3 text-lg font-medium text-slate-600">
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {statusMessage && (
        <p className="mb-4 mt-8 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-4 text-lg font-semibold text-blue-700">
          {statusMessage}
        </p>
      )}
      <p className="mb-6 text-sm leading-6 text-slate-500">
        Waafi hold, battery unlock, kadib commit ayaa socda...
      </p>
      <div className="flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-violet-500 border-t-transparent animate-spin">
          <FaRegCreditCard className="text-2xl text-violet-500" />
        </div>
      </div>
    </>
  );

  const renderSuccessContent = () => (
    <>
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
        <MdCheckCircle className="text-4xl text-green-600" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-green-700">Guul!</h2>
      {waafiMessage && (
        <div className="p-3 mb-3 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg">
          {waafiMessage}
        </div>
      )}
      <p className="mb-2 text-sm text-gray-500">
        Lacag bixinta waa guulaysatay!
      </p>
      {batteryInfo && (
        <p className="text-sm text-gray-600">
          Battery <strong>{batteryInfo.battery_id}</strong> waa la furay Slot{" "}
          <strong>{batteryInfo.slot_id}</strong>.
        </p>
      )}
    </>
  );

  const renderErrorContent = () => {
    const errorDisplay = getErrorDisplay();

    return (
      <>
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <MdError className={`text-4xl ${errorDisplay.iconColor}`} />
        </div>
        <h2 className={`mb-2 text-2xl font-bold ${errorDisplay.titleColor}`}>
          {errorDisplay.title}
        </h2>
        <div
          className={`p-3 mb-4 text-sm text-gray-700 rounded-lg ${errorDisplay.bgColor} border ${errorDisplay.borderColor}`}
        >
          {errorDisplay.message}
        </div>
      </>
    );
  };

  const renderContent = () => {
    switch (status) {
      case "processing":
        return renderProcessingContent();
      case "success":
        return renderSuccessContent();
      case "failed":
        return renderErrorContent();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,#ede9fe,#f0ebff_35%,#f8f8ff)] px-4 py-8">
      <div className="relative w-full max-w-sm rounded-[28px] border border-white/60 bg-white/90 p-6 text-center shadow-[0_25px_70px_rgba(94,46,140,.25)] backdrop-blur-md">
        {/* Close Button */}
        <button
          className="absolute text-xl text-gray-500 top-3 right-3 hover:text-black transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Modal Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default ProcessingModal;
