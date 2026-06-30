const { useState, useEffect, useRef } = React;

const QUESTIONS = [
  {
    id: 1,
    question: "Which hook is used to manage side effects in React?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correct: 1,
  },
  {
    id: 2,
    question: "What does the virtual DOM do?",
    options: [
      "Directly updates the browser DOM",
      "Acts as a lightweight copy of the real DOM for diffing",
      "Stores component state",
      "Handles HTTP requests",
    ],
    correct: 1,
  },
  {
    id: 3,
    question: "Which method is used to render a React app to the DOM?",
    options: [
      "React.render()",
      "ReactDOM.createRoot().render()",
      "document.render()",
      "ReactDOM.mount()",
    ],
    correct: 1,
  },
  {
    id: 4,
    question: "What is a closure in JavaScript?",
    options: [
      "A function that has access to its outer scope even after the outer function has returned",
      "A way to close a browser window",
      "A CSS property",
      "An HTML tag",
    ],
    correct: 0,
  },
  {
    id: 5,
    question: "What does `===` check in JavaScript?",
    options: ["Value only", "Reference only", "Value and type", "Type only"],
    correct: 2,
  },
  {
    id: 6,
    question:
      "Which array method returns a new array without mutating the original?",
    options: ["push()", "splice()", "sort()", "map()"],
    correct: 3,
  },
  {
    id: 7,
    question: "What is the output of `typeof null` in JavaScript?",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    correct: 2,
  },
  {
    id: 8,
    question: "Which HTTP method is typically used to create a resource?",
    options: ["GET", "PUT", "POST", "DELETE"],
    correct: 2,
  },
];

const TIME_PER_QUESTION = 20;

function QuizApp() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [quizDone, setQuizDone] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (answered || quizDone) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentQ, answered, quizDone]);

  function handleTimeout() {
    setAnswered(true);
    setUserAnswers((prev) => [
      ...prev,
      { question: QUESTIONS[currentQ], selected: null, correct: false },
    ]);
  }

  function handleAnswer(optionIndex) {
    if (answered) return;
    setSelectedAnswer(optionIndex);
    setAnswered(true);
    clearInterval(timerRef.current);

    const isCorrect = optionIndex === QUESTIONS[currentQ].correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        question: QUESTIONS[currentQ],
        selected: optionIndex,
        correct: isCorrect,
      },
    ]);
  }

  function nextQuestion() {
    if (currentQ + 1 >= QUESTIONS.length) {
      setQuizDone(true);
      return;
    }
    setCurrentQ((prev) => prev + 1);
    setSelectedAnswer(null);
    setAnswered(false);
    setTimeLeft(TIME_PER_QUESTION);
  }

  function restartQuiz() {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setTimeLeft(TIME_PER_QUESTION);
    setQuizDone(false);
    setUserAnswers([]);
  }

  if (quizDone) {
    const percentage = Math.round((score / QUESTIONS.length) * 100);

    return (
      <div className="quiz-container">
        <div className="result-screen">
          <h2>Quiz Complete!</h2>
          <div className="score-circle">
            {score}/{QUESTIONS.length}
          </div>
          <p>
            You scored {percentage}% —{" "}
            {percentage >= 70 ? "Great job! 🎉" : "Keep practicing!"}
          </p>
          <button className="btn btn-primary" onClick={restartQuiz}>
            Restart Quiz
          </button>
          <div className="review-list">
            <h3 style={{ marginBottom: "12px", marginTop: "20px" }}>Review</h3>
            {userAnswers.map((ans, i) => (
              <div
                key={i}
                className={`review-item ${ans.correct ? "correct-ans" : "wrong-ans"}`}
              >
                <strong>Q{i + 1}:</strong> {ans.question.question}
                <br />
                <span>
                  Your answer:{" "}
                  {ans.selected !== null
                    ? ans.question.options[ans.selected]
                    : "Timed out"}
                </span>
                <br />
                <span>
                  Correct: {ans.question.options[ans.question.correct]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentQ];
  const progressPct = ((currentQ + 1) / QUESTIONS.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <span className="question-num">
          Question {currentQ + 1} of {QUESTIONS.length}
        </span>
        <span className="timer">⏱ {timeLeft}s</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>
      <div className="question-text">{question.question}</div>
      <div className="options">
        {question.options.map((opt, i) => {
          let cls = "option";
          if (answered) {
            if (i === question.correct) cls += " correct";
            else if (i === selectedAnswer) cls += " wrong";
          } else if (i === selectedAnswer) {
            cls += " selected";
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleAnswer(i)}
              disabled={answered}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <button
        className="btn btn-primary"
        onClick={nextQuestion}
        disabled={!answered}
      >
        {currentQ + 1 === QUESTIONS.length ? "See Results" : "Next Question"}
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<QuizApp />);
