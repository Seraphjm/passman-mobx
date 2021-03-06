import {
    ChangeEvent,
    FocusEvent,
    FormEvent,
    forwardRef,
    ForwardRefExoticComponent,
    FunctionComponent,
    KeyboardEvent,
    RefAttributes,
    useEffect,
    useRef,
    useState,
} from 'react';
import classNames from 'classnames';
import {go} from 'fuzzysort';
import {InputPlaceholder} from 'ui/Common/InnerComponents/InputPlaceholder/InputPlaceholder';
import {InputFilled} from 'ui/Common/InnerComponents/InputFilled/InputFilled';
import {InputMessage} from 'ui/Common/InnerComponents/InputMessage/InputMessage';
import {useHiddenListFromWindow, usePrevious, useRemoteScrollControl} from 'ui/Common/Hooks';
import {isFunction, getPositionProps} from 'ui/Utils';
import {EKeyCode} from 'ui/Common/Enums';
import {Highlight} from 'ui/Components/Highlight/Highlight';
import {IFuzzySortResult, IPositionProps} from 'ui/Common/Models';
import {IAutoComplete, ICompleteItem, IInput} from './Models';
import './Input.style.scss';

/**
 * Экспортируемый контейнер компонента, предоставляющий ref элемента input.
 */
export const Input: ForwardRefExoticComponent<IInput & RefAttributes<HTMLInputElement>> = forwardRef<HTMLInputElement, IInput>(
    (props, ref) => <InputComp inputRef={ref} {...props} />
);

/**
 * Контейнер компонента, предоставляющий его текущий ref.
 */
const InputContainer: any = forwardRef<HTMLDivElement, IInput>(({children, className, message}, ref) => (
    <div ref={ref} className={classNames('ui-lib-input', className, message?.type)}>
        {children}
    </div>
));

// TODO.REFACTOR: отвзять состояние автокомплита от инпута. Попытку делал, но получилось не очень эффективно.
/**
 * UI компонент инпута с поддержкой автокомплита с нечётким поиском.
 */
const InputComp: FunctionComponent<IInput> = ({
    className,
    message,
    value = '',
    onInput,
    autoFocus,
    placeholder,
    required,
    autoComplete = [],
    onFocus,
    onBlur,
    onKeyUp,
    onKeyDown,
    onEnter,
    type,
    disabled,
    inputRef,
    dataBind,
}) => {
    const ref = useRef<HTMLElement>();
    /** Флаг открытия автокомплита */
    const [autoCompleteIsOpen, setAutoCompleteIsOpen] = useState<boolean>(false);
    /** Список элементов автокомплита. УДАЛЯЮТСЯ ДУБЛИКАТЫ. */
    const [autoCompleteList, setAutoCompleteList] = useState<string[]>([...new Set([...autoComplete])]);
    /** Выбранный элемент из списка автокомплита */
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    /** Значение выбранное с помощью мышки */
    const [mouseSelected, setMouseSelected] = useState<number | null>(null);
    /** Значение параметров положения и размерностей для контейнера автокомплита */
    const [style, setStyle] = useState<IPositionProps>();
    /** Флаг использования навигационных кнопок в автокомплите */
    const [usedKey, setUsedKey] = useState<boolean>(false);
    /** Предыдущее значение инпута */
    const prevValue = usePrevious<string | undefined>(value);

    /**
     * Отслеживание смены выбранного элемента и установка значения инпута, если не используются навигационные клавиши.
     */
    useEffect(() => {
        if (autoCompleteList.length && selectedItem !== null && !usedKey) onInput(autoCompleteList[selectedItem]);
        // eslint-disable-next-line
    }, [selectedItem]);

    /**
     * Отслеживание текущего value с целью раскрытия автокомплита, когда он ранее уже был скрыт, но возобновился ввод.
     */
    useEffect(() => {
        if (autoCompleteList.length && !autoCompleteIsOpen && !usedKey && value && prevValue !== undefined) {
            setAutoCompleteIsOpen(true);
        }
        // eslint-disable-next-line
    }, [value, usedKey]);

    /**
     * Хук, отслеживающий window-события, и скрывающий выпадающий список по ним.
     */
    useHiddenListFromWindow(onBlurHandler);

    /**
     * Реализация нечёткого поиска по списку автокомплита.
     *
     * @param value Текущее значение введённое в инпут.
     * @param autoComplete Список для автокомплита по которому произойдёт поиск.
     */
    const search = (value: string, autoComplete: string[]): string[] => {
        const sortedChildes = autoComplete.sort((a, b) => (a > b ? 1 : -1));
        if (!value) return sortedChildes;
        //@ts-ignore
        const filtered: IFuzzySortResult[] = go(value, autoComplete, {
            limit: 100,
        });

        return filtered.length ? filtered.sort((a, b) => (a.score < b.score ? 1 : -1)).map(({target}) => target) : sortedChildes;
    };

    /**
     * Обработчик ввода передающий значение из инпута в onInput.
     *
     * @param value Значение из инпута.
     */
    const onInputHandler = ({currentTarget: {value}}: FormEvent<HTMLInputElement>) => {
        if (autoComplete?.length) {
            selectedItem !== null && setSelectedItem(null);
            mouseSelected !== null && setMouseSelected(null);

            setAutoCompleteList(search(value, autoComplete));
        }
        onInput(value, dataBind || null);
    };

    /**
     * Обработчик фокуса. Так же устанавливает базовые параметры для контейнера автокомплита, если он есть.
     *
     * @param e Событие полученное из фокуса.
     */
    const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => {
        if (autoCompleteList.length) {
            setStyle(getPositionProps(e));
            setAutoCompleteIsOpen(true);
        }

        //@ts-ignore ложноположительное срабатывание.
        if (isFunction(onFocus)) onFocus(e);
    };

    /**
     * Обработчик потери фокуса.
     *
     * @param e Событие полученное из фокуса.
     */
    function onBlurHandler(e: FocusEvent<HTMLInputElement>) {
        if (e.target.className === 'ui-lib-auto-complete') return;

        if (autoCompleteList?.length) {
            if (mouseSelected !== null) {
                onInput(autoCompleteList[mouseSelected]);
                setUsedKey(true);
                setMouseSelected(null);
            }

            setSelectedItem(null);
            setAutoCompleteIsOpen(false);
        }

        //@ts-ignore ложноположительное срабатывание.
        if (isFunction(onBlur)) onBlur(e);
    }

    /**
     * Обработчик onKeyDown. В основном содержит логику для автокомплита.
     *
     * @param e Событие полученное при вводе.
     */
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        const {keyCode} = e;
        if (autoCompleteList.length) {
            const endPosition = autoCompleteList.length - 1;

            if (EKeyCode[keyCode]) {
                !usedKey && setUsedKey(true);
            }

            switch (keyCode) {
                case EKeyCode.UP:
                    if (!selectedItem) setSelectedItem(endPosition);
                    else setSelectedItem(selectedItem - 1);

                    break;
                case EKeyCode.DOWN:
                    if (selectedItem === null || selectedItem === endPosition) setSelectedItem(0);
                    else setSelectedItem(selectedItem + 1);
                    break;
                case EKeyCode.ENTER:
                    selectedItem !== null && onInput(autoCompleteList[selectedItem]);
                    setAutoCompleteIsOpen(false);
                    break;
                default:
                    usedKey && setUsedKey(false);
                    break;
            }
        } else if (isFunction(onEnter) && keyCode === EKeyCode.ENTER) {
            //@ts-ignore ложноположительное срабатывание.
            onEnter(value);
        }

        //@ts-ignore ложноположительное срабатывание.
        if (isFunction(onKeyDown)) onKeyDown(e);
    };

    /**
     * Обработчик onKeyUp.
     *
     * @param e Событие полученное при вводе.
     */
    const onKeyUpHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        //@ts-ignore ложноположительное срабатывание.
        if (isFunction(onKeyUp)) onKeyUp(e);
    };

    return (
        <InputContainer ref={ref} className={className} message={message}>
            <input
                ref={inputRef}
                type={type}
                className="ui-lib-input__controller ui-lib__input--controller"
                placeholder={'\u2063'}
                value={value}
                onInput={onInputHandler}
                autoFocus={autoFocus}
                onFocus={onFocusHandler}
                onBlur={onBlurHandler}
                onKeyUp={onKeyUpHandler}
                onKeyDown={onKeyDownHandler}
                disabled={disabled}
            />

            {placeholder && <InputPlaceholder required={required}>{placeholder}</InputPlaceholder>}

            <InputFilled />

            {!!autoCompleteList.length && (
                <AutoComplete
                    isOpen={autoCompleteIsOpen}
                    autoComplete={autoCompleteList}
                    selectedItem={selectedItem}
                    style={{...style, width: ref?.current?.offsetWidth}}
                    setMouseSelected={setMouseSelected}
                    value={value}
                />
            )}

            {message?.text && <InputMessage>{message.text}</InputMessage>}
        </InputContainer>
    );
};

/**
 * Компонент автокомплита.
 */
const AutoComplete: FunctionComponent<IAutoComplete> = (props) => {
    const {style, setMouseSelected, selectedItem} = props;
    const ref = useRef<HTMLElement>();

    useRemoteScrollControl(ref, selectedItem);

    /**
     * Обработчик мыши на наведение на элемент автокомплита.
     *
     * @param target Текущий элемент под указателем мыши.
     */
    const mouseHandlerOver = ({target}: ChangeEvent<HTMLElement>): void => {
        const index = target.dataset.index;
        index !== undefined && setMouseSelected(+index);
    };

    /**
     * Обработчик мыши на покидание области контейнера.
     */
    const mouseHandlerLeave = (): void => {
        setMouseSelected(null);
    };

    return props.isOpen ? (
        <ListContainer
            ref={ref}
            className="ui-lib__drop-list"
            style={style}
            onMouseOver={mouseHandlerOver}
            onMouseLeave={mouseHandlerLeave}
        >
            {props.autoComplete.map((item: string, i: number) => (
                <CompleteItem value={props.value} key={item} isActive={selectedItem === i} index={i}>
                    {item}
                </CompleteItem>
            ))}
        </ListContainer>
    ) : null;
};

/**
 * Контейнер автокомплита с forwardRef. Необходимо для контроля скролла.
 */
export const ListContainer: any = forwardRef<HTMLUListElement, IAutoComplete>((props, ref) => (
    <ul ref={ref} {...props}>
        {props.children}
    </ul>
));

/**
 * Компонент элемента из списка автокомплита.
 */
const CompleteItem: FunctionComponent<ICompleteItem> = (props) => (
    <li data-index={props.index} className={classNames('ui-lib-option', {'active-item': props.isActive})}>
        <Highlight search={props.value || ''} text={`${props.children}`} />
    </li>
);
