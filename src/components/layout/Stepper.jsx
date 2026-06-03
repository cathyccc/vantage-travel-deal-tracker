import { Check } from "lucide-react"
import { Fragment } from "react";

const STEPS = ["Choose Flight", "Your Details", "Confirmation"]

export default function Stepper({ currentStep = 1 }) {
  return (
    <div className="bg-neutral-950 rounded-xl px-3 py-10">

      {/* circles + lines */}
      <div className="flex items-center w-full px-14">
        {STEPS.map((label, i) => {
          const completed = i < currentStep;
          const active = i === currentStep;
          const isLast = i === STEPS.length - 1;

          return (
            <Fragment key={i}>
              <div className={
                `w-6 h-6 rounded-full flex items-center justify-center shrink-0
                ${completed ? "bg-white border-2 border-white" : ""}
                ${active ? "border-2 border-white" : ""}
                ${!completed && !active ? "border-[2.5px] border-neutral-600" : ""}
              `}>
                {completed && <Check className="text-zinc-950 mt-[2px]" size={16} strokeWidth={3.5} />}
                {active && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>

              {!isLast && (
                <div className={`flex-1 h-[3px] ${completed ? "bg-white" : "bg-neutral-700"}`} />
              )}
            </Fragment>
          );
        })}
      </div>

      {/* labels */}
      <div className="flex w-full mt-2.5">
        {STEPS.map((label, i) => {
          const completed = i < currentStep;
          const active = i === currentStep;

          return (
            <div key={i} className="flex-1 flex justify-center">
              <span className={`text-xs font-semibold ${!completed && !active ? "text-neutral-500" : "text-white"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}