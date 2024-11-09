// app/components/QuestionList.js
import AnswerForm from "./AnswerForm";

export default function QuestionList({ questions, onAnswerSubmit }) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div key={question.id} className="border p-4 rounded-lg shadow">
          <h2 className="font-semibold">{question.question}</h2>
          <ul className="mt-2 space-y-2">
            {question.answers.map((answer, index) => (
              <li key={index} className="pt-2 border-t">{answer}</li>
            ))}
          </ul>
          <AnswerForm onSubmit={(answer) => onAnswerSubmit(question.id, answer)} />
        </div>
      ))}
    </div>
  );
}
