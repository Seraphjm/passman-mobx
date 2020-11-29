import {ENotificationPeriodUpdate} from './Enums';
import {IBadge} from 'ui/Components/Badge/Models';

/**
 * Модель аккаунта.
 *
 * @prop _id Уникальный идентификатор uuid для аккаунта.
 * @prop accountName Имя аккаунта.
 * @prop section Секция аккаунта.
 * @prop subSection Подсекция, отображаемая чуть ниже основной. Дополнительный фильтр под фильтром section.
 * @prop logotype Логотип.
 * @prop lastUpdate Последнее обновление каких-либо данных в аккаунте.
 * @prop passwordLastUpdate Последнее обновление пароля в аккаунте.
 * @prop settings Настройки в отображении аккаунта. Бейджи-нотификации, выделение и тп.
 * @prop data Непосредственно сохраняемые данные учётной записи.
 */
export interface IAccount {
    _id: string;
    accountName: string;
    section: string;
    subSection: string;
    logotype: ILogotype;
    lastUpdate: Date;
    passwordLastUpdate: Date;
    settings: IAccountSettings;
    data: IAccountData;
}

/**
 * Модель логотипа.
 *
 * @prop logo Логотип. Представляет из себя строку css к определённой иконке.
 * @prop color Цвет иконки.
 * @prop image Изображение прикреплённое пользователем. Имеет приоритет над logo.
 * TODO На текущий момент не очевидно как лучше реализовать хранение. До тех пор, тип: any;
 */
export interface ILogotype {
    logo: string;
    color: string;
    image: any;
}

/**
 * Модель учётных данных аккаунта.
 *
 * @prop email email.
 * @prop login Логин.
 * @prop password Пароль.
 * @prop comment Комментарий к учётным данным.
 * @prop phone Телефон привязанный к аккаунту.
 * @prop site Сайт которому принадлежит аккаунт.
 */
export interface IAccountData extends TCustomField {
    email: string;
    login: string;
    password: string;
    comment: string;
    phone: string;
    site: string;
}

/**
 * Выделенный тип под созданные пользователем кастомные поля.
 */
export type TCustomField = {
    [key: string]: string;
};

/**
 * Модель настроек применимых аккаунту.
 *
 * notifications Нотификации, применяемые к аккаунту.
 * [badges] Короткие пользовательские бейджики к заголовку аккаунта.
 */
export interface IAccountSettings {
    notifications: IAccountNotifications;
    badges?: IAccountBadge[];
}

/**
 * Модель нотификаций к аккаунту.
 *
 * @prop passwordNeedUpdate Оповещение о необходимости изменить пароль по прошедшему сроку.
 */
export interface IAccountNotifications {
    passwordNeedUpdate: IPasswordNeedUpdate;
}

/**
 * Модель нотификации обновления пароля по прошедшему периоду.
 *
 * @prop enabled Флаг активности уведомления.
 * @prop default Дефолтное значение показа уведомления с последнего обновления пароля.
 * @prop period Возможные периоды показа уведомления о смене пароля по прошедшему периоду.
 */
export interface IPasswordNeedUpdate {
    enabled: boolean;
    default: ENotificationPeriodUpdate.SIX_MOUTH;
    period: ENotificationPeriodUpdate;
}

/**
 * Модель бейджа для аккаунта.
 *
 * @prop counter Запрещённое свойство для бейджа аккаунта.
 * @prop counterPosition Запрещённое свойство для бейджа аккаунта.
 */
export interface IAccountBadge extends IBadge {
    counter: never;
    counterPosition: never;
}
