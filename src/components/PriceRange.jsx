import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PriceRange({
  min = 0,
  max = 5000,
  step = 50,
}) {
  const [params, setParams] = useSearchParams();

  const initialMin = Number(params.get("minPrice")) || min;
  const initialMax = Number(params.get("maxPrice")) || max;

  const [range, setRange] = useState([initialMin, initialMax]);

  // URL → STATE SENKRON
  useEffect(() => {
    setRange([
      Number(params.get("minPrice")) || min,
      Number(params.get("maxPrice")) || max,
    ]);
  }, [params, min, max]);

  // DEBOUNCE (PERFORMANS + PREMIUM)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (range[0] !== min) params.set("minPrice", range[0]);
      else params.delete("minPrice");

      if (range[1] !== max) params.set("maxPrice", range[1]);
      else params.delete("maxPrice");

      setParams(params);
    }, 400);

    return () => clearTimeout(timer);
  }, [range]);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-slate-600">
        <span>{range[0]} ₺</span>
        <span>{range[1]} ₺</span>
      </div>

      {/* MIN */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={range[0]}
        onChange={(e) =>
          setRange([Number(e.target.value), range[1]])
        }
        className="w-full"
      />

      {/* MAX */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={range[1]}
        onChange={(e) =>
          setRange([range[0], Number(e.target.value)])
        }
        className="w-full"
      />
    </div>
  );
}
