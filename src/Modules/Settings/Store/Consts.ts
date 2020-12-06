import {ELanguage} from 'Modules/Settings/Enums';
import {IDefaultSettingsStore} from './Models';

/**
 * Дефолтное состояние раздела настроек.
 */
export const defaultSettings: IDefaultSettingsStore = {
    language: ELanguage.en_US,
};
