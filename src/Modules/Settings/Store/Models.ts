import {ELanguages} from 'Modules/Settings/Enums';

/**
 * Модель дефолтного состояния раздела настроек.
 *
 * language Выбранная локализация.
 */
export interface IDefaultSettingsStore {
    language: ELanguages;
}

/**
 * Модель класса стора.
 */
export interface ISettingsStore {
    /**
     * Отслеживаемое состояние выбранной локализации.
     */
    language: ELanguages;

    /**
     * Экшн, изменяющий выбранную локализации.
     *
     * @param [language] Переданная локализация на установку.
     * TODO: any временно.
     */
    setLanguage(language?: ELanguages | any): void;
}
