import {FunctionComponent} from 'react';
import {IAccount} from '../../Models/Account';

interface IProps {
    account: IAccount;
}

export const AccountCard: FunctionComponent<IProps> = ({account}) => {
    return <div>{account.accountName}</div>;
};
