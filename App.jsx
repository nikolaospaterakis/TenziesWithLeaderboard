import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import Timer from "./Timer"
import Leaderboard from "./Leaderboard"
import {
    onSnapshot,
    addDoc,
    doc,
    deleteDoc,
    setDoc
} from "firebase/firestore"
import { leaderboard, db } from "./firebase"

export default function App() {
    
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [recordTime, setRecordTime] = React.useState("00:00")
    const [isRecording, setIsRecording] = React.useState(true)
    const [minutes, setMinutes] = React.useState(0)
    const [seconds, setSeconds] = React.useState(1)
    const [scores, setScores] = React.useState([])
    const [name, setName] = React.useState("")
    const [dontShowForm, setDontShowForm] = React.useState(true)
    
    React.useEffect(() => {
        const unsubscribe = onSnapshot(leaderboard, function (snapshot) {
            const scoresArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setScores(scoresArr)
        })
        return unsubscribe
    }, [])
    
    const sortedScoresByRolls = scores.sort((a, b) => a.rolls - b.rolls)
    
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setIsRecording(prevValue => !prevValue)
            setDontShowForm(prevValue => !prevValue)
        }
    }, [dice])
    
    async function createNewScore(){
            const newScore = {
                name: name,
                rolls: rolls,
                time: recordTime
            }
            const newScoreRef = await addDoc(leaderboard, newScore)
    }

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function addMinute(){
        setMinutes(prevMinutes => prevMinutes + 1) 
        setSeconds(0)
    }
    
    React.useEffect(() => {
        if(isRecording){
            setTimeout(() => {
                if(minutes < 10){
                    if(seconds < 59){
                       setSeconds(prevSeconds => prevSeconds + 1)  
                    } else {
                        addMinute()
                    }
                } else {
                   addMinute()
                }
                setRecordTime(() => (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds)  
            }, 1000)
        }
        else {
            return recordTime
        }
    }, [seconds])
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setRolls(prevRolls => prevRolls + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setRolls(0)
            setTenzies(false)
            setDice(allNewDice())
            setMinutes(0)
            setSeconds(0)
            setIsRecording(prevValue => !prevValue)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    function submitScore(event){
        createNewScore()
        setDontShowForm(prevValue => !prevValue)
        event.preventDefault();
    }
    
    function handleChange(event){
        const {value} = event.target
        setName(value)   
    }
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))

    return (
        <div>
            <main>
                {tenzies && <Confetti />}
                <h1 className="title">Tenzies</h1>
                <p className="instructions">Roll until all dice are the same. 
                Click each die to freeze it at its current value between rolls.</p>
                <div className="dice-container">
                    {diceElements}
                </div>
                <button 
                    className="roll-dice" 
                    onClick={rollDice}
                >
                    {tenzies ? "New Game" : "Roll"}
                </button>
                <p className="rolls">Rolls: {rolls}</p>
                <form className={dontShowForm ? "hidden" : ""} onSubmit={submitScore}>
                    <h3>Give me your name</h3>
                    <input value={name} onChange={handleChange}/>
                    <input type="submit" value="Submit" />
                </form>
            </main>
            <Leaderboard
                scores={sortedScoresByRolls}
            />
            <Timer 
                    recordTime={recordTime}
            />
        </div>
    )
}