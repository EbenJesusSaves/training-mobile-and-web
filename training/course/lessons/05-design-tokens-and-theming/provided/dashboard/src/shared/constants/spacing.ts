export const spacing = {
  none: '0',
  xxs: '3px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
  huge: '40px',
  pageX: 'clamp(0.875rem, 2.2vw, 1.5rem)',
  pageXMobile: '0.85rem',
  authGap: 'clamp(1rem, 3vw, 3rem)',
  authPadding: 'clamp(1rem, 4vw, 3rem)',
  authHeroPadding: 'clamp(1.5rem, 4vw, 3rem)',
  authLogoMargin: 'clamp(3rem, 8vw, 7rem)',
  authPanelPadding: 'clamp(1.25rem, 4vw, 2.4rem)',
} as const;

export const spacingKeys = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;
