import { useState, useEffect } from 'react';

// Constants
const TIMER_INTERVAL = 1000;

/**
 * Custom hook for session timer functionality
 * @returns {number} sessionTime - Time elapsed in seconds
 */
const useSessionTimer = () => {
    const [sessionTime, setSessionTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setSessionTime(prev => prev + 1), TIMER_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    return sessionTime;
};

export default useSessionTimer;
