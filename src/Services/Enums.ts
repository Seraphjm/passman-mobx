/**
 * Перечисление имён сущностей в indexedDB.
 *
 * SETTINGS Настройки.
 * CATEGORIES Категории.
 * CRYPT IV и соль.
 */
export enum EStoreName {
    SETTINGS = 'settings',
    CATEGORIES = 'categories',
    CRYPT = 'crypt',
}

/**
 * Перечисление режимов работы транзации в indexedDB.
 *
 * READ_ONLY Только чтение.
 * READ_WRITE Запись и чтение.
 */
export enum EDBMode {
    READ_ONLY = 'readonly',
    READ_WRITE = 'readwrite',
}

/**
 * Перечисление стратегий по работе с indexedDB.
 *
 * ADD Добавить.
 * EDIT Редактировать.
 * DELETE Удалить.
 */
export enum ESetMode {
    ADD,
    EDIT,
    DELETE,
}

/**
 * Перечисление имён сущностей в indexedDB к которым применяется криптография.
 *
 * ACCOUNT Аккаунты пользователя.
 * USER_CATEGORIES Пользовательские категории.
 */
export enum ECryptoStorage {
    ACCOUNTS = 'accounts',
    USER_CATEGORIES = 'userCategories',
}

/**
 * Перечисление вариантов ответов о статусе транзакции.
 *
 * SUCCESS Транзакция успешно завершена.
 * ERROR Транзакция потерпела фиаско братан.
 */
export enum EResponseStatus {
    SUCCESS,
    ERROR,
}
