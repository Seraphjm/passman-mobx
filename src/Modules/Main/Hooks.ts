import {useMemo} from 'react';
import {useIntl} from 'react-intl';
import {useMainStore} from './Store/Hooks';

/**
 * Хук, необходимый для быстрого доступа к состоянию главной страницы.
 */
export function useCategoryName(categoryId: string): string {
    const {formatMessage} = useIntl();
    const main = useMainStore();

    return useMemo<string>((): string => {
        const name = main.categories.find((category) => category.id === categoryId)?.name || '';
        const id = `categoryName:${name}`;
        const message = formatMessage({id});
        return message === id ? name : message;
        // eslint-disable-next-line
    }, [main.categories, categoryId]);
}
