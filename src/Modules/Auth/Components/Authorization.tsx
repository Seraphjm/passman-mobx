import {FunctionComponent, useEffect, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {observer} from 'mobx-react';
import {Input} from 'ui';
import {EMessageType, EPositions} from 'ui/Common/Enums';
import {IEventMessage} from 'ui/Common/Models';
import classNames from 'classnames';
import {AuthorizationBody, AuthorizationFooter, AuthorizationHeader} from './AuthorizationForm/AuthorizationForm';
import {TemplateAuthForm} from './AuthorizationForm/TemplateAuthForm';
import {useAuthorization} from '../Store/Hooks';
import style from './AuthorizationForm/AuthorizationForm.style.module.scss';

/**
 * Форма авторизации пользователя.
 */
export const Authorization: FunctionComponent = observer(() => {
    /** Интернационализация */
    const {formatMessage} = useIntl();
    /** store авторизации экшены и состояние*/
    const auth = useAuthorization();
    /** Сообщения приходящие в процессе авторизации/создании БД */
    const [message, setMessage] = useState<IEventMessage>();
    /** флаг анимации инпута */
    const [animate, setAnimate] = useState<boolean>(false);
    /** Информация необходимая для создания пароля при первом входе. */
    const [createPassword, setCreatePassword] = useState({
        repeat: -1,
        password: '',
    });

    /** ref на инпут. Необходимо для установки фокуса */
    const ref = useRef();

    useEffect(() => {
        if (auth.dbIsEmpty) {
            setMessage({
                type: EMessageType.ERROR,
                text: formatMessage({id: 'AUTH__FORM_ERR_STORE_IS_EMPTY'}),
            });
        }
        // eslint-disable-next-line
    }, []);

    const checkAccess = () => {
        auth.dbIsEmpty ? createDB() : requestAccess();
    };

    /** Метод, выполняющий вход в учётную запись */
    const requestAccess = () => {
        animate && setAnimate(false);
        auth.logIn().then(
            () => {
                console.log('EVENT:SUCCESS');
            },
            () => {
                setAnimate(true);
                setMessage({type: EMessageType.ERROR, text: formatMessage({id: 'AUTH__FORM_ERR_AUTH'})});
                //@ts-ignore
                ref?.current?.focus();
            }
        );
    };

    /** Метод, создающий БД */
    const createDB = async () => {
        animate && setAnimate(false);
        // если пароль вводится первый раз
        if (!~createPassword.repeat || !createPassword.repeat) {
            setCreatePassword({
                repeat: 1,
                password: auth.password,
            });
            auth.setPassword('');
            setMessage({type: EMessageType.INFO, text: formatMessage({id: 'AUTH__FORM_CH_MK_REPEAT'})});
            // Если повторно ввели правильно..
        } else if (auth.password === createPassword.password) {
            await auth.createDB();
            auth.setPassword('');
            setMessage({type: EMessageType.SUCCESS, text: formatMessage({id: 'AUTH__FORM_CH_MK_SUCCESS'})});
            // если при повторе произошла ошибка
        } else {
            setCreatePassword({
                repeat: 0,
                password: '',
            });
            auth.setPassword('');
            setAnimate(true);
            setMessage({type: EMessageType.ERROR, text: formatMessage({id: 'AUTH__FORM_CH_MK_ERR_COINCIDENCE'})});
        }

        //@ts-ignore
        ref?.current?.focus();
    };

    return (
        <TemplateAuthForm>
            <AuthorizationHeader>
                <h4>{formatMessage({id: 'AUTH__FORM_NAME'})}</h4>
            </AuthorizationHeader>

            <AuthorizationBody position={EPositions.CENTER}>
                <div className="authorization__input-container">
                    <Input
                        className={animate ? 'animated' : undefined}
                        inputRef={ref}
                        value={auth.password}
                        type="password"
                        placeholder={formatMessage({id: 'AUTH__PLACEHOLDER_ENTER_PASS'})}
                        disabled={auth.isChecking}
                        autoFocus={true}
                        onInput={auth.setPassword}
                        onEnter={checkAccess}
                        message={{type: message?.type}}
                    />

                    <button
                        onClick={checkAccess}
                        disabled={!auth.password}
                        className={`authorization__button fas fa-${auth.dbIsEmpty ? 'check' : 'sign-in-alt'}`}
                    />
                </div>
            </AuthorizationBody>

            <AuthorizationFooter position={EPositions.CENTER}>
                {message && <b className={classNames(style.auth__message_container, 'pre-line', message.type)}>{message.text}</b>}
            </AuthorizationFooter>
        </TemplateAuthForm>
    );
});
