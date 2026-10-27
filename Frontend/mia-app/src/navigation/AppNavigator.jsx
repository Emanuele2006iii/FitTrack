import { View, ActivityIndicator, Pressable, Text, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator();

const theme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
    },
};

export default function AppNavigator() {
    const { user, isLoading, logout } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator color={colors.primary} size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator>
                {user ? (
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{
                            title: `Ciao, ${user.username}`,
                            headerRight: () => (
                                <Pressable onPress={logout}>
                                    <Text style={styles.logout}>Esci</Text>
                                </Pressable>
                            ),
                        }}
                    />
                ) : (
                    <>
                        <Stack.Screen name="Login" component={Login} options={{ title: 'Accedi' }} />
                        <Stack.Screen name="Register" component={Register} options={{ title: 'Registrati' }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logout: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});
