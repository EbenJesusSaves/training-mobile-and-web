// Course-only playground (lesson 01) — lesson 07 deletes it when the real routes arrive.
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { defaultApiUrl } from '@/config/app-config';

type HealthState = 'checking' | 'ok' | 'error';

export default function HelloRailPassScreen() {
  const [state, setState] = useState<HealthState>('checking');
  const [message, setMessage] = useState('Checking the API contract…');

  const checkHealth = async (reset = true) => {
    if (reset) {
      setState('checking');
      setMessage('Checking the API contract…');
    }
    try {
      const response = await fetch(`${defaultApiUrl}/health`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setState('ok');
      setMessage('API: ok');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Unable to reach the API');
    }
  };

  useEffect(() => {
    // This effect performs the initial network sync after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void checkHealth(false);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>RailPass mobile</Text>
        <Text style={styles.title}>Hello RailPass</Text>
        <Text style={styles.copy}>This first screen proves Expo, typed routes, env config and the API contract are wired.</Text>
        <View style={styles.statusRow}>
          {state === 'checking' ? (
            <ActivityIndicator color="#D92D20" />
          ) : (
            <Text style={styles.statusIcon}>{state === 'ok' ? '✓' : '!'}</Text>
          )}
          <Text style={styles.status}>{message}</Text>
        </View>
        <Text style={styles.url}>API URL: {defaultApiUrl}</Text>
        <Pressable accessibilityRole="button" onPress={() => void checkHealth()} style={styles.button}>
          <Text style={styles.buttonText}>Check again</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', backgroundColor: '#F5F5F7', padding: 24 },
  card: {
    gap: 16,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    padding: 24,
    shadowColor: '#0B120D',
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  eyebrow: { color: '#D92D20', fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  title: { color: '#101828', fontSize: 34, fontWeight: '800' },
  copy: { color: '#475467', fontSize: 16, lineHeight: 24 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 18, backgroundColor: '#FFF1F0', padding: 14 },
  statusIcon: { color: '#D92D20', fontSize: 18, fontWeight: '800' },
  status: { color: '#101828', fontSize: 16, fontWeight: '700' },
  url: { color: '#667085', fontSize: 13 },
  button: { alignSelf: 'flex-start', borderRadius: 999, backgroundColor: '#D92D20', paddingHorizontal: 18, paddingVertical: 12 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
