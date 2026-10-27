import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../theme/colors';
import TrainingSessionItem from '../components/TrainingSessionItem';
import TrainingSessionForm from '../components/TrainingSessionForm';
import useTrainingSessions from '../hooks/useTrainingSessions';

export default function Home() {
    const { sessions, isLoading, error, addSession, removeSession } = useTrainingSessions();
    const insets = useSafeAreaInsets();

    function confirmDelete(id) {
        Alert.alert('Eliminare l\'allenamento?', 'Non si potrà recuperare.', [
            { text: 'Annulla', style: 'cancel' },
            { text: 'Elimina', style: 'destructive', onPress: () => removeSession(id) },
        ]);
    }

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator color={colors.primary} size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={sessions}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <TrainingSessionItem
                        activityType={item.activityType}
                        durationMinutes={item.durationMinutes}
                        sessionDate={item.sessionDate}
                        onDelete={() => confirmDelete(item.id)}
                    />
                )}
                ListHeaderComponent={
                    <>
                        <TrainingSessionForm onSubmit={addSession} />
                        {error && <Text style={styles.error}>{error}</Text>}
                    </>
                }
                ListEmptyComponent={!error && <Text style={styles.empty}>Nessun allenamento registrato</Text>}
                contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 12 }]}
                keyboardShouldPersistTaps="handled"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        gap: 12,
        padding: 12,
    },
    error: {
        color: colors.primary,
        textAlign: 'center',
    },
    empty: {
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: 24,
    },
});