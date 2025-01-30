import React from 'react';

// Create a custom hook to manage stream events
export const useStreamEvents = <T>() => {
    const [events, setEvents] = React.useState<T[]>([]);

    const addEvent = React.useCallback((event: T) => {
        setEvents(prev => [...prev, event]);
    }, []);

    return { events, addEvent };
};
