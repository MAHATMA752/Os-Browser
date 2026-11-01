"use client";

import { BrowserApp } from "@/components/apps/BrowserApp";
import { CalculatorApp } from "@/components/apps/CalculatorApp";
import { CalendarApp } from "@/components/apps/CalendarApp";
import { FinderApp } from "@/components/apps/FinderApp";
import { NotesApp } from "@/components/apps/NotesApp";
import { SettingsApp } from "@/components/apps/SettingsApp";
import { TerminalApp } from "@/components/apps/TerminalApp";
import { TrashApp } from "@/components/apps/TrashApp";
import type { AppId } from "@/lib/apps";

export function AppContent({
  appId,
  windowId,
}: {
  appId: AppId;
  windowId: string;
}) {
  switch (appId) {
    case "finder":
      return <FinderApp key={windowId} />;
    case "browser":
      return <BrowserApp key={windowId} />;
    case "terminal":
      return <TerminalApp key={windowId} />;
    case "notes":
      return <NotesApp key={windowId} />;
    case "calculator":
      return <CalculatorApp key={windowId} />;
    case "calendar":
      return <CalendarApp key={windowId} />;
    case "settings":
      return <SettingsApp key={windowId} />;
    case "trash":
      return <TrashApp key={windowId} />;
    default:
      return null;
  }
}
