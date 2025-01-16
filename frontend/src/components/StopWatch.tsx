'use client'

import {useState, useEffect} from "react";

export default function StopWatch() {
    const [time, setTime] = useState(300);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (isRunning) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (!isRunning && timer) {
            clearInterval(timer);
        }
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isRunning]);


    const formatTime = (time: number) => {
        const getSeconds = `0${time % 60}`.slice(-2);
        const minutes = Math.floor(time / 60);
        const getMinutes = `0${minutes % 60}`.slice(-2);
        // const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
        // return `${getHours}:${getMinutes}:${getSeconds}`;
        return `${getMinutes}:${getSeconds}`;
    };


    return (
        <div id="stopwatch" className="container text-center">
            <div className="row">
                <button className="btn btn-primary col" onClick={() => setIsRunning(!isRunning)}>
                    {isRunning ? "Pause" : "Start"}
                </button>
                <h1 className="col text-bg-secondary p-2 m-0">{formatTime(time)}</h1>
                <button className="btn btn-danger col" onClick={() => {
                    setTime(300);
                    setIsRunning(false);
                }}>
                    Reset
                </button>
            </div>
        </div>
    );
}