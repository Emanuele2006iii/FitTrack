import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import AppButton from './AppButton';
import AppTextInput from './AppTextInput';

function today() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
}

export default function TrainingSessionForm({ onSubmit }) {
    const [activityType, setActivityType] = useState('');
    const [duration, setDuration] = useState('');
    const [sessionDate, setSessionDate] = useState(today());
    const [error, setError] = useState(null);
    const [isSending, setIsSending] = useState(false);

    async function handleSubmit() {
        const minutes = Number(duration);
        if (activityType.trim() === '' || duration === '' || sessionDate === '') {
            setError('Compila tutti i campi');
            return;
        }
        if (!Number.isInteger(minutes) || minutes < 1) {
            setError('La durata deve essere un numero intero di minuti');
            return;
        }

        setError(null);
        setIsSending(true);
        const saved = await onSubmit(activityType.trim(), minutes, sessionDate);
        setIsSending(false);
        if (saved) {
            setActivityType('');
            setDuration('');
        }
    }

    return (
        <View style={styles.form}>
            <Text style={styles.title}>Nuovo allenamento</Text>
            <AppTextInput
                value={activityType}
                onChangeText={setActivityType}
                placeholder="Tipo di attività (corsa, palestra, yoga...)"
            />
            <AppTextInput
                value={duration}
                onChangeText={setDuration}
                placeholder="Durata in minuti"
                keyboardType="number-pad"
            />
            <AppTextInput
                value={sessionDate}
                onChangeText={setSessionDate}
                placeholder="Data (AAAA-MM-GG)"
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <AppButton
                title={isSending ? 'Salvataggio...' : 'Aggiungi'}
                onPress={handleSubmit}
                disabled={isSending}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        gap: 8,
        marginBottom: 16,
    },
    title: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    error: {
        color: colors.primary,
    },
});