import React, {useState, useEffect, useRef} from 'react';

const Flashcard = ({flashcard}) => {
    const [flip, setFlip] = useState(false);
    const [height, setHeight] = useState('initial');

    const frontEl = useRef();
    const backEl = useRef();

    const setMaxHeight = () => {
        const frontHeight = frontEl.current.getBoundingClientRect().height;
        const backHeight = backEl.current.getBoundingClientRect().height;
        setHeight(Math.max(frontHeight, backHeight, 100));
    }
    useEffect(setMaxHeight, [flashcard.question, flashcard.answer, flashcard.options]);
    useEffect(() => {
        window.addEventListener('resize', setMaxHeight);
        return () => window.removeEventListener('resize', setMaxHeight);
    }, [])
    return (
        <div 
            className={`card ${flip ? 'flip' : ''}`}
            onClick={() => setFlip(prevFlip => !prevFlip)}
            style={{height: height}}
        >
            <div className='front' ref={frontEl}>
                <h4>{flashcard.question}</h4>
                <hr />
                <div className='card-options'>
                    {flashcard.options.map(option => <div className='card-option' key={option}>{option}</div>)}
                </div>
            </div>
            <div className='back' ref={backEl}>{flashcard.answer}</div>
        </div>
    )
}

export default Flashcard