import {EMessageType, EPositions} from './Enums';

/**
 * Модель возможных позиций компонентов шаблона.
 */
export interface IPositions {
    position?: EPositions;
}

/**
 * Модель результата по нечёткому поиску.
 *
 * @prop target Входящий в поиск элемент.
 * @prop score Поисковый рейтинг (больше -> лучше).
 */
export interface IFuzzySortResult {
    target: string;
    score: number;
}

/**
 * Модель событийного сообщения.
 *
 * @prop type Тип события.
 * @prop text Сообщение к событию.
 */
export interface IEventMessage {
    type: EMessageType;
    text: string;
}
