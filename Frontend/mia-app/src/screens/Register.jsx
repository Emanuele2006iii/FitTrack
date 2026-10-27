import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import colors from '../theme/colors';
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSending, setIsSending] = useState(false);

    async function handleRegister() {
        if (username.trim() === '' || email.trim() === '' || password === '') {
            setError('Compila tutti i campi');
            return;
        }
        setError(null);
        setIsSending(true);
        try {
            await register(username.trim(), email.trim(), password);
        } catch (err) {
            setError(err.message);
            setIsSending(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crea il tuo account</Text>
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
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <AppTextInput
                style={styles.field}
                value={password}
                onChangeText={setPassword}
                placeholder="Password (almeno 8 caratteri)"
                secureTextEntry={true}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <AppButton
                style={styles.field}
                title={isSending ? 'Registrazione...' : 'Registrati'}
                onPress={handleRegister}
                disabled={isSending}
            />
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
    },
    field: {
        width: '80%',
    },
    error: {
        color: colors.primary,
    },
});
