import i18n from 'i18next';
// En
import layout from './en/layout.json';
import titleScenes from './en/titleScenes.json';
import home from './en/scenes/home.json';
import defaultData from './en/default.json';
import sendTempCmds from './en/scenes/sendTempCmds.json';
import calculateCRC from './en/scenes/calculateCRC.json';
import macros from './en/scenes/macros.json';
import groups from './en/scenes/groups.json';
// Es
import layoutEs from './es/layout.json';
import titleScenesEs from './es/titleScenes.json';
import homeEs from './es/scenes/home.json';
import defaultEs from './es/default.json';
import sendTempCmdsEs from './es/scenes/sendTempCmds.json';
import calculateCRCEs from './es/scenes/calculateCRC.json';
import macrosEs from './es/scenes/macros.json';
import groupsEs from './es/scenes/groups.json';
import { initReactI18next } from 'react-i18next';

export const resources = {
  en: {
    layout,
    titleScenes,
    home,
    defaultData,
    sendTempCmds,
    calculateCRC,
    macros,
    groups,
  },
  es: {
    layout: layoutEs,
    titleScenes: titleScenesEs,
    home: homeEs,
    defaultData: defaultEs,
    sendTempCmds: sendTempCmdsEs,
    calculateCRC: calculateCRCEs,
    macros: macrosEs,
    groups: groupsEs
  },
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  ns: [],
  interpolation: {},
  resources,
});