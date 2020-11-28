/**
 * Паттерны создания пароля.
 *
 * LOWER_UPPER_NUMBER /[a-zA-Z0-9]/
 * LOWER_UPPER_NUMBER_ /[a-zA-Z0-9_]/
 * LOWER_UPPER_NUMBER_SPECIAL /[a-zA-Z0-9_!@#$%^&*+]/
 */
export enum EPasswordPatterns {
    LOWER_UPPER_NUMBER,
    LOWER_UPPER_NUMBER_,
    LOWER_UPPER_NUMBER_SPECIAL,
}
