import {ELanguages} from 'Common/Locales/Enums';
import {IDefaultSettingsStore} from './Models';

/**
 * Дефолтное состояние раздела настроек.
 */
export const defaultSettings: IDefaultSettingsStore = {
    language: ELanguages.en_US,
};
