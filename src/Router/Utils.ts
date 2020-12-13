import {history} from './AppRouterCreator';

/**
 * Функция, осуществляющая редирект по переданному пути.
 *
 * @param path Переданный путь на который осуществится редирект.
 */
export const redirectTo = (path: string): void => {
    history.push(path);
};
