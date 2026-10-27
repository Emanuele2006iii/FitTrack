import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import colors from '../theme/colors';
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput';
import { useAuth } from '../context/AuthContext';

export default function Login({ navigation }) {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSending, setIsSending] = useState(false);

    async function handleLogin() {
        if (username.trim() === '' || password === '') {
            setError('Inserisci username e password');
            return;
        }
        setError(null);
        setIsSending(true);
        try {
            await login(username.trim(), password);
        } catch (err) {
            setError(err.message);
            setIsSending(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to my personal Fit Track</Text>
            <AppTextInput
                style={styles.field}
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <AppTextInput
                style={styles.field}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={true}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <AppButton
                style={styles.field}
                title={isSending ? 'Accesso...' : 'Accedi'}
                onPress={handleLogin}
                disabled={isSending}
            />
            <Pressable onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Non hai un account? Registrati</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    title: {
        color: colors.text,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    field: {
        width: '80%',
    },
    error: {
        color: colors.primary,
    },
    link: {
        color: colors.textMuted,
        marginTop: 8,
    },
});
