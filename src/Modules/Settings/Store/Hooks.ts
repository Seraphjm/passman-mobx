import {useContext} from 'react';
import {RootStoreContext} from 'Store';
import {ISettingsStore} from './Models';
import {TRootStore} from 'Store/Models';

export function useSettings(): ISettingsStore {
    return useContext<TRootStore>(RootStoreContext).settings as ISettingsStore;
}
