import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { useTheme } from '@/components/theme/theme-provider';

import { appConfig } from '@/config/app-config';
import { initials } from '@/libs/format';

import { radii } from '@/constants/radii';
import { sizes } from '@/constants/sizes';

/** The same seed always picks the same portrait, so a user keeps their face across sessions. */
function portraitUrl(seed: string) {
  let hash = 0;
  for (const char of seed) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0;
  const { baseUrl, perSet } = appConfig.avatarPortraits;
  return `${baseUrl}/${hash % 2 ? 'women' : 'men'}/${Math.floor(hash / 2) % perSet}.jpg`;
}

interface AvatarProps {
  name: string;
  /** Usually the user id. Without one, only initials are shown. */
  seed?: string;
  size?: 'regular' | 'large';
}

export function Avatar({ name, seed, size = 'regular' }: AvatarProps) {
  const { colors } = useTheme();
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const url = seed ? portraitUrl(seed) : null;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.avatar, size === 'large' ? styles.large : styles.regular, { backgroundColor: colors.accent }]}
    >
      {/* Initials sit underneath, so they show while the photo loads or when offline. */}
      <AppText variant={size === 'large' ? 'title' : 'subheading'} tone="onAccent">
        {initials(name)}
      </AppText>
      {url && url !== failedUrl ? (
        <Image source={{ uri: url }} style={StyleSheet.absoluteFill} onError={() => setFailedUrl(url)} accessibilityIgnoresInvertColors />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, overflow: 'hidden' },
  regular: { width: sizes.avatar, height: sizes.avatar },
  large: { width: sizes.avatarLarge, height: sizes.avatarLarge },
});
