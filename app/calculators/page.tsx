"use client";

import { useState } from 'react';

export default function CalculatorsPage() {
  return (
      <section className="flex flex-col">
          {/* Hero section with background image and Financial Calculators text */}
          <div className="relative h-64 bg-hero-image bg-cover bg-center">
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="relative z-10 flex items-center justify-center h-full">
                  <h1 className="text-5xl font-bold text-white">Financial Calculators</h1>
              </div>
          </div>

          {/* Main section containing the calculators */}
          <section className="container mx-auto py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    <div className="calculator-item bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Composite Interest Calculator</h2>
      <label>Principal ($):</label>
      <input
        type="number"
        className="input mb-4"
        value={principal}
        onChange={(e) => setPrincipal(Number(e.target.value))}
      />

      <label>Annual Interest Rate (%):</label>
      <input
        type="number"
        className="input mb-4"
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
      />

      <label>Years:</label>
      <input
        type="number"
        className="input mb-4"
        value={time}
        onChange={(e) => setTime(Number(e.target.value))}
      />

      <label>Compounds Per Year:</label>
      <input
        type="number"
        className="input mb-4"
        value={compoundsPerYear}
        onChange={(e) => setCompoundsPerYear(Number(e.target.value))}
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={calculateCompositeInterest}>
        Calculate
      </button>
      <p className="mt-4 text-lg text-gray-800">Future Value: ${futureValue.toFixed(2)}</p>
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
    <div className="calculator-item bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Years of Investing (Periodic)</h2>
      <label>Monthly Contribution ($):</label>
      <input
        type="number"
        className="input mb-4"
        value={monthlyContribution}
        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
      />

      <label>Annual Interest Rate (%):</label>
      <input
        type="number"
        className="input mb-4"
        value={annualRate}
        onChange={(e) => setAnnualRate(Number(e.target.value))}
      />

      <label>Years:</label>
      <input
        type="number"
        className="input mb-4"
        value={years}
        onChange={(e) => setYears(Number(e.target.value))}
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={calculatePeriodicInvesting}>
        Calculate
      </button>
      <p className="mt-4 text-lg text-gray-800">Future Value: ${futureValue.toFixed(2)}</p>
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
    <div className="calculator-item bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Retirement Calculator</h2>
      <label>Current Savings ($):</label>
      <input
        type="number"
        className="input mb-4"
        value={currentSavings}
        onChange={(e) => setCurrentSavings(Number(e.target.value))}
      />

      <label>Monthly Contribution ($):</label>
      <input
        type="number"
        className="input mb-4"
        value={monthlyContribution}
        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
      />

      <label>Years to Retirement:</label>
      <input
        type="number"
        className="input mb-4"
        value={yearsToRetirement}
        onChange={(e) => setYearsToRetirement(Number(e.target.value))}
      />

      <label>Annual Interest Rate (%):</label>
      <input
        type="number"
        className="input mb-4"
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={calculateRetirementSavings}>
        Calculate
      </button>
      <p className="mt-4 text-lg text-gray-800">Retirement Savings: ${retirementSavings.toFixed(2)}</p>
    </div>
  );
}

