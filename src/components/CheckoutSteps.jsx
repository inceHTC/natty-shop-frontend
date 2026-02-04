import { Check } from "lucide-react";

const STEPS = ["Adres", "Ödeme", "Onay"];


export default function CheckoutSteps({ currentStep }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        {STEPS.map((label, i) => {
          const done = i < currentStep;
          const active = i === currentStep;

          return (
            <div key={label} className="flex-1 flex items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                  ${
                    done
                      ? "bg-green-600 text-white"
                      : active
                      ? "bg-black text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
              >
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </div>

              <span
                className={`ml-3 text-sm font-medium ${
                  active || done ? "text-black" : "text-slate-400"
                }`}
              >
                {label}
              </span>

              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-4 ${
                    done ? "bg-green-600" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
