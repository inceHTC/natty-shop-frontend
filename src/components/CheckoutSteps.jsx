import { Truck, CreditCard } from "lucide-react";

const STEPS = [
  { id: 0, label: "Teslimat Adresi", icon: Truck },
  { id: 1, label: "Ödeme", icon: CreditCard },
];

export default function CheckoutSteps({ currentStep = 0 }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isPast = currentStep > step.id;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                isActive
                  ? "border-[var(--color-text-main)] bg-[var(--color-text-main)] text-white"
                  : isPast
                  ? "border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)]"
                  : "border-[var(--color-border)] text-[var(--color-text-muted)]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {step.label}
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  isPast ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]"
                }`}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
