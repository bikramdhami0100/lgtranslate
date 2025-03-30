import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { translateText } from './GoogleAI';
import { Stack } from 'expo-router';

const AnimatedButton = Animated.createAnimatedComponent(Button);

export default function App() {
  const theme = useTheme();
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLang, setTargetLang] = useState('French');
  const [sourceLang, setSourceLang] = useState('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const buttonScale = useSharedValue(1);

  const handleTranslate = async () => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      setError('');
      const result = await translateText(inputText, targetLang, sourceLang);
      console.log(result,"data from google gemini")
      setTranslatedText(result);
    } catch (err) {
      setError('Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const FadeInView = ({ children }:any) => (
    <Animated.View entering={FadeIn.duration(600)} exiting={FadeOut.duration(300)}>
      {children}
    </Animated.View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* <Stack.Screen  /> */}
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>Language Translator</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.sourceInput, { backgroundColor: theme.colors.surface }]}
            placeholder="Enter text to translate"
            // placeholderTextColor={theme.colors.placeholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />

          <View style={styles.langContainer}>
            <TextInput
              style={[styles.langInput, { backgroundColor: theme.colors.surface }]}
              placeholder="Source language"
              value={sourceLang}
              onChangeText={setSourceLang}
            />
            <Text style={styles.arrow}>↓</Text>
            <TextInput
              style={[styles.langInput, { backgroundColor: theme.colors.surface }]}
              placeholder="Target language"
              value={targetLang}
              onChangeText={setTargetLang}
            />
          </View>

          <AnimatedButton
            mode="contained"
            onPress={handleTranslate}
            style={[styles.button, buttonStyle]}
            labelStyle={styles.buttonLabel}
            disabled={!inputText || !targetLang || loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : 'Translate'}
          </AnimatedButton>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {translatedText ? (
            <FadeInView>
              <View style={[styles.translationContainer, { backgroundColor: theme.colors.surface }]}>
                <Text style={styles.translatedText}>{translatedText}</Text>
              </View>
            </FadeInView>
          ) : null}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    gap: 20,
  },
  input: {
    borderRadius: 15,
    padding: 20,
    fontSize: 16,
    lineHeight: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sourceInput: {
    minHeight: 120,
  },
  langContainer: {
    gap: 10,
  },
  langInput: {
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  arrow: {
    textAlign: 'center',
    fontSize: 24,
    color: '#666',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  translationContainer: {
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
  },
  translatedText: {
    fontSize: 18,
    lineHeight: 26,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});