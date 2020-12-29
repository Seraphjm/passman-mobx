import {FunctionComponent} from 'react';
import {IAccount} from '../../Models/Account';

/**
 * Модель свойств компонента карточки аккаунта.
 */
interface IProps {
    account: IAccount;
}

/**
 * Компонент отображения данных по аккаунту аккаунта.
 */
export const AccountCard: FunctionComponent<IProps> = ({account}) => {
    return <div style={{border: '1px solid'}}>{account.data.name}</div>;
};
