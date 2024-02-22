import React from "react"

export default function Leaderboard(props){
    const scoreElements = props.scores.map(score => (
        <div className="ld-inf" key={score.id}>
            <p>{score.name}</p>
            <p>{score.time}</p>
            <p>{score.rolls}</p>
        </div>
    ))
    
    return (
        <section>
            <h3>Leaderboard</h3>
            {scoreElements}
        </section>
    )
}