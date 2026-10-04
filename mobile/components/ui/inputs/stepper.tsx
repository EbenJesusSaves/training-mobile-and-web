import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/atomic/app-text';
import { Icon } from '@/components/atomic/icon';
import { useTheme } from '@/components/theme/theme-provider';

import { opacity } from '@/constants/opacity';
import { radii } from '@/constants/radii';
import { hitSlop, iconSizes, sizes } from '@/constants/sizes';
import { spacing } from '@/constants/spacing';
import { ui } from '@/constants/ui';

interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}

export function Stepper({ value, min, max, onChange, label }: StepperProps) {
  const { colors } = useTheme();
  const renderButton = (direction: 'decrease' | 'increase') => {
    const isIncrease = direction === 'increase';
    const disabled = isIncrease ? value >= max : value <= min;
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${isIncrease ? 'Increase' : 'Decrease'} ${label}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        hitSlop={hitSlop.sm}
        onPress={() => onChange(isIncrease ? value + ui.stepperStep : value - ui.stepperStep)}
        style={[
          styles.button,
          { backgroundColor: isIncrease ? colors.inverse : colors.surface, opacity: disabled ? opacity.disabledStrong : opacity.full },
        ]}
      >
        <Icon name={isIncrease ? 'plus' : 'minus'} size={iconSizes.md} color={isIncrease ? colors.onInverse : colors.ink} />
      </Pressable>
    );
  };
  return (
    <View style={styles.row}>
      {renderButton('decrease')}
      <AppText variant="bodyStrong" style={styles.value} accessibilityLabel={`${label}: ${value}`}>
        {value}
      </AppText>
      {renderButton('increase')}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  button: {
    width: sizes.stepperButton,
    height: sizes.stepperButton,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { minWidth: sizes.stepperValueMinWidth, textAlign: 'center' },
});
