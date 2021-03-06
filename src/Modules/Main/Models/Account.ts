import {ENotificationPeriodUpdate} from '../Enums';
import {IBadge} from 'ui/Components/Badge/Models';
import {ISVGIcon} from 'ui/Components/Icon/Models';

/**
 * Модель аккаунта.
 *
 * @prop _id Уникальный идентификатор uuid для аккаунта.
 * @prop name Имя аккаунта.
 * @prop categoryId ID категории аккаунта.
 * @prop subcategory Подсекция, отображаемая чуть ниже основной. Дополнительный фильтр под фильтром category.
 * @prop [logotype] Логотип.
 * @prop lastUpdate Последнее обновление каких-либо данных в аккаунте.
 * @prop passwordLastUpdate Последнее обновление пароля в аккаунте.
 * @prop [settings] Настройки в отображении аккаунта. Бейджи-нотификации, выделение и тп.
 * @prop data Непосредственно сохраняемые данные учётной записи.
 */
export interface IAccount {
    _id: string;
    name: string;
    categoryId: string;
    subcategory: string;
    logotype: ISVGIcon;
    lastUpdate: string;
    passwordLastUpdate: string;
    settings?: IAccountSettings;
    data: IAccountData;
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
export interface IAccountData extends IAdditionalFields, ICustomField {
    email: string;
    login: string;
    password: string;
    comment: string;
    phone: string;
    site: string;
}

/**
 * Модель дополнительных данных аккаунта.
 *
 * @prop [secret_answer] Ответ на секретный вопрос.
 * @prop [secret_question] Вопрос на секретный ответ.
 * @prop comment Комментарий к учётным данным.
 */
interface IAdditionalFields {
    secret_answer: string;
    secret_question: string;
    comment: string;
}

/**
 * Модель кастомных полей аккаунта.
 */
export interface ICustomField {
    [key: string]: string;
}

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
 * @prop [period] Возможные периоды показа уведомления о смене пароля по прошедшему периоду.
 */
export interface IPasswordNeedUpdate {
    enabled: boolean;
    default: ENotificationPeriodUpdate.SIX_MOUTH;
    period?: ENotificationPeriodUpdate;
}

/**
 * Модель бейджа для аккаунта.
 *
 * @prop counter Запрещённое свойство для бейджа аккаунта.
 * @prop counterPosition Запрещённое свойство для бейджа аккаунта.
 * @prop size Запрещённое свойство для бейджа аккаунта.
 * @prop text Badge text.
 */
export interface IAccountBadge extends IBadge {
    counter: never;
    counterPosition: never;
    size: never;
    text: string;
}

/**
 * Модель группированных данных аккаунта по категориям.
 *
 * @prop default Основыне поля.
 * @prop additional Дополнительные поля.
 * @prop custom Пользовательские поля.
 */
export interface IPreparedFields {
    default: string[];
    additional: string[];
    custom: string[];
}
