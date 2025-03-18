import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const themeColors = isDarkMode ? darkColors : lightColors;

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <ThemedText type="title" style={[styles.title, { color: themeColors.error }]}>OH NO!</ThemedText>
        <ThemedText type="default" style={[styles.message, { color: themeColors.text }]}>
          This page needs a solid footing. {'\n'}
          Head back to the homepage.
        </ThemedText>
        
        <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.primary }]}>
          <Link href="/" style={styles.buttonText}>
            <ThemedText type="default" style={styles.buttonText}>Return to Home Page</ThemedText>
          </Link>
        </TouchableOpacity>

        <Link href="/profile/help" style={[styles.helpLink, { color: themeColors.link }]}>
          <ThemedText type="link">Visit Help Desk</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const lightColors = {
  background: '#f5f5f5',
  text: '#6B6B6B',
  primary: '#002D62',
  error: '#E74C3C',
  link: '#007BFF',
};

const darkColors = {
  background: '#1C1C1E',
  text: '#F2F2F7',
  primary: '#0A84FF',
  error: '#FF453A',
  link: '#0A84FF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'SFPro-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'SFPro-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    width: '80%',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'SFPro-Semibold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  helpLink: {
    fontSize: 16,
    fontFamily: 'SFPro-Regular',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
