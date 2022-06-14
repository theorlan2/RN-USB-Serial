import i18n from 'i18next';
// En
import layout from './en/layout.json';
import titleScenes from './en/titleScenes.json';
// Es
import layoutEs from './es/layout.json';
import titleScenesEs from './es/titleScenes.json';
import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    layout, 
    titleScenes
  },
  es: { 
    layoutEs,
    titleScenesEs
  },
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  ns: ['layout','titleScenes'],
  interpolation: {   },
  resources,
});