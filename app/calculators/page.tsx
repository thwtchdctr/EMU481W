"use client";

import { useState } from "react";

export default function CalculatorsPage() {
  return (
    <section>
      {/* Hero Section with Green Background */}
      <div className="relative h-64">
        {/* Ensure solid green background, removing any black */}
        <div className="absolute inset-0 bg-green-500"></div> {/* Background color */}
        <div className="relative flex items-center justify-center h-full p-8">
          <h1 className="text-5xl font-bold text-white">Financial Calculators</h1>
        </div>
      </div>

      {/* Calculator Section */}
      <section className="container mx-auto py-8 relative z-10">
        <div className="flex flex-col gap-8"> {/* Use flex with vertical layout */}
          <CompositeInterestCalculator />
          <YearsOfInvestingCalculator />
          <RetirementCalculator />
        </div>
      </section>
    </section>
  );
}

function CompositeInterestCalculator() {
  const [principal, setPrincipal] = useState(0);
  const [rate, setRate] = useState(0);
  const [time, setTime] = useState(0);
  const [compoundsPerYear, setCompoundsPerYear] = useState(1);
  const [futureValue, setFutureValue] = useState(0);

  const calculateCompositeInterest = () => {
    const rateDecimal = rate / 100;
    const result = principal * Math.pow(1 + rateDecimal / compoundsPerYear, compoundsPerYear * time);
    setFutureValue(result);
  };

  return (
    <div className="calculator-item bg-gradient-to-br from-green-50 to-teal-50 shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Composite Interest Calculator</h2>
      <div className="mb-4">
        <label className="text-teal-900 block">Principal ($):</label>
        <input
          type="number"
          className="input bg-white border border-teal-300 p-2 rounded w-full"
          value={principal}
          onChange={(e) => setPrincipal(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="text-teal-900 block">Annual Interest Rate (%):</label>
        <input
          type="number"
          className="input bg-white border border-teal-300 p-2 rounded w-full"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="text-teal-900 block">Years:</label>
        <input
          type="number"
          className="input bg-white border border-teal-300 p-2 rounded w-full"
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="text-teal-900 block">Compounds Per Year:</label>
        <input
          type="number"
          className="input bg-white border border-teal-300 p-2 rounded w-full"
          value={compoundsPerYear}
          onChange={(e) => setCompoundsPerYear(Number(e.target.value))}
        />
      </div>

      <button className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-4 py-2 rounded hover:from-teal-600 hover:to-green-600 shadow-lg transition-all" onClick={calculateCompositeInterest}>
        Calculate
      </button>
      <p className="mt-4 text-lg text-teal-800">Future Value: ${futureValue.toFixed(2)}</p>
    </div>
  );
}

function YearsOfInvestingCalculator() {
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [annualRate, setAnnualRate] = useState(0);
  const [years, setYears] = useState(0);
  const [futureValue, setFutureValue] = useState(0);

  const calculatePeriodicInvesting = () => {
    const rateDecimal = annualRate / 100;
    const result = monthlyContribution * (((Math.pow(1 + rateDecimal / 12, 12 * years) - 1) / (rateDecimal / 12)));
    setFutureValue(result);
  };

  return (
    <div className="calculator-item bg-gradient-to-br from-green-50 to-teal-50 shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Years of Investing (Periodic)</h2>
      <div className="mb-4">
        <label className="text-teal-900 block">Monthly Contribution ($):</label>
        <input
          type="number"
          className="input bg-white border border-teal-300 p-2 rounded w-full"
          value={monthlyContribution}
          onChange={(e) => setMonthlyContribution(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="text-teal-900 block">Annual Interest Rate (%):</label>
        <input
          type="number"
          className="input bg-white border border-teal-300 p-2 rounded w-full"
          value={annualRate}
          onChange={(e) => setAnnualRate(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="text-teal-900 block">Years:</label>
        <input
          type="number"
          className="input bg-white border border-teal-300 p-2 rounded w-full"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
        />
      </div>

      <button className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-4 py-2 rounded hover:from-teal-600 hover:to-green-600 shadow-lg transition-all" onClick={calculatePeriodicInvesting}>
        Calculate
      </button>
      <p className="mt-4 text-lg text-teal-800">Future Value: ${futureValue.toFixed(2)}</p>
    </div>
  );
}

function RetirementCalculator() {
  const [currentSavings, setCurrentSavings] = useState(0);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [yearsToRetirement, setYearsToRetirement] = useState(0);
  const [rate, setRate] = useState(0);
  const [retirementSavings, setRetirementSavings] = useState(0);

  const calculateRetirementSavings = () => {
    const rateDecimal = rate / 100;
    const monthlyRate = rateDecimal / 12;
    const futureValue = currentSavings * Math.pow(1 + monthlyRate, yearsToRetirement * 12) +
      (monthlyContribution * ((Math.pow(1 + monthlyRate, yearsToRetirement * 12) - 1) / monthlyRate));
    setRetirementSavings(futureValue);
  };

  return (
    <div className="calculator-item bg-gradient-to-br from-green-50 to-teal-50 shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Retirement Calculator</h2>
      <div className="mb-4">
        <label className="text-teal-900 block">Current Savings ($):</label>
        <input
          type="number"
          className="input bg-white border border-teal-300 p-2 rounded w-full"
          value={currentSavings}
          onChange={(e) => setCurrentSavings(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="text-teal-900 block">Monthly Contribution ($):</label>
        <input
          type="number"
          className="input bg-white border border-teal-300 p-2 rounded w-full"
          value={monthlyContribution}
          onChange={(e) => setMonthlyContribution(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="text-teal-900 block">Years to Retirement:</label>
        <input
          type="number"
          className="input bg-white border border-teal-300 p-2 rounded w-full"
          value={yearsToRetirement}
          onChange={(e) => setYearsToRetirement(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="text-teal-900 block">Annual Interest Rate (%):</label>
        <input
          type="number"
          className="input bg-white border border-teal-300 p-2 rounded w-full"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />
      </div>

      <button className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-4 py-2 rounded hover:from-teal-600 hover:to-green-600 shadow-lg transition-all" onClick={calculateRetirementSavings}>
        Calculate
      </button>
      <p className="mt-4 text-lg text-teal-800">Retirement Savings: ${retirementSavings.toFixed(2)}</p>
    </div>
  );
}



