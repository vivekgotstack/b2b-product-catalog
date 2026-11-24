"use client";

import { useRef } from "react";

export function StaffEntrance() {
  const clicks = useRef(0);

  return (
    <button
      type="button"
      className="staff-entrance"
      aria-label="Staff access. Activate eight times to open sign-in."
      onClick={() => {
        clicks.current += 1;
        if (clicks.current === 8) window.location.assign("/login/");
      }}
    >
      <span aria-hidden="true" />
    </button>
  );
}
