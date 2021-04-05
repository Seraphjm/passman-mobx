import {IPositionProps, IRipplePosition, TRippleMouseEvent} from 'ui/Common/Models';
import {BaseSyntheticEvent} from 'react';

/**
 * Функция проверяющая, что переданное значение является функцией.
 *
 * @param value Проверяемое значение.
 */

export const isFunction = (value: unknown): boolean => typeof value === 'function';

/**
 * Вычисление позиции для эффекта пульсации внутри контейнера.
 *
 * @param event Событие.
 * @param [container] Контейнер в котором необходимо отобразить эффект пульсации.
 */
export const calcRipplePosition = (event: TRippleMouseEvent, container?: Element): IRipplePosition => {
    // @ts-ignore TODO.TYPES
    const rect = container ? container.getBoundingClientRect() : event.target.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height) ^ 0;
    const X = (event.clientX - rect.left - size / 2) ^ 0;
    const Y = (event.clientY - rect.top - size / 2) ^ 0;

    return {
        height: size,
        width: size,
        top: Y,
        left: X,
    };
};

/**
 * Функция, отменяющая текущее событие и дефолтное поведение.
 *
 * @param e Проверяемое значение.
 */
export const cancelEvent = <T extends Event>(e: T): void => {
    e.preventDefault();
    e.stopPropagation();
};

/**
 * Функция, возвращающая параметры положения и размеров под целевым элементом для выпадающего списка.
 *
 * @param container Целевой контейнер. Может быть передан как event.target, так и просто как элемент.
 * @param [fixTop] Поправка высоты под различные компоненты.
 */
function getPositionProps(container: BaseSyntheticEvent, fixTop?: string): IPositionProps;
function getPositionProps(container: HTMLElement | undefined, fixTop?: string): IPositionProps;
function getPositionProps(container: any, fixTop?: any): any {
    const target = container.target || container;

    if (!target) return {};

    const {y, height, bottom} = target.getBoundingClientRect();
    const heightContainer = document.body.clientHeight || 200;

    return {
        maxHeight: heightContainer - y - height * 2,
        top: fixTop ? `calc(${bottom}px - ${fixTop})` : bottom,
    };
}

export {getPositionProps};

/**
 * Функция возвращающая uuid.
 *
 * @example b970d1da-4aa7-19d4-7881-974f95d5ad39.
 */
export const uuid = (): string => {
    let key: string = '';

    for (let block = 0; 5 > block; block++) {
        const getLength = block === 0 ? 8 : block < 4 ? 4 : 12;
        const rnd = window.crypto.getRandomValues(new Uint32Array(2));
        const hex = (rnd[0].toString(16) + rnd[1].toString(16)).substring(0, getLength);

        block < 4 ? (key += `${hex}-`) : (key += hex);
    }

    return key;
};
