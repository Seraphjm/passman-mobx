import {BaseSyntheticEvent, FunctionComponent, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {observer} from 'mobx-react';
import {Button, ESizes, InputGroup, RadioButton, RadioSelectButton, SVGIcon} from 'ui';
import {IEventMessage} from 'ui/Common/Models';
import {faSync} from '@fortawesome/free-solid-svg-icons';
import {faCopy} from '@fortawesome/free-regular-svg-icons';
import {useMainStore} from 'Modules/Main/Store/Hooks';
import {EPasswordPatterns} from 'Utils/Enums';
import {passwordGenerate, copyToClipboard} from 'Utils/Utils';
import './PassGen.style.scss';

/**
 * Свойства компонента генерации пароля.
 *
 * @prop [required] Флаг обязательности заполнения.
 * @prop [message] Сообщение к полю input.
 */
interface IPassGen {
    required?: boolean;
    message?: IEventMessage;
}

/**
 * Компонент для генерации пароля. Предоставляет возможности установки длинны, паттерна и ручного редактирования.
 */
export const PassGen: FunctionComponent<IPassGen> = observer((props) => {
    /** При размонтировании сбрасываем пароль */
    // eslint-disable-next-line
    useEffect(() => passGen, []);

    /** mobx store */
    const main = useMainStore();
    /** Интернационализация */
    const {formatMessage} = useIntl();

    /** Состояние паттерна пароля */
    const [pattern, setPattern] = useState<EPasswordPatterns>(EPasswordPatterns.LOWER_UPPER_NUMBER);

    /** Состояние длина пароля */
    const [length, setLength] = useState<number>(16);

    /**
     * Обработчик ручного изменения пароля.
     *
     * @param password Новый пароль.
     */
    const onInput = (password: string): void => {
        setPassword(password);
    };

    /**
     * Функция, вызывающая экшн для установки пароля в прототип аккаунта.
     *
     * @param password Новый пароль.
     */
    const setPassword = (password?: string): void => {
        main.setFieldAccountPrototype('data.password', password);
    };

    /**
     * Обработчик изменения паттерна пароля.
     *
     * @param pattern Новый паттерн.
     */
    const updatePattern = (pattern: EPasswordPatterns): void => {
        setPattern(pattern);
        passGen(pattern, length);
    };

    /**
     * Обработчик обновления пароля с учётом выставленных параметров.
     */
    const onUpdate = (): void => {
        passGen(pattern, length);
    };

    /**
     * Обработчик копирования пароля в буфер обмена.
     */
    const onCopy = (): void => {
        copyToClipboard(main.accountPrototype.data.password);
        // todo.NOTIFICATION
    };

    /**
     * Обработчик установки длины пароля.
     *
     * @param e Событие, содержащее в target.value длину пароля.
     */
    const setPassLength = (e: BaseSyntheticEvent): void => {
        const length = e.target.value;
        setLength(length);
        passGen(pattern, length);
    };

    /**
     * Функция, вызывающая генерацию пароля в соответствии с переданными параметрами, вызывающая последующее
     * сохранение в прототип аккаунта.
     *
     * @param pattern Паттерн пароля.
     * @param length Длина пароля.
     */
    const passGen = (pattern = EPasswordPatterns.LOWER_UPPER_NUMBER, length: number = 16): void => {
        setPassword(passwordGenerate(pattern, length));
    };

    return (
        <div className="pass-gen">
            <InputGroup
                required={props.required}
                className="pass-gen__password"
                onInput={onInput}
                placeholder={formatMessage({id: 'placeholder:password'})}
                value={main.accountPrototype.data.password}
            >
                <Button onClick={onUpdate} size={ESizes.ES}>
                    <SVGIcon icon={faSync} />
                </Button>
                <Button onClick={onCopy} size={ESizes.ES}>
                    <SVGIcon icon={faCopy} />
                </Button>
            </InputGroup>

            <div className="pass-gen__pattern">
                <RadioSelectButton onChange={updatePattern} size={ESizes.ES} value={pattern}>
                    <RadioButton value={EPasswordPatterns.LOWER_UPPER_NUMBER}>a-z A-Z 0-9</RadioButton>
                    <RadioButton value={EPasswordPatterns.LOWER_UPPER_NUMBER_}>a-z A-Z 0-9 _</RadioButton>
                    <RadioButton value={EPasswordPatterns.LOWER_UPPER_NUMBER_SPECIAL}>a-z A-Z 0-9 _!@#$%^&*+</RadioButton>
                </RadioSelectButton>
            </div>

            <div className="pass-gen__length">
                <div className="pass-gen__length-text">{formatMessage({id: 'COMMON__PASSWORD_LENGTH'})}:</div>
                <input type="number" className="pass-gen__length-control" onInput={setPassLength} value={length} />
            </div>
        </div>
    );
});
