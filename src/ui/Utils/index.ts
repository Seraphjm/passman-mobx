import {IPositionProps, IRipplePosition} from 'ui/Common/Models';

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
 * @param container Контейнер в котором необходимо отобразить эффект пульсации.
 */
export const calcRipplePosition = (event: any, container?: any): IRipplePosition => {
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
 * @param eventContainer Проверяемое значение.
 * @param [fixTop] Поправка высоты под различные компоненты.
 */
export const getPositionProps = <T extends Event>(eventContainer: T, fixTop?: string): IPositionProps => {
    // @ts-ignore
    const {y, height, bottom} = eventContainer.target.getBoundingClientRect();
    const heightContainer = document.body.clientHeight || 200;

    return {
        maxHeight: heightContainer - y - height * 2,
        top: fixTop ? `calc(${bottom}px - ${fixTop})` : bottom,
    };
};
