import {MutableRefObject, useEffect, useRef} from 'react';

/**
 * Хук, возвращающий предыдущее значение переданного value.
 *
 * @param value Переданное значение.
 */
export const usePrevious = <T = unknown>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

/**
 * Хук, контроллирующий скролл контейнера со списком из элементов.
 *
 * @param refContainer Контейнер со скроллом.
 * @param selectedItem Выбранный элемент.
 */
export const useRemoteScrollControl = <T extends HTMLElement>(
    refContainer: MutableRefObject<T | undefined>,
    selectedItem: number | null
) => {
    const prevSelectedItem = usePrevious(selectedItem);

    useEffect(() => {
        if (selectedItem == null) return;

        if (selectedItem !== null && refContainer.current) {
            const {children, scrollHeight, clientHeight, scrollTop} = refContainer.current;
            const scrollBottom = scrollHeight - (scrollHeight - clientHeight - scrollTop);
            const activeChild = children[selectedItem];
            const next: any = children[selectedItem + 1];
            const prev: any = children[selectedItem - 1];

            // @ts-ignore в общем-то кейс с null|0 отрабатывает после ||.
            if (prevSelectedItem > selectedItem || !prevSelectedItem) {
                if (selectedItem === children.length - 1) {
                    children[children.length - 1].scrollIntoView();
                } else if (prev && scrollBottom > prev.offsetTop) activeChild.scrollIntoView();
                else if (selectedItem === 0) activeChild.scrollIntoView();
            } else {
                if (prevSelectedItem === children.length - 1) {
                    children[0].scrollIntoView();
                } else if (next && scrollBottom < next.offsetTop) activeChild.scrollIntoView();
            }
        }
        // eslint-disable-next-line
    }, [selectedItem]);
};

/**
 * Хук, добавляющий слушатель на события resize и scroll.
 * Необходим обычно для выпадающих списков.
 *
 * @param callback CB на событие.
 */
export const useHiddenListFromWindow = (callback: (event: any) => void): void => {
    useEffect(() => {
        window.addEventListener('scroll', callback, true);
        window.addEventListener('resize', callback);

        return () => {
            window.removeEventListener('scroll', callback, true);
            window.removeEventListener('resize', callback);
        };
        // eslint-disable-next-line
    }, []);
};

/**
 * Хук, дающий возможность использовать интервальную логику в рендере. Поддерживает сигнал остановки.
 *
 * @description Реализован через setTimeout с рекурсией. В отличие от setInterval, не ломится через стек вызовов,
 * и выполняется по принципу <<как только - так сразу>>. Поэтому хук должен использоваться только там, где погрешность
 * исполнения в заданную задержку не имеет принципиального значения.
 * @description Нельзя использовать там, где точность исполнения в установленную задержку имеет значение. Для этого
 * необходимо использовать похожую реализацию, но на setInterval.
 *
 * @param callback CB который необходимо выполнить истечению по задержки.
 * @param delay Время задержки в миллисекундах.
 * @param [stopSignal] Сигнал остановки рекурсии.
 */
export const useRecursionTimeout = (callback: () => void, delay: number, stopSignal?: boolean): void => {
    const savedCallback = useRef<() => void>();

    useEffect((): void => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        let id = setTimeout(function t() {
            if (stopSignal) {
                clearTimeout(id);
            } else {
                savedCallback.current && savedCallback.current();
                id = setTimeout(t, delay);
            }
        }, delay);

        return () => clearTimeout(id);
    }, [delay, stopSignal]);
};
