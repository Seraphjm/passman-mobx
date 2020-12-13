import {ChangeEvent, FunctionComponent, useState} from 'react';
import {useIntl} from 'react-intl';
import {observer} from 'mobx-react';
import {EPositions} from 'ui/Common/Enums';
import {TemplateAuthForm} from './AuthorizationForm/TemplateAuthForm';
import {AuthorizationBody, AuthorizationFooter, AuthorizationHeader} from './AuthorizationForm/AuthorizationForm';
import {useAuthorization} from '../Store/Hooks';

/**
 * Форма авторизации пользователя.
 */
export const Authorization: FunctionComponent = observer(() => {
    const {formatMessage} = useIntl();
    const auth = useAuthorization();
    // eslint-disable-next-line
    const [error, setError] = useState(false);

    /**
     * Метод установки пароля пользователя.
     */
    const setPassword = ({target}: ChangeEvent<HTMLInputElement>) => {
        auth.setPassword(target.value);
    };

    return (
        <TemplateAuthForm>
            <AuthorizationHeader>
                <h4>{formatMessage({id: 'AUTH__FORM_NAME'})}</h4>
            </AuthorizationHeader>

            <AuthorizationBody position={EPositions.CENTER}>
                <div className="authorization__inputContainer">
                    <input
                        value={auth.password}
                        type="password"
                        placeholder={formatMessage({id: 'AUTH__PLACEHOLDER_ENTER_PASS'})}
                        disabled={auth.isChecking}
                        autoFocus={true}
                        onInput={setPassword}
                    />

                    <button
                        onClick={auth.logIn}
                        disabled={!auth.password}
                        className={`authorization__button fas fa-${auth.dbIsEmpty ? 'check' : 'sign-in-alt'}`}
                    />
                </div>
            </AuthorizationBody>

            <AuthorizationFooter position={EPositions.CENTER}>
                {error && <b>{error}</b>}
                <button
                    disabled={!auth.dbIsEmpty || !auth.password}
                    onClick={auth.createDB}
                    className={`authorization__button fas fa-${auth.dbIsEmpty ? 'check' : 'sign-in-alt'}`}
                >
                    CREATE
                </button>
                {error && <b>{error}</b>}
            </AuthorizationFooter>
        </TemplateAuthForm>
    );
});
