import React, { useState, useEffect } from 'react';

const Timer = () => {
    const [timeRemaining, setTimeRemaining] = useState(getTimeRemainingUntilMidnight());

    useEffect(() => {
        const timerId = setInterval(() => {
            setTimeRemaining(getTimeRemainingUntilMidnight());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    function getTimeRemainingUntilMidnight() {
        const now = new Date();
        const nextMidnight = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
        );

        const timeDifference = nextMidnight - now;
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDifference / 1000) % 60);

        return { hours, minutes, seconds };
    }

    return (
        <div>
            <p className='timer'>
                {String(timeRemaining.hours).padStart(2, '0')}:
                {String(timeRemaining.minutes).padStart(2, '0')}:
                {String(timeRemaining.seconds).padStart(2, '0')}
            </p>
        </div>

    );
};

export default Timer;