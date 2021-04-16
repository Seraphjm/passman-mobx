import {FunctionComponent, useCallback} from 'react';
import {Button, EColors, ESizes, Modal, ModalBody, ModalFooter, ModalHeader, SVGIcon, TimeoutButton} from 'ui';
import {useIntl} from 'react-intl';
import {faEllipsisH} from '@fortawesome/free-solid-svg-icons/faEllipsisH';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faList} from '@fortawesome/free-solid-svg-icons/faList';
import {IModal} from 'ui/Components/Modal/Models';
import {observer} from 'mobx-react';
import {Logotype} from 'Common/Components/Logotype';
import {useMainStore} from '../../Store/Hooks';
import {useCategoryName} from '../../Hooks';
import {ESetMode} from 'Services/Enums';
import {IAccount} from '../../Models/Account';
import './DeleteAccountsModal.style.scss';
import {faTrash} from '@fortawesome/free-solid-svg-icons/faTrash';

/**
 * Компонент модального окна удаления аккаунтов.
 */
export const DeleteAccountsModal: FunctionComponent<IModal> = observer((props) => {
    /** mobx-store главной страницы */
    const main = useMainStore();
    /** Прокешированное количество выбранных аккаунтов, приведённое к Boolean значению*/
    const deletedListIsEmpty = !main.selectedAccounts.length;
    /** Интернационализация*/
    const {formatMessage} = useIntl();

    /** Функция, удаляющая выбранный аккаунт из списка на удаление */
    const deleteAccountFromList = useCallback(
        (account: IAccount) => () => {
            main.setSelectedAccounts(ESetMode.DELETE, account);
            // todo.NOTIFICATION
        },
        // eslint-disable-next-line
        []
    );

    /** Функция, удаляющая находящиеся в списке аккаунты из БД (внутренний state соответственно подчищается) */
    const deleteAccounts = useCallback(() => {
        main.removeAccounts(main.selectedAccounts);
        props.onClose();
        // todo.NOTIFICATION
        // eslint-disable-next-line
    }, []);

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalHeader onClose={props.onClose}>{formatMessage({id: 'TEXT__CONFIRM_DELETE_ACCOUNTS'})}</ModalHeader>
            <ModalBody>
                <table className="deleted-accounts">
                    <thead className="deleted-accounts__thead">
                        <tr>
                            <th />
                            <th>{formatMessage({id: 'LABEL__NAME'})}</th>
                            <th>{formatMessage({id: 'LABEL__CATEGORY'})}</th>
                            <th>{formatMessage({id: 'LABEL__SUBCATEGORY'})}</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {!deletedListIsEmpty &&
                            main.selectedAccounts.map((account) => (
                                <tr key={account._id} className="deleted-accounts__row">
                                    <td className="deleted-accounts__col deleted-accounts__icon">
                                        <Logotype size={ESizes.MD} logotype={account.logotype} />
                                    </td>
                                    <td className="deleted-accounts__col deleted-accounts__name">{account.name}</td>
                                    <td className="deleted-accounts__col deleted-accounts__category">
                                        <CategoryName categoryId={account.categoryId} />
                                    </td>
                                    <td className="deleted-accounts__col deleted-accounts__subcategory">
                                        {account.subcategory || <SVGIcon color={EColors.SECONDARY} icon={faEllipsisH} />}
                                    </td>
                                    <td
                                        onClick={deleteAccountFromList(account)}
                                        className="deleted-accounts__col deleted-accounts__control"
                                    >
                                        <SVGIcon className="deleted-accounts__control-icon" icon={faTimes} />
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {deletedListIsEmpty && (
                    <div className="deleted-accounts__empty-list">
                        <SVGIcon className="deleted-accounts__empty-icon" icon={faList} />
                        <div className="deleted-accounts__empty-text">{formatMessage({id: 'TEXT__EMPTY_LIST'})}</div>
                    </div>
                )}
            </ModalBody>
            <ModalFooter>
                {!deletedListIsEmpty ? (
                    <TimeoutButton icon={<SVGIcon icon={faTrash} />} onClick={deleteAccounts} type={EColors.DANGER} timeout={5}>
                        {formatMessage({id: 'ACTION__DELETE'})}
                    </TimeoutButton>
                ) : (
                    <Button type={EColors.SUCCESS} onClick={props.onClose}>
                        {formatMessage({id: 'ACTION__CLOSE'})}
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
});

/**
 * Вспомогательный приватный компонент, необходимый для оптимизации с хуком.
 */
const CategoryName: FunctionComponent<{categoryId: string}> = (props) => {
    const categoryName: string = useCategoryName(props.categoryId);
    return <span>{categoryName}</span>;
};
