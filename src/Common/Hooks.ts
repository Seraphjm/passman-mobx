import {useEffect, useRef} from 'react';

/**
 * Хук, возвращающий предыдущее значение переданного value.
 *
 * @param value Переданное значение.
 */
export const usePrevious = <T extends unknown>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};
