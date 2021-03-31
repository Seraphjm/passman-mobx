/**
 * Модель результата по нечёткому поиску.
 *
 * @prop target Входящий в поиск элемент.
 * @prop [obj] Входящий в поиск объект.
 * @prop score Поисковый рейтинг (больше -> лучше).
 */
export interface IFuzzySortResult<T = unknown> {
    target: string;
    obj?: T;
    score: number;
}
