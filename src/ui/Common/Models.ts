import {EMessageType, EPositions} from './Enums';
import {ChangeEvent, PointerEvent, MouseEvent} from 'react';

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
 * @prop [type] Тип события.
 * @prop [text] Сообщение к событию.
 */
export interface IEventMessage {
    type?: EMessageType;
    text?: string;
}

/**
 * Модель свойств ripple.
 *
 * @prop height Одноимённое css свойство.
 * @prop width Одноимённое css свойство.
 * @prop top Одноимённое css свойство.
 * @prop left Одноимённое css свойство.
 * @prop [display] Одноимённое css свойство.
 */
export interface IRipplePosition {
    height: number;
    width: number;
    top: number;
    left: number;
    display?: string;
}

/**
 * Модель свойств позиции.
 *
 * @prop maxHeight Одноимённое css свойство.
 * @prop top Одноимённое css свойство.
 */
export interface IPositionProps {
    maxHeight: number;
    top: string;
}

/**
 * Тип события для генерации свойств ripple.
 */
export type TRippleMouseEvent = (ChangeEvent & PointerEvent) | MouseEvent;
