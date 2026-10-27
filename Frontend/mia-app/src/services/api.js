import { API_URL } from '../config';

async function request(path, { method = 'GET', body, token } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new Error('Server  non raggiungibile: controlla che il backend sia acceso e sulla stessa rete');
    }

    if (response.status === 204) {
        return null;
    }

    const json = await response.json();
    if (!response.ok) {
        const error = new Error(json.error ?? 'Errore sconosciuto');
        error.status = response.status;
        throw error;
    }
    return json.data;
}

export function login(username, password) {
    return request('/login', { method: 'POST', body: { username, password } });
}

export function register(username, email, password) {
    return request('/register', { method: 'POST', body: { username, email, password } });
}

export function getMe(token) {
    return request('/me', { token });
}

export function getTrainingSessions(token) {
    return request('/training-sessions', { token });
}

export function createTrainingSession(token, activityType, durationMinutes, sessionDate) {
    return request('/training-sessions', {
        method: 'POST',
        body: { activityType, durationMinutes, sessionDate },
        token,
    });
}

export function deleteTrainingSession(token, id) {
    return request(`/training-sessions/${id}`, { method: 'DELETE', token });
}