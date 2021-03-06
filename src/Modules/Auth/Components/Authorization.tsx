import {FunctionComponent, useEffect, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {observer} from 'mobx-react';
import {ESizes, Button, EMessageType, EPositions, SVGIcon, InputGroup} from 'ui';
import {IEventMessage} from 'ui/Common/Models';
import classNames from 'classnames';
import {AuthorizationBody, AuthorizationFooter, AuthorizationHeader} from './AuthorizationForm/AuthorizationForm';
import {TemplateAuthForm} from './AuthorizationForm/TemplateAuthForm';
import {useAuthorizationStore} from '../Store/Hooks';
import {faCheck, faSignInAlt} from '@fortawesome/free-solid-svg-icons';
import style from './AuthorizationForm/AuthorizationForm.style.module.scss';

/**
 * Форма авторизации пользователя.
 */
export const Authorization: FunctionComponent = observer(() => {
    /** Интернационализация */
    const {formatMessage} = useIntl();
    /** store авторизации экшены и состояние*/
    const auth = useAuthorizationStore();
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
                text: formatMessage({id: 'TEXT__MAIN_STORE_IS_EMPTY'}),
            });
        }
        // eslint-disable-next-line
    }, []);

    /**
     * Метод, определяющий режим режим работы окна авторизации (создать новую бд/запросить доступ).
     */
    const checkAccess = () => {
        auth.dbIsEmpty ? createDB() : requestAccess();
    };

    /**
     * Метод, выполняющий вход в учётную запись
     */
    const requestAccess = () => {
        animate && setAnimate(false);
        auth.logIn().then(
            () => {
                // todo.NOTIFICATION //maybe
            },
            () => {
                setAnimate(true);
                setMessage({type: EMessageType.ERROR, text: formatMessage({id: 'TEXT__ERROR_AUTHORIZATION'})});
                //@ts-ignore
                ref.current?.focus();
            }
        );
    };

    /**
     * Метод, создающий БД
     */
    const createDB = async () => {
        animate && setAnimate(false);
        // если пароль вводится первый раз
        if (!~createPassword.repeat || !createPassword.repeat) {
            setCreatePassword({
                repeat: 1,
                password: auth.password,
            });
            auth.setPassword('');
            setMessage({type: EMessageType.INFO, text: formatMessage({id: 'TEXT__REPEAT_PASSWORD'})});
            // Если повторно ввели правильно..
        } else if (auth.password === createPassword.password) {
            await auth.createDB();
            auth.setPassword('');
            setMessage({type: EMessageType.SUCCESS, text: formatMessage({id: 'TEXT__PASSWORD_SET_SUCCESS'})});
            // если при повторе произошла ошибка
        } else {
            setCreatePassword({
                repeat: 0,
                password: '',
            });
            auth.setPassword('');
            setAnimate(true);
            setMessage({type: EMessageType.ERROR, text: formatMessage({id: 'TEXT__PASSWORDS_DIDNT_MATCH'})});
        }

        //@ts-ignore
        ref.current?.focus();
    };

    return (
        <TemplateAuthForm>
            <AuthorizationHeader>
                <h4>{formatMessage({id: 'LABEL__AUTHORIZATION'})}</h4>
            </AuthorizationHeader>

            <AuthorizationBody position={EPositions.CENTER}>
                <InputGroup
                    className={animate ? 'animated' : undefined}
                    inputRef={ref}
                    value={auth.password}
                    type="password"
                    placeholder={formatMessage({id: 'TEXT__ENTER_PASSWORD'})}
                    disabled={auth.isChecking}
                    autoFocus={true}
                    onInput={auth.setPassword}
                    onEnter={checkAccess}
                    message={{type: message?.type}}
                >
                    <Button
                        onClick={checkAccess}
                        disabled={!auth.password}
                        icon={<SVGIcon icon={auth.dbIsEmpty ? faCheck : faSignInAlt} />}
                        className="authorization__button"
                        size={ESizes.SM}
                    />
                </InputGroup>
            </AuthorizationBody>

            <AuthorizationFooter position={EPositions.CENTER}>
                {message && <b className={classNames(style.auth__message_container, 'pre-line', message.type)}>{message.text}</b>}
            </AuthorizationFooter>
        </TemplateAuthForm>
    );
});
