/**
 * Функция проверяющая, что переданное значение является функцией.
 *
 * @param value Проверяемое значение.
 */
export const isFunction = (value: unknown): boolean => typeof value === 'function';

export const calcRipplePosition = (event: any, container?: any) => {
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

export const cancelEvent = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
};
