import {useContext} from 'react';
import {RootStoreContext} from 'Store';
import {TRootStore} from 'Store/Models';
import {IMainStore} from './Models';

/**
 * Хук, необходимый для быстрого доступа к состоянию главной страницы.
 */
export function useMain(): IMainStore {
    return useContext<TRootStore>(RootStoreContext).main as IMainStore;
}
