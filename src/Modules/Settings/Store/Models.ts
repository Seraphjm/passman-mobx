import {ELanguages} from 'Common/Locales/Enums';

export interface IDefaultSettingsStore {
    language: ELanguages;
}

export interface ISettingsStore {
    language: ELanguages;
    setLanguage(language?: ELanguages | any): void;
}
