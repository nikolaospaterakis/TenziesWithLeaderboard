import React from "react"


export default function Timer(props){
    return (
        <p className="timer">Time: {props.recordTime}</p>
    )
}