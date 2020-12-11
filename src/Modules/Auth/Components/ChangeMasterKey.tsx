import {FunctionComponent, useState} from 'react';
import '../Pages/Authorization.style.scss';
import {useIntl} from 'react-intl';
import {useAuthorization} from '../Store/Hooks';
import {TemplateAuthForm} from './AuthorizationForm/TemplateAuthForm';
import {AuthorizationBody, AuthorizationFooter, AuthorizationHeader} from './AuthorizationForm/AuthorizationForm';
import {EPositions} from 'ui/Common/Enums';
import {Link} from 'react-router-dom';
import {AUTH_ROUTE_NAMES} from '../Router/Routes';

/**
 * Форма изменения пароля пользователя.
 */
const ChangeMasterKey: FunctionComponent = () => {
    const {formatMessage} = useIntl();
    const auth = useAuthorization();
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
                    <i className="fas fa-long-arrow-alt-left" />
                </Link>
                <h4>{formatMessage({id: 'AUTH__FORM_CHANGE_PASSWORD'})}</h4>
            </AuthorizationHeader>

            <AuthorizationBody position={EPositions.CENTER}>
                <input
                    value={fields.currentPassword.value}
                    type="password"
                    placeholder={formatMessage({id: 'AUTH__PLACEHOLDER_ENTER_PASS'})}
                    onInput={changeField}
                />
                <input
                    value={fields.newPassword.value}
                    type="password"
                    placeholder={formatMessage({id: 'AUTH__PLACEHOLDER_ENTER_PASS'})}
                    disabled={!fields.currentPassword.value}
                    onInput={changeField}
                />
                <input
                    value={fields.repeateNewPassword.value}
                    type="password"
                    placeholder={formatMessage({id: 'AUTH__PLACEHOLDER_ENTER_PASS'})}
                    disabled={!fields.newPassword.value}
                    onInput={changeField}
                />
            </AuthorizationBody>

            <AuthorizationFooter position={EPositions.CENTER}>
                <label>
                    {formatMessage({id: 'COMMON__HIDE_SYMBOLS'})}
                    <input onChange={hideSymbols} type="checkbox" />
                </label>

                <button onClick={changeMasterPassword} disabled={!auth.secretKey}>
                    {formatMessage({id: 'COMMON__CHANGE'})}
                </button>
            </AuthorizationFooter>
        </TemplateAuthForm>
    );
};

export default ChangeMasterKey;
