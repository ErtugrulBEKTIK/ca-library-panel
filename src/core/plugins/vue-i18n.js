import Vue from "vue";
import VueI18n from "vue-i18n";

// Localisation language list
import { locale as tr } from "@/core/config/i18n/tr";
import { locale as en } from "@/core/config/i18n/en";


Vue.use(VueI18n);
const messages = { en: en, tr: tr };
const lang = localStorage.getItem("language") || "tr";
export default new VueI18n({
  locale: lang,
  fallbackLocale: 'tr',
  messages
});
