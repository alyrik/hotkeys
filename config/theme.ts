import { createTheme } from '@nextui-org/react';

export const themeStyles = {
  textGradient: '45deg, $purple600 10%, #e14313 70%',
};

export const theme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      gradient:
        'linear-gradient(112deg, #ff5a22 -25%, $purple600 0%, #e14313 90%)',
    },
  },
});
