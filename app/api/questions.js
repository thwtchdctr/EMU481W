// app/api/questions.js

export let questions = []; // Export questions array

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(questions);
  } else if (req.method === "POST") {
    const { question } = req.body;
    const newQuestion = { id: Date.now().toString(), question, answers: [] };
    questions.push(newQuestion);
    res.status(201).json(newQuestion);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

