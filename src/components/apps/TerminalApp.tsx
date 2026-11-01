"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

type LineKind = "input" | "output" | "muted" | "error" | "pre";

type TerminalLine = {
  id: number;
  kind: LineKind;
  content: string;
};

const initialLines: TerminalLine[] = [
  {
    id: 1,
    kind: "muted",
    content: "NOVA OS 1.0 · nova-sh (browser simulation)",
  },
  {
    id: 2,
    kind: "muted",
    content: "Type 'help' to see available commands.",
  },
];

let lineId = 3;

function makeLine(kind: LineKind, content: string): TerminalLine {
  return { id: lineId++, kind, content };
}

export function TerminalApp() {
  const [lines, setLines] = useState<TerminalLine[]>(initialLines);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    const [command = "", ...args] = trimmed.split(/\s+/);
    const normalized = command.toLowerCase();

    if (!normalized) {
      return;
    }

    setHistory((current) => [...current, trimmed]);
    setHistoryIndex(-1);

    if (normalized === "clear") {
      setLines([]);
      return;
    }

    const next: TerminalLine[] = [
      makeLine("input", trimmed),
    ];

    switch (normalized) {
      case "help":
        next.push(
          makeLine(
            "output",
            [
              "Available commands:",
              "  help      Show this list",
              "  clear     Clear the terminal",
              "  date      Show today's date",
              "  time      Show the current time",
              "  whoami    Show the current user",
              "  ls        List files in the current directory",
              "  pwd       Print the working directory",
              "  echo      Print text",
              "  neofetch  Show system information",
            ].join("\n"),
          ),
        );
        break;
      case "date":
        next.push(makeLine("output", new Date().toDateString()));
        break;
      case "time":
        next.push(
          makeLine(
            "output",
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          ),
        );
        break;
      case "whoami":
        next.push(makeLine("output", "nova"));
        break;
      case "ls":
        next.push(
          makeLine(
            "output",
            "Applications   Desktop   Documents   Downloads   Pictures",
          ),
        );
        break;
      case "pwd":
        next.push(makeLine("output", "/Users/nova"));
        break;
      case "echo":
        next.push(makeLine("output", args.join(" ")));
        break;
      case "neofetch":
        next.push(
          makeLine(
            "pre",
            [
              "        ▄▄▄▄▄▄▄        nova@nova-os",
              "     ▄█████████████▄    ------------",
              "    ███████████████     OS: NOVA OS 1.0",
              "   █████████████████    Host: Browser",
              "   █████████████████    Kernel: WebKit",
              "    ███████████████     Shell: nova-sh",
              "     ▀████████████▀     Resolution: 1440x900",
              "        ▀▀▀▀▀▀▀         Terminal: nova-term",
            ].join("\n"),
          ),
        );
        break;
      default:
        next.push(
          makeLine(
            "error",
            `nova-sh: command not found: ${command}. Type 'help' for a list of commands.`,
          ),
        );
    }

    setLines((current) => [...current, ...next]);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runCommand(input);
    setInput("");
  };

  const handleHistory = (direction: -1 | 1) => {
    if (history.length === 0) {
      return;
    }

    const nextIndex =
      direction === -1
        ? Math.min(history.length - 1, historyIndex + 1)
        : Math.max(-1, historyIndex - 1);
    setHistoryIndex(nextIndex);
    setInput(nextIndex === -1 ? "" : history[history.length - 1 - nextIndex]);
  };

  return (
    <div
      className="flex h-full flex-col bg-[#0a0a0c] font-mono text-[11.5px] leading-relaxed text-zinc-300"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex h-8 shrink-0 items-center gap-2 border-b border-white/[0.05] bg-[#111114] px-3 text-[10px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
          nova@nova-os
        </span>
        <span className="text-zinc-700">—</span>
        <span>nova-sh</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-4 py-3">
        <div className="space-y-1">
          {lines.map((line) => {
            if (line.kind === "input") {
              return (
                <div key={line.id} className="flex gap-1.5">
                  <span className="text-emerald-400">nova@nova-os</span>
                  <span className="text-zinc-600">~</span>
                  <span className="text-sky-400">%</span>
                  <span className="text-zinc-100">{line.content}</span>
                </div>
              );
            }

            if (line.kind === "pre") {
              return (
                <pre
                  key={line.id}
                  className="whitespace-pre-wrap text-[10px] leading-[1.45] text-zinc-400"
                >
                  {line.content}
                </pre>
              );
            }

            return (
              <p
                key={line.id}
                className={`whitespace-pre-wrap ${
                  line.kind === "error"
                    ? "text-rose-400"
                    : line.kind === "muted"
                      ? "text-zinc-600"
                      : "text-zinc-400"
                }`}
              >
                {line.content}
              </p>
            );
          })}
        </div>
        <div ref={endRef} />
      </div>

      <form
        onSubmit={submit}
        className="flex shrink-0 items-center gap-1.5 border-t border-white/[0.05] bg-[#0d0d10] px-4 py-2.5"
      >
        <span className="text-emerald-400">nova@nova-os</span>
        <span className="text-zinc-600">~</span>
        <span className="text-sky-400">%</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              handleHistory(-1);
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              handleHistory(1);
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-zinc-100 caret-emerald-400 focus:outline-none"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal command"
        />
      </form>
    </div>
  );
}
