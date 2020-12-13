import React, {FunctionComponent, useState} from 'react';
import {useIntl} from 'react-intl';
import {observer} from 'mobx-react';
import {TemplateAuthForm} from './AuthorizationForm/TemplateAuthForm';
import {AuthorizationBody, AuthorizationFooter, AuthorizationHeader} from './AuthorizationForm/AuthorizationForm';
import {EPositions} from 'ui/Common/Enums';
import {useAuthorization} from '../Store/Hooks';
import {Input} from 'ui';
// import {EMessageType} from 'ui/Components/Input/Enums';

/**
 * Форма авторизации пользователя.
 */
export const Authorization: FunctionComponent = observer(() => {
    const {formatMessage} = useIntl();
    const auth = useAuthorization();
    // eslint-disable-next-line
    const [error, setError] = useState(false);

    const setKey = (password: string) => {
        auth.setSecretKey(password);
    };

    const requestAccess = (password: string) => {
        console.log(password);
    };

    return (
        <TemplateAuthForm>
            <AuthorizationHeader>
                <h4>{formatMessage({id: 'AUTH__FORM_NAME'})}</h4>
            </AuthorizationHeader>

            <AuthorizationBody position={EPositions.CENTER}>
                <div className="authorization__input-container">
                    <Input
                        value={auth.secretKey}
                        type="password"
                        placeholder={formatMessage({id: 'AUTH__PLACEHOLDER_ENTER_PASS'})}
                        disabled={auth.isChecking}
                        autoFocus={true}
                        onInput={setKey}
                        onEnter={requestAccess}
                        autoComplete={['Vladimir', 'Natali', 'Aleksey', 'Alexandr', 'Anton', 'Svetlana', 'Valera', 'Igor', 'Nikolay']}
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
