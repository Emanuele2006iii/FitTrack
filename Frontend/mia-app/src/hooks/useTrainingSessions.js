import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function useTrainingSessions() {
    const { token, logout } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleError = useCallback((err, show) => {
        if (err.status === 401) {
            logout();
        } else {
            show(err.message);
        }
    }, [logout]);

    const loadSessions = useCallback(async () => {
        try {
            setError(null);
            setSessions(await api.getTrainingSessions(token));
        } catch (err) {
            handleError(err, setError);
        }
    }, [token, handleError]);

    useEffect(() => {
        loadSessions().finally(() => setIsLoading(false));
    }, [loadSessions]);

    async function addSession(activityType, durationMinutes, sessionDate) {
        try {
            await api.createTrainingSession(token, activityType, durationMinutes, sessionDate);
            await loadSessions();
            Alert.alert('Allenamento aggiunto con successo');
            return true;
        } catch (err) {
            handleError(err, (message) => Alert.alert('Allenamento non aggiunto', message));
            return false;
        }
    }

    async function removeSession(id) {
        try {
            await api.deleteTrainingSession(token, id);
            setSessions((prev) => prev.filter((session) => session.id !== id));
        } catch (err) {
            handleError(err, (message) => Alert.alert('Allenamento non eliminato', message));
        }
    }

    return { sessions, isLoading, error, addSession, removeSession };
}