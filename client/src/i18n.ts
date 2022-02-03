import { createI18n } from 'vue-i18n';
import norTranslations from './localization/no_vote_master.json';

const messages = {
    no: Object.assign({}, norTranslations),
};
 
const i18n = createI18n({
    locale: 'no',
    fallbackLocale: 'no',
    messages,
});

export default i18n;
