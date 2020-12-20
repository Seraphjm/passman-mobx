import {IDBServiceLayer} from 'Services/Models';
import {IRootStore} from 'Store/Models';

/**
 * Модель дефолтного состояния раздела настроек.
 *
 * @prop secretKey Пароль введённый пользователем.
 * @prop isLogin Флаг выполенный вход.
 * @prop isChecking Флаг проверки введённого пароля.
 * @prop isChecking Флаг о существовании базы.
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
    password: string;
    /**
     * Отслеживаемое состояние проверки пользовательского пароля.
     */
    isChecking: boolean;
    /**
     * Отслеживаемое состояние результата проверки наличия базы пользователя.
     */
    dbIsEmpty: boolean;
    /**
     * Сервисный слой приложения для работы с базой данных.
     */
    serviceLayer: IDBServiceLayer;
    /**
     * Экземпляр корневого store.
     */
    rootStore: IRootStore;

    /**
     * Экшн, устанавливающий пароль пользователя.
     *
     * @param password Введённый пользователем пароль.
     */
    setPassword(password: string): void;

    /**
     * Экшн, изменяющий мастер-пароль к базе паролей.
     *
     * @param newPassword новый пароль.
     */
    changeMasterPassword(newPassword: string): void;

    /**
     * Экшн, инициализирующий стор авторизации.
     */
    storeInit(): any;

    /**
     * Экшн, инициализируйющий создание базу данных.
     */
    createDB(): void;

    /**
     * Экшн, осуществляющий вход в приложение.
     *
     * Пытается сразу загрузить аккаунты с введённым паролем в пространство mainStore.
     * При удачном статусе этого действия, делает редирект в пространство MAIN.
     */
    logIn(): Promise<any>;
}
