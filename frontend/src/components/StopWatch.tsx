'use client'

import {useState, useEffect} from "react";

export default function StopWatch() {
    const duration = 300;
    const [time, setTime] = useState(duration);
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
        <div id="stopwatch" className="container text-center" style={{width: '14rem'}}>
            <div className="row m-0 p-0">
                <button className="col-3 btn btn-sm btn-primary p-0 m-0" onClick={() => setIsRunning(!isRunning)}>
                    {/*{isRunning ? 'Pause' : 'Play'}*/}
                    <i className={`bi bi-${isRunning ? 'pause' : 'play'}-fill`}/>
                </button>
                <h3 className="col text-bg-secondary p-0 m-0">{formatTime(time)}</h3>
                <button className="col-3 btn btn-sm btn-danger" onClick={() => {
                    setTime(duration);
                    setIsRunning(false);
                }}>
                    {/*Reset*/}
                    <i className={`bi bi-arrow-counterclockwise`}/>
                </button>
            </div>
        </div>
    );
}