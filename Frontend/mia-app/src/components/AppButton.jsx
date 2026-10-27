import { Pressable, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function AppButton({ title, onPress, style, disabled = false }) {
    return (
        <Pressable
            style={[styles.button, disabled && styles.disabled, style]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 8,
        padding: 12,
    },
    disabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: colors.onPrimary,
        fontWeight: 'bold',
    },
});
