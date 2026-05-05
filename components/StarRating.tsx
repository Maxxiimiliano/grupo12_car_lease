"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}

export default function StarRating({ value, onChange, readonly = false }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          className={cn("focus:outline-none", !readonly && "cursor-pointer hover:scale-110 transition-transform")}
        >
          <Star
            className={cn("h-5 w-5", n <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
          />
        </button>
      ))}
    </div>
  );
}
