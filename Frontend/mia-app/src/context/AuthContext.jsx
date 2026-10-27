import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as api from '../services/api';
import { deleteToken, readToken, saveToken } from '../services/tokenStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function restoreSession() {
            try {
                const savedToken = await readToken();
                if (savedToken) {
                    const me = await api.getMe(savedToken);
                    setUser(me);
                    setToken(savedToken);
                }
            } catch {
                await deleteToken();
            } finally {
                setIsLoading(false);
            }
        }
        restoreSession();
    }, []);

    const login = useCallback(async (username, password) => {
        const result = await api.login(username, password);
        await saveToken(result.token);
        setToken(result.token);
        setUser(result.user);
    }, []);

    const register = useCallback(async (username, email, password) => {
        await api.register(username, email, password);
        await login(username, password);
    }, [login]);

    const logout = useCallback(async () => {
        await deleteToken();
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
