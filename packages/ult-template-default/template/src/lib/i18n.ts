import {i18n} from '@lingui/core';
import {en, cs} from 'make-plural/plurals';

export async function loadLocale(locale: string) {
  const {messages} = await import(`lib/locales/${locale}/messages`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}

i18n.loadLocaleData({
  en: {plurals: en},
  cs: {plurals: cs},
});
