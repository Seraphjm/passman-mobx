/**
 * List of colors.
 *
 * PRIMARY Blue.
 * SECONDARY Grey.
 * SUCCESS Green.
 * DANGER Red.
 * WARNING Orange.
 * INFO Light blue.
 */
export enum EColors {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    SUCCESS = 'success',
    DANGER = 'danger',
    WARNING = 'warning',
    INFO = 'info',
}

/**
 * List of themes.
 *
 * LIGHT Светлая.
 * DARK Тёмная.
 */
export enum EThemes {
    LIGHT = 'theme-light',
    DARK = 'theme-dark',
}

/**
 * List of sizes.
 *
 * ES extra small.
 * XS x small.
 * SM small.
 * MD medium.
 * LG Large.
 */
export enum ESizes {
    ES = 'es',
    XS = 'xs',
    SM = 'sm',
    MD = 'md',
    LG = 'lg',
}

/**
 * Перечисление возможных позиций компонентов внутри шаблона.
 */
export enum EPositions {
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right',
}

/**
 * Перечисление keyCode из event.
 *
 * UP Стрелка вверх.
 * DOWN Стрелка вниз.
 * ENTER Кнопка ввода.
 */
export enum EKeyCode {
    UP = 38,
    DOWN = 40,
    ENTER = 13,
    BACK_SPACE = 8,
    SPACE = 32,
    RIGHT = 39,
    LEFT = 37,
}

/**
 * Перечисление типов событийных сообщений.
 *
 * INFO Ро умолчанию.
 * WAITING Ожидание.
 * WARNING Внимание.
 * ERROR Ошибка.
 * SUCCESS Успех.
 */
export enum EMessageType {
    INFO = 'info',
    WAITING = 'waiting',
    WARNING = 'warning',
    ERROR = 'error',
    SUCCESS = 'success',
}
