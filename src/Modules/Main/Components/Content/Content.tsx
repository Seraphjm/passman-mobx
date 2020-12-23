import {FunctionComponent} from 'react';
import {observer} from 'mobx-react';
import {useMain} from '../../Store/Hooks';
import {AccountCard} from '../AccountCard/AccountCard.';
import {useIntl} from 'react-intl';
import './Content.style.scss';

export const Content: FunctionComponent = observer(() => {
    const {searchedAccounts} = useMain();
    const {formatMessage} = useIntl();

    return (
        <div className="content">
            {searchedAccounts.length ? (
                <div className="accounts-container">
                    <AccountCard />
                </div>
            ) : (
                <div className="nothing-found v-center">{formatMessage({id: 'MAIN__ACCOUNT_NOTHING_FOUND'})}</div>
            )}
        </div>
    );
});
