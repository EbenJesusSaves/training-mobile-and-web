import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/components/theme/theme-provider';

import { layout } from '@/constants/layout';

import type { ReactNode } from 'react';

interface ScreenProps {
  children: ReactNode;
  /** `ticket` is the dark backdrop behind the paper ticket. */
  tone?: 'canvas' | 'ticket';
  scroll?: boolean;
  /** Sticky content pinned to the bottom (e.g. the price + Buy Ticket bar). */
  footer?: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  edges?: Edge[];
  /** Remove the default side gutter (for edge-to-edge lists). */
  bleed?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  tone = 'canvas',
  scroll = true,
  footer,
  refreshing = false,
  onRefresh,
  edges = ['top'],
  bleed = false,
  contentStyle,
}: ScreenProps) {
  const { colors, scheme } = useTheme();
  const isDarkSurface = tone === 'ticket' || scheme === 'dark';
  const content = [styles.content, bleed ? styles.bleed : styles.gutter, contentStyle];

  return (
    // Not collapsable, so iOS native tabs can find the scroll view and inset it above the tab bar.
    <View collapsable={false} style={[styles.root, { backgroundColor: tone === 'ticket' ? colors.ticketCanvas : colors.canvas }]}>
      <StatusBar style={isDarkSurface ? 'light' : 'dark'} />
      {/* Android already resizes the window for the keyboard (softwareKeyboardLayoutMode: resize). */}
      <KeyboardAvoidingView collapsable={false} style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView collapsable={false} style={styles.root} edges={edges}>
          {scroll ? (
            <ScrollView
              contentContainerStyle={content}
              contentInsetAdjustmentBehavior="automatic"
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
              showsVerticalScrollIndicator={false}
              refreshControl={
                onRefresh ? (
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={isDarkSurface ? colors.onInverse : colors.ink} />
                ) : undefined
              }
            >
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.root, content]}>{children}</View>
          )}
          {footer}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingBottom: layout.screenBottomPadding },
  gutter: { paddingHorizontal: layout.screenGutter },
  bleed: { paddingHorizontal: 0, paddingBottom: 0 },
});
