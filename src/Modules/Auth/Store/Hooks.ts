import {useContext} from 'react';
import {RootStoreContext} from 'Store';
import {TRootStore} from 'Store/Models';
import {IAuthorizationStore} from './Models';

/**
 * Хук, необходимый для быстрого доступа к настройкам.
 */
export function useAuthorization(): IAuthorizationStore {
    return useContext<TRootStore>(RootStoreContext).authorization as IAuthorizationStore;
}
