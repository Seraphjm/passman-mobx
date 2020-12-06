import {ELanguage} from 'Modules/Settings/Enums';

/**
 * Модель дефолтного состояния раздела настроек.
 *
 * language Выбранная локализация.
 */
export interface IDefaultSettingsStore {
    language: ELanguage;
}

/**
 * Модель класса стора.
 */
export interface ISettingsStore {
    /**
     * Отслеживаемое состояние выбранной локализации.
     */
    language: ELanguage;

    /**
     * Экшн, изменяющий выбранную локализации.
     *
     * @param [language] Переданная локализация на установку.
     */
    setLanguage(language?: ELanguage): void;
}
