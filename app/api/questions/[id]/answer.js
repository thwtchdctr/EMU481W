// app/api/questions/[id]/answer.js

import { questions } from "../../questions"; // Import the questions array

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === "POST") {
    const { answer } = req.body;
    const question = questions.find((q) => q.id === id);
    if (question) {
      question.answers.push(answer);
      res.status(200).json(question);
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

