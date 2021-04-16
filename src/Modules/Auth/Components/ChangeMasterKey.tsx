import {FunctionComponent, useState} from 'react';
import {useIntl} from 'react-intl';
import {Link} from 'react-router-dom';
import {observer} from 'mobx-react';
import {EPositions} from 'ui/Common/Enums';
import {SVGIcon} from 'ui';
import {faLongArrowAltLeft} from '@fortawesome/free-solid-svg-icons';
import {useAuthorizationStore} from '../Store/Hooks';
import {TemplateAuthForm} from './AuthorizationForm/TemplateAuthForm';
import {AuthorizationBody, AuthorizationFooter, AuthorizationHeader} from './AuthorizationForm/AuthorizationForm';
import {AUTH_ROUTE_NAMES} from '../Router/Routes';
import '../Pages/Authorization.style.scss';

/**
 * Форма изменения пароля пользователя.
 */
const ChangeMasterKey: FunctionComponent = observer(() => {
    const {formatMessage} = useIntl();
    const auth = useAuthorizationStore();
    // eslint-disable-next-line
    const [fields, setFields] = useState({
        currentPassword: {
            value: '',
            errors: [],
        },
        newPassword: {
            value: '',
            errors: [],
        },
        repeateNewPassword: {
            value: '',
            errors: [],
        },
    });

    const changeField = () => {};

    const hideSymbols = () => {};

    const changeMasterPassword = () => {
        auth.changeMasterPassword('42');
    };

    return (
        <TemplateAuthForm>
            <AuthorizationHeader className="inline">
                <Link style={{marginRight: '.75rem'}} to={AUTH_ROUTE_NAMES.ENTER_PASSWORD}>
                    <SVGIcon icon={faLongArrowAltLeft} />
                </Link>
                <h4>{formatMessage({id: 'TEXT__CHANGES_MASTER_PASSWORD'})}</h4>
            </AuthorizationHeader>

            <AuthorizationBody position={EPositions.CENTER}>
                <input
                    value={fields.currentPassword.value}
                    type="password"
                    placeholder={formatMessage({id: 'TEXT__ENTER_PASSWORD'})}
                    onInput={changeField}
                />
                <input
                    value={fields.newPassword.value}
                    type="password"
                    placeholder={formatMessage({id: 'TEXT__ENTER_PASSWORD'})}
                    disabled={!fields.currentPassword.value}
                    onInput={changeField}
                />
                <input
                    value={fields.repeateNewPassword.value}
                    type="password"
                    placeholder={formatMessage({id: 'TEXT__ENTER_PASSWORD'})}
                    disabled={!fields.newPassword.value}
                    onInput={changeField}
                />
            </AuthorizationBody>

            <AuthorizationFooter position={EPositions.CENTER}>
                <label>
                    {formatMessage({id: 'TEXT__HIDE_SYMBOLS'})}
                    <input onChange={hideSymbols} type="checkbox" />
                </label>

                <button onClick={changeMasterPassword} disabled={!auth.password}>
                    {formatMessage({id: 'ACTION__CHANGE'})}
                </button>
            </AuthorizationFooter>
        </TemplateAuthForm>
    );
});

export default ChangeMasterKey;
