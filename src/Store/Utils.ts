/**
 * Функция, копирующая рекурсивно объект. Необходимо для удаления подписок mobx, чтобы избежать не нужных сайд-эффектов.
 *
 * @param observeObject Объект из mobx.
 * @param init init-Объект в который будет скопирован observeObject без наблюдателей.
 */
export function clearObserve<T>(observeObject: T, init: any = {}) {
    for (let prop in observeObject) {
        // @ts-ignore
        if (observeObject.hasOwnProperty(prop)) {
            const current = observeObject[prop];

            if (typeof current === 'object' && !Array.isArray(current)) {
                init[prop] = {};
                clearObserve(current, init[prop]);
            } else if (Array.isArray(current)) {
                init[prop] = [...current];
            } else init[prop] = current;
        }
    }

    return init;
}
