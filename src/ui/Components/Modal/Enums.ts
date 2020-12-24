/**
 * Перечисление положения контента внутри контентных компонентов.
 *
 * Реализуется через justify-content|flex. api идентичное.
 */
export enum EModalContentPosition {
    LEFT = 'flex-start',
    CENTER = 'center',
    RIGHT = 'flex-end',
    SPACE_BETWEEN = 'space-between',
    SPACE_AROUND = 'space-around',
    SPACE_EVENLY = 'space-evenly',
}
