"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-theme.css";

export type CalendarValue = Date | null | [Date | null, Date | null];

interface Props {
  value: CalendarValue;
  onChange: (value: CalendarValue) => void;
}

export default function CalendarPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  function formatLabel(value: CalendarValue): string {
    if (!value) return "Select date";

    if (value instanceof Date) {
      return value.toDateString();
    }

    const [start, end] = value;
    if (start && end) {
      return `${start.toDateString()} — ${end.toDateString()}`;
    }

    if (start && !end) {
      return `${start.toDateString()} → …`;
    }

    return "Select date";
  }

  return (
    <div className="relative">
      {/* Collapsed Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 border border-[#EBECCC] bg-[#FFFDF7] rounded-xl text-[#3A3A3A] hover:bg-[#FFF9E2] shadow-sm"
      >
        <span className="flex items-center gap-2">
          <span>📅</span>
          <span>{formatLabel(value)}</span>
        </span>
        <span className="text-[#DCA278]">{open ? "▲" : "▼"}</span>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 bg-white border border-[#EBECCC] rounded-xl shadow-xl p-3">
          <Calendar
            onChange={(v) => {
              onChange(v);
              // Auto-close if range selected
              if (Array.isArray(v) && v[0] && v[1]) {
                setOpen(false);
              }
            }}
            value={value}
            selectRange={true}
            className="rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
