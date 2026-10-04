const breakpoints = require('./src/shared/constants/breakpoints.cjs');

module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': breakpoints.xs,
        'mantine-breakpoint-sm': breakpoints.sm,
        'mantine-breakpoint-md': breakpoints.md,
        'mantine-breakpoint-lg': breakpoints.lg,
        'mantine-breakpoint-xl': breakpoints.xl,
        'rp-breakpoint-mobile-auth': breakpoints.mobileAuth,
        'rp-breakpoint-mobile-wide': breakpoints.mobileWide,
        'rp-breakpoint-detail': breakpoints.detail,
        'rp-breakpoint-network': breakpoints.network,
      },
    },
  },
};
