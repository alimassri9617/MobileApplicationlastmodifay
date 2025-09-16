import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useLogin } from '../../hooks/useLogin';
import { colors, spacing, typography } from '../../constants/theme';

export default function LoginScreen({ navigation }) {
  const [uniId, setUniId] = useState('');
  const [password, setPassword] = useState('');
  const { loading, login } = useLogin();

  const handleSubmit = async () => {
    if (!uniId.trim() || !password.trim()) {
      return;
    }
    await login(uniId, password);
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://blogs.nottingham.ac.uk/studentlife/files/2017/08/pexels-photo-267885.jpeg',
      }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <View style={styles.logoContainer}>
              <Text style={styles.title}>
                Login <Text style={styles.titleAccent}>UniAssist</Text>
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="University ID"
                placeholder="Enter your University ID"
                value={uniId}
                onChangeText={setUniId}
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={loading || !uniId.trim() || !password.trim()}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  'Login'
                )}
              </Button>
            </View>

            <View style={styles.footer}>
              {/* <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.linkText}>Contact Admin</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
  },
  titleAccent: {
    color: colors.primary,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  loginButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  linkText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

