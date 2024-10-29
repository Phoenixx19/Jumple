import React, { useState, useEffect } from 'react';

const Timer = () => {
    const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const fetchTime = async () => {
            try {
                const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=UTC');
                const data = await response.json();
                updateTimeRemaining(data);
            } catch (error) {
                console.error('Error fetching time:', error);
            }
        };

        const updateTimeRemaining = (apiTime) => {
            const now = new Date(Date.UTC(apiTime.year, apiTime.month - 1, apiTime.day, apiTime.hour, apiTime.minute, apiTime.seconds));
            const nextMidnight = new Date(Date.UTC(apiTime.year, apiTime.month - 1, apiTime.day + 1));

            const timeDifference = nextMidnight - now;
            const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
            const seconds = Math.floor((timeDifference / 1000) % 60);

            setTimeRemaining({ hours, minutes, seconds });
        };

        fetchTime();

        const timerId = setInterval(() => {
            setTimeRemaining((prev) => {
                const newSeconds = prev.seconds - 1;
                const newMinutes = newSeconds < 0 ? prev.minutes - 1 : prev.minutes;
                const newHours = newMinutes < 0 ? prev.hours - 1 : prev.hours;

                return {
                    hours: newHours < 0 ? 0 : newHours,
                    minutes: newMinutes < 0 ? 59 : newMinutes,
                    seconds: newSeconds < 0 ? 59 : newSeconds,
                };
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    return (

            <p className='timer'>
                Next screen: {" "}
                {String(timeRemaining.hours).padStart(2, '0')}:
                {String(timeRemaining.minutes).padStart(2, '0')}:
                {String(timeRemaining.seconds).padStart(2, '0')}
            </p>

    );
};

export default Timer;
