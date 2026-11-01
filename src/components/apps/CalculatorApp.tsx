"use client";

import { useState } from "react";

type Operator = "+" | "−" | "×" | "÷";

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1_000_000_000_000 || abs < 0.000001)) {
    return value.toExponential(6);
  }

  return String(parseFloat(value.toPrecision(12)));
}

function calculate(left: number, right: number, operator: Operator) {
  switch (operator) {
    case "+":
      return left + right;
    case "−":
      return left - right;
    case "×":
      return left * right;
    case "÷":
      return right === 0 ? Number.NaN : left / right;
    default:
      return right;
  }
}

export function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [stored, setStored] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [overwrite, setOverwrite] = useState(true);

  const inputDigit = (digit: string) => {
    if (overwrite) {
      setDisplay(digit);
      setOverwrite(false);
      return;
    }

    setDisplay((current) =>
      current === "0" ? digit : `${current}${digit}`.slice(0, 12),
    );
  };

  const inputDecimal = () => {
    if (overwrite) {
      setDisplay("0.");
      setOverwrite(false);
      return;
    }

    setDisplay((current) =>
      current.includes(".") ? current : `${current}.`,
    );
  };

  const clear = () => {
    setDisplay("0");
    setExpression("");
    setStored(null);
    setOperator(null);
    setOverwrite(true);
  };

  const toggleSign = () => {
    setDisplay((current) =>
      current === "0"
        ? current
        : current.startsWith("-")
          ? current.slice(1)
          : `-${current}`,
    );
  };

  const percent = () => {
    setDisplay(formatNumber(Number.parseFloat(display) / 100));
    setOverwrite(true);
  };

  const chooseOperator = (next: Operator) => {
    const currentValue = Number.parseFloat(display);

    if (operator && stored !== null && !overwrite) {
      const result = calculate(stored, currentValue, operator);
      setStored(result);
      setDisplay(formatNumber(result));
      setExpression(`${formatNumber(result)} ${next}`);
    } else {
      setStored(currentValue);
      setExpression(`${formatNumber(currentValue)} ${next}`);
    }

    setOperator(next);
    setOverwrite(true);
  };

  const equals = () => {
    if (operator === null || stored === null) {
      return;
    }

    const currentValue = Number.parseFloat(display);
    const result = calculate(stored, currentValue, operator);
    setExpression(
      `${formatNumber(stored)} ${operator} ${formatNumber(currentValue)} =`,
    );
    setDisplay(formatNumber(result));
    setStored(null);
    setOperator(null);
    setOverwrite(true);
  };

  const topButton =
    "bg-[#3a3a3d] text-zinc-100 hover:bg-[#46464a] active:bg-[#515156]";
  const numberButton =
    "bg-[#29292c] text-zinc-50 hover:bg-[#353538] active:bg-[#414145]";
  const operatorButton =
    "bg-[#ff9f0a] text-white hover:bg-[#ffad2f] active:bg-[#f09500]";

  return (
    <div className="flex h-full flex-col bg-[#161618] px-4 pb-4 pt-3">
      <div className="flex min-h-[100px] flex-col items-end justify-end px-2 pb-3">
        <span className="h-4 text-[11px] tracking-wide text-zinc-500">
          {expression}
        </span>
        <span
          className={`mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-right font-light tracking-[-0.055em] text-zinc-50 ${
            display.length > 8 ? "text-[38px]" : "text-[50px]"
          }`}
        >
          {display}
        </span>
      </div>

      <div className="grid flex-1 grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={clear}
          className={`rounded-full text-[17px] font-medium transition ${topButton}`}
          aria-label="Clear"
        >
          AC
        </button>
        <button
          type="button"
          onClick={toggleSign}
          className={`rounded-full text-[18px] font-medium transition ${topButton}`}
          aria-label="Toggle sign"
        >
          +/−
        </button>
        <button
          type="button"
          onClick={percent}
          className={`rounded-full text-[18px] font-medium transition ${topButton}`}
          aria-label="Percent"
        >
          %
        </button>
        <button
          type="button"
          onClick={() => chooseOperator("÷")}
          className={`rounded-full text-[22px] font-medium transition ${operatorButton} ${
            operator === "÷" ? "!bg-white !text-[#ff9f0a]" : ""
          }`}
          aria-label="Divide"
        >
          ÷
        </button>

        {["7", "8", "9"].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => inputDigit(digit)}
            className={`rounded-full text-[19px] font-medium transition ${numberButton}`}
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          onClick={() => chooseOperator("×")}
          className={`rounded-full text-[22px] font-medium transition ${operatorButton} ${
            operator === "×" ? "!bg-white !text-[#ff9f0a]" : ""
          }`}
          aria-label="Multiply"
        >
          ×
        </button>

        {["4", "5", "6"].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => inputDigit(digit)}
            className={`rounded-full text-[19px] font-medium transition ${numberButton}`}
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          onClick={() => chooseOperator("−")}
          className={`rounded-full text-[22px] font-medium transition ${operatorButton} ${
            operator === "−" ? "!bg-white !text-[#ff9f0a]" : ""
          }`}
          aria-label="Subtract"
        >
          −
        </button>

        {["1", "2", "3"].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => inputDigit(digit)}
            className={`rounded-full text-[19px] font-medium transition ${numberButton}`}
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          onClick={() => chooseOperator("+")}
          className={`rounded-full text-[22px] font-medium transition ${operatorButton} ${
            operator === "+" ? "!bg-white !text-[#ff9f0a]" : ""
          }`}
          aria-label="Add"
        >
          +
        </button>

        <button
          type="button"
          onClick={() => inputDigit("0")}
          className={`col-span-2 rounded-full pl-6 text-left text-[19px] font-medium transition ${numberButton}`}
        >
          0
        </button>
        <button
          type="button"
          onClick={inputDecimal}
          className={`rounded-full text-[19px] font-medium transition ${numberButton}`}
          aria-label="Decimal point"
        >
          .
        </button>
        <button
          type="button"
          onClick={equals}
          className={`rounded-full text-[21px] font-medium transition ${operatorButton}`}
          aria-label="Equals"
        >
          =
        </button>
      </div>
    </div>
  );
}
