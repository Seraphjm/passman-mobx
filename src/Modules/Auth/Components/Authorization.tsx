import React, {ChangeEvent, FunctionComponent, useState} from 'react';
import {useIntl} from 'react-intl';
import {observer} from 'mobx-react';
import {TemplateAuthForm} from './AuthorizationForm/TemplateAuthForm';
import {AuthorizationBody, AuthorizationFooter, AuthorizationHeader} from './AuthorizationForm/AuthorizationForm';
import {useAuthorization} from '../Store/Hooks';
import {EPositions} from 'ui/Common/Enums';

/**
 * Форма авторизации пользователя.
 */
export const Authorization: FunctionComponent = observer(() => {
    const {formatMessage} = useIntl();
    const auth = useAuthorization();
    // eslint-disable-next-line
    const [error, setError] = useState(false);

    const setKey = ({target}: ChangeEvent<HTMLInputElement>) => {
        auth.setSecretKey(target.value);
    };

    return (
        <TemplateAuthForm>
            <AuthorizationHeader>
                <h4>{formatMessage({id: 'AUTH__FORM_NAME'})}</h4>
            </AuthorizationHeader>

            <AuthorizationBody position={EPositions.CENTER}>
                <div className="authorization__inputContainer">
                    <input
                        value={auth.secretKey}
                        type="password"
                        placeholder={formatMessage({id: 'AUTH__PLACEHOLDER_ENTER_PASS'})}
                        disabled={auth.isChecking}
                        autoFocus={true}
                        onInput={setKey}
                    />

                    <button
                        onClick={auth.checkSecretKey}
                        disabled={!auth.secretKey}
                        className={`authorization__button fas fa-${auth.dbIsEmpty ? 'check' : 'sign-in-alt'}`}
                    />
                </div>
            </AuthorizationBody>

            <AuthorizationFooter position={EPositions.CENTER}>{error && <b>{error}</b>}</AuthorizationFooter>
        </TemplateAuthForm>
    );
});
