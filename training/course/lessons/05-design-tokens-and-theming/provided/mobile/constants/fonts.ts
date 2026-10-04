// Plus Jakarta Sans (SIL OFL 1.1, see assets/fonts/OFL.txt). Keys are the family names used in styles.
export const fontFamilies = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semibold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
} as const;

/** Passed to expo-font's useFonts() in the root layout. */
export const fontAssets = {
  [fontFamilies.regular]: require('../assets/fonts/PlusJakartaSans_400Regular.ttf'),
  [fontFamilies.medium]: require('../assets/fonts/PlusJakartaSans_500Medium.ttf'),
  [fontFamilies.semibold]: require('../assets/fonts/PlusJakartaSans_600SemiBold.ttf'),
  [fontFamilies.bold]: require('../assets/fonts/PlusJakartaSans_700Bold.ttf'),
};

/** Used where native fonts are unavailable (the generated PDF). */
export const systemFontStack = '-apple-system, Roboto, Helvetica, Arial, sans-serif';
