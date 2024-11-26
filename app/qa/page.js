//Client component
"use client";

//Import statements
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

//News category tags
const tags = ["Finance", "Real Estate", "Stock Market", "Investments", "Banking", "Economy"];

/* @QAForm() -> React component for the QA form. Provides input fields for uses to type their questions and select tags.
   @params -> onSubmit: Callback function called when form is submitted
   @returns -> JSX UI representing question submission form
 */
const QAForm = ({ onSubmit }) => {
  //state variables to represent questions and tags
  const [question, setQuestion] = useState("");
  const [tags, setTags] = useState([]);

  /* @handleTagChange() -> Function to handle the addition and removal of tags
     @params -> e: event of a tag checkbox being clicked/unclicked
   */
  const handleTagChange = (e) => {
    const value = e.target.value;
    if (tags.includes(value)) {
      setTags(tags.filter((tag) => tag !== value));
    } else {
      setTags([...tags, value]);
    }
  };

  /* @handleSubmit() -> Function to handle the submission of the question form
     @params -> e: event triggered when form is submitted
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question, tags);
      setQuestion("");
      setTags([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="question" className="block text-white">
          Your Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 mt-2 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary"
          rows="4"
          placeholder="Type your question here"
        />
      </div>

      <div className="space-x-2">
        {tags.map((tag) => (
          <label key={tag} className="inline-flex items-center text-white">
            <input
              type="checkbox"
              value={tag}
              checked={tags.includes(tag)}
              onChange={handleTagChange}
              className="form-checkbox text-secondary"
            />
            <span className="ml-2">{tag}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="mt-4 bg-teal-400 text-white px-6 py-2 rounded-full hover:bg-teal-500"
      >
        Submit Question
      </button>
    </form>
  );
};

const QA = () => {
  const [user, setUser] = useState(null); // User authentication state
  const [questions, setQuestions] = useState([]);
  const [newAnswer, setNewAnswer] = useState(""); // For posting answers
  const [selectedQuestion, setSelectedQuestion] = useState(null); // For viewing answers

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    fetchQuestions(); // Fetch questions from Firestore on load

    return () => unsubscribe();
  }, []);

  const fetchQuestions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const questionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(questionsData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleNewQuestion = async (question, tags) => {
    try {
      await addDoc(collection(db, "questions"), {
        question,
        tags,
        answers: [],
        createdAt: new Date(),
      });
      fetchQuestions(); // Refresh the questions list
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleNewAnswer = async () => {
    if (!selectedQuestion || !newAnswer.trim()) return;

    try {
      const questionDocRef = doc(db, "questions", selectedQuestion.id);
      await updateDoc(questionDocRef, {
        answers: arrayUnion({
          answer: newAnswer,
          author: user.displayName,
          timestamp: new Date(),
        }),
      });
      setNewAnswer(""); // Clear input
      fetchQuestions(); // Refresh the questions list
    } catch (error) {
      console.error("Error posting answer:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <header className="bg-teal-400 py-10 text-center">
        <h1 className="text-5xl font-bold mb-4 text-accent">Ask Questions</h1>
        <p className="text-lg mb-6">
          View or contribute to financial discussions.
        </p>
      </header>

      {/* Main Content */}
      <div className="container mx-auto py-10 px-6">
        {/* Question Form */}
        {user ? (
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-10">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Create New Question
            </h2>
            <QAForm onSubmit={handleNewQuestion} />
          </div>
        ) : (
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700">
              Log in to post questions or answers.
            </p>
          </div>
        )}

        {/* Questions List */}
        <div className="mt-10">
          {questions.map((question) => (
            <div
              key={question.id}
              className="bg-white p-4 rounded-lg shadow-lg mb-6"
            >
              <p className="font-semibold text-lg">{question.question}</p>
              <div className="flex space-x-2 mt-2">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-300 rounded-full text-sm text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedQuestion(question)}
                className="mt-2 bg-teal-400 text-white px-4 py-2 rounded-md hover:bg-teal-500"
              >
                View Answers
              </button>
            </div>
          ))}
        </div>

        {/* Answers Section */}
        {selectedQuestion && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Answers for: {selectedQuestion.question}
            </h3>
            <div className="space-y-4 mb-6">
              {selectedQuestion.answers.length > 0 ? (
                selectedQuestion.answers.map((answer, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-800">{answer.answer}</p>
                    <p className="text-sm text-gray-600">
                      — {answer.author},{" "}
                      {new Date(answer.timestamp?.seconds * 1000).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No answers yet.</p>
              )}
            </div>

            {user && (
              <div className="space-y-4">
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary"
                  rows="4"
                  placeholder="Type your answer here"
                />
                <button
                  onClick={handleNewAnswer}
                  className="bg-teal-400 text-white px-6 py-2 rounded-full hover:bg-teal-500"
                >
                  Submit Answer
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QA;
