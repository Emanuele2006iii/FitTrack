import { View, Text, Pressable, StyleSheet } from 'react-native';
import colors from '../theme/colors';

function formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
}

export default function TrainingSessionItem({ activityType, durationMinutes, sessionDate, onDelete }) {
    return (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.type}>{activityType}</Text>
                <Text style={styles.details}>
                    {durationMinutes} min · {formatDate(sessionDate)}
                </Text>
            </View>
            <Pressable onPress={onDelete}>
                <Text style={styles.delete}>Elimina</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
    },
    info: {
        flex: 1,
        gap: 4,
    },
    type: {
        color: colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    details: {
        color: colors.textMuted,
    },
    delete: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});