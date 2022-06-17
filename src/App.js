import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import { MdQuiz } from 'react-icons/md';
import FlashcardList from "./FlashcardList";
import './App.css';


function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);

  const selectEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then((res) => {
        setCategories(res.data.trivia_categories);
      });
  }, [])

  const decodeString = (str) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.textContent;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
    .get("https://opentdb.com/api.php", {
      params: {
        amount: amountEl.current.value,
        category: selectEl.current.value
      }
    })
    .then(res => {
      setFlashcards(res.data.results.map((questionItem, index) => {
        const answer = decodeString(questionItem.correct_answer);
        const options = [
          answer, 
          ...questionItem.incorrect_answers.map(a => decodeString(a))];
        return {
          id: `${index}-${Date.now()}`,
          question: decodeString(questionItem.question),
          answer: answer,
          options: options.sort(() => Math.random() - 0.5)
        }
      }));
    })
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <span className="logo">
          <MdQuiz />
          Quiz
        </span>
        <div className="input-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={selectEl}>
            {categories.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="amount">Amount of questions</label>
          <input type='number' id='amount' min='1' step='1' defaultValue='10' ref={amountEl}/>
        </div>
        <div className="input-group">
          <button className="btn">Generate</button>
        </div>
      </form>
      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  );
}

export default App;
