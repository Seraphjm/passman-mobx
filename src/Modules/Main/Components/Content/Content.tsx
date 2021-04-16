import {FunctionComponent} from 'react';
import {observer} from 'mobx-react';
import {useMainStore} from '../../Store/Hooks';
import {AccountCard} from '../AccountCard/AccountCard';
import {useIntl} from 'react-intl';
import notFoundCat from 'Assets/images/not_found_cat.png';
import './Content.style.scss';

/**
 * Компонент отображающий контентную часть приложения в главно окне.
 */
export const Content: FunctionComponent = observer(() => {
    const main = useMainStore();
    /** Интернационализация */
    const {formatMessage} = useIntl();

    return (
        <div className="content">
            {main.showedAccounts.length ? (
                <div className="accounts-container">
                    {main.showedAccounts.map((account) => (
                        <AccountCard key={account._id} account={account} />
                    ))}
                </div>
            ) : (
                <div className="nothing-found v-center">
                    {main.search && <img className="image-not-found" alt={formatMessage({id: 'TEXT__NOTHING_FOUND'})} src={notFoundCat} />}
                    {formatMessage({id: 'TEXT__NOTHING_FOUND'})}
                </div>
            )}
        </div>
    );
});
