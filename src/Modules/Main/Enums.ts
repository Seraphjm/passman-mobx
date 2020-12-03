/**
 * Перечисление вариантов временных переодов.
 *
 * ONE_DAY Один день.
 * ONE_MOUTH Один месяц.
 * THREE_MOUTH Три месяца.
 * SIX_MOUTH Шесть месяцев.
 * ONE_YEAR Один год.
 */
export enum ENotificationPeriodUpdate {
    ONE_DAY = 86400000,
    ONE_MOUTH = 2592000000,
    THREE_MOUTH = 7776000000,
    SIX_MOUTH = 15552000000,
    ONE_YEAR = 31536000000,
}
