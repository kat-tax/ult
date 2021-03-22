import {DefaultTheme, DarkTheme, Theme as NavTheme} from '@react-navigation/native';

interface Theme {
  nav: NavTheme,
}

export const Default: Theme = {
  nav: {
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      card: 'rgb(40, 47, 61)',
      primary: 'rgb(255, 255, 255)',
      text: 'rgb(177, 186, 216)',
      border: 'rgb(52, 62, 85)',
    },
  },
};

export const DefaultDark: Theme = {
  nav: {
    dark: true,
    colors: {
      ...DarkTheme.colors,
      primary: '#ffffff',
    },
  },
};
