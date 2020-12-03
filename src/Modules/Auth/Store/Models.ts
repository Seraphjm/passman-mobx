import {ELanguages} from 'Modules/Settings/Enums';

/**
 * Модель дефолтного состояния раздела настроек.
 *
 * secretKey Пароль введённый пользователем.
 * isLogin Флаг выполенный вход.
 * isChecking Флаг проверки введённого пароля.
 * isChecking Флаг о существовании базы.
 */
export interface IDefaultAuthorizationStore {
    secretKey: string;
    isLogin: null;
    isChecking: boolean;
    dbIsEmpty: boolean;
}

/**
 * Модель класса стора.
 */
export interface IAuthorizationStore {
    /**
     * Отслеживаемое состояние введённого пользователем пароля.
     */
    secretKey: string;
    /**
     * Отслеживаемое состояние факта логина.
     */
    isLogin: boolean | null;
    /**
     * Отслеживаемое состояние проверки пользовательского пароля.
     */
    isChecking: boolean;
    /**
     * Отслеживаемое состояние результата проверки наличия базы пользователя.
     */
    dbIsEmpty: boolean;

    /**
     * Экшн, изменяющий пароль.
     *
     * @param key Введённый пользователем пароль.
     */
    setSecretKey(key: string): void;

    /**
     * Экшн, отправляющий введённый пользователем пароль на проверку.
     */
    checkSecretKey(): void;

    /**
     * Экшн, изменяющий мастер-пароль к базе паролей.
     *
     * @param newPassword новый пароль.
     */
    changeMasterPassword(newPassword: string): void;
}
