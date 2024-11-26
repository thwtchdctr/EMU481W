//backend api

export let questions = []; //Export questions array

/* @function -> handler(): Backend api request handle to process the GET and POST request for questions
 * @param -> req (request):  Incoming request object containg method and data
 * @param -> res (response): Outgoing response objec to send data back to the client
 */
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

