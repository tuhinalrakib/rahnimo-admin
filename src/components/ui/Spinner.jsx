"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Spinner({ className }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2
        className={cn("w-8 h-8 animate-spin text-primary", className)}
      />
    </div>
  );
}
