import { TextInput, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function AppTextInput({ style, ...props }) {
    return (
        <TextInput
            style={[styles.input, style]}
            placeholderTextColor={colors.textMuted}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: colors.surface,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
    },
});
