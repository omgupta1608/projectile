import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { getX, getY, getXComponent, getYComponent } from "./calc";

const accelerationDueToGravity = 9.8;

function MovingCircle() {
    
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [inMotion, setInMotion] = useState(false);
    // initial velocity
    const [initialVelocity, setInitialVelocity] = useState(35);
    // angle with the horizontal in degrees
    const [angle, setAngle] = useState(60);

    const [error, setError] = useState(null);

    const [speed, setSpeed] = useState(100);
    const canvasRef = useRef(null);

    const [time, setTime] = useState(1);
    const isRunningRef = useRef(inMotion);
    useEffect(() => {
        if (position.y > 0) {
            setPosition((prevPosition) => ({
                x: prevPosition.x,
                y: 0,
            }));
            setInMotion(false);
        }
    }, [position, inMotion]);

    useEffect(() => {
        if (inMotion) {
            // const context = canvasRef.current.getContext('2d');
            let x = 0,
                y = 0;
            const initialVelocityXComponent = getXComponent(parseFloat(initialVelocity), parseFloat(angle));
            const initialVelocityYComponent = getYComponent(parseFloat(initialVelocity), parseFloat(angle));
            x = getX(time, initialVelocityXComponent);
            y = getY(time, initialVelocityYComponent, accelerationDueToGravity);

            setPosition((prevPosition) => {
                // context.beginPath();
                // context.moveTo(prevPosition.x - 50, prevPosition.y + viewportHeight);
                // context.lineTo(prevPosition.x + x, (prevPosition.y - y) + viewportHeight);
                // context.stroke();
                return {
                    x: prevPosition.x + x + 50,
                    y: prevPosition.y - y,
                }
            });

        }
    }, [time]);

    useEffect(() => {
        isRunningRef.current = inMotion;
    }, [inMotion]);

    useEffect(() => {
        let timer;
        if (inMotion) {
            const loop = async () => {
                for (; ;) {
                    if (!isRunningRef.current) {
                        break;
                    }
                    setTime(p => p + 1);
                    await new Promise((resolve) => (timer = setTimeout(resolve, speed)));
                }
                setInMotion(false);
            };
            loop();
        }
        return () => clearTimeout(timer);
    }, [inMotion])

    useEffect(() => {
        if (error) alert(error)
    }, [error])

    const start = async () => {
        reset()
        if (angle === "0") {
            setError("angle should be non-zero");
            return;
        }
        if (initialVelocity === "0") {
            setError("initial velocity should be non-zero");
            return;
        }

        // proceed if already not in motion and no error
        if (!inMotion && !error) {
            setInMotion(true);
        }
    };


    const reset = () => {
        setInMotion(false)
        setTime(0)
        setPosition({ x: 0, y: 0 })
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Function to clear the canvas
        const clearCanvas = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        };

        clearCanvas();
    }

    return (
        <div className="container">
            <div className="settings">
                <label htmlFor="ivelocity">Initial Velocity (m/s)</label>
                <input id="ivelocity" type="number" defaultValue={initialVelocity} onChange={e => setInitialVelocity(e.target.value)} />
                <label htmlFor="ivelocity">Angle from Horizontal (θ) </label>
                <input id="angle" type="number" defaultValue={angle} onChange={e => setAngle(e.target.value)} />
                <button disabled={time !== 1 && time !== 0} className="start" onClick={start}>
                    Start
                </button>
                <button className="reset" onClick={reset}>
                    Reset
                </button>
            </div>

            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.outerHeight}
                style={{ border: '1px solid black' }}
            >
            </canvas>
            <div className="play_area">
                <div
                    className="circle"
                    style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                />
            </div>
        </div>
    );
}

export default MovingCircle;
