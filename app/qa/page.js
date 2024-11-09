// app/qa/page.js

"use client";

import { useEffect, useState } from "react";
import QAForm from "../components/QAForm";
import QuestionList from "../components/QuestionList";

export default function QA() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedQuestions = JSON.parse(localStorage.getItem("questions"));
      if (savedQuestions) {
        setQuestions(savedQuestions);
      } else {
        fetchQuestions();
      }
    }
  }, []);

  const fetchQuestions = async () => {
    const res = await fetch("/api/questions");
    const data = await res.json();
    setQuestions(data);
    if (typeof window !== "undefined") {
      localStorage.setItem("questions", JSON.stringify(data));
    }
  };

  const handleNewQuestion = async (question) => {
    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const newQuestion = await res.json();

    // Update state immediately with new question
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions, newQuestion];
      if (typeof window !== "undefined") {
        localStorage.setItem("questions", JSON.stringify(updatedQuestions));
      }
      return updatedQuestions;
    });
  };

  const handleNewAnswer = async (questionId, answer) => {
    await fetch(`/api/questions/${questionId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });
    fetchQuestions(); // Refresh questions after adding an answer
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-4">QA</h1>
      <QAForm onSubmit={handleNewQuestion} />
      <QuestionList questions={questions} onAnswerSubmit={handleNewAnswer} />
    </div>
  );
}

