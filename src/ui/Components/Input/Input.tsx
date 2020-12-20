import {
    FormEvent,
    forwardRef,
    FunctionComponent,
    useEffect,
    useRef,
    useState,
    KeyboardEvent,
    FocusEvent,
    ChangeEvent,
    RefAttributes,
    ForwardRefExoticComponent,
} from 'react';
import classNames from 'classnames';
import {go} from 'fuzzysort';
import {useRemoteScrollControl} from 'ui/Common/Hooks';
import {isFunction} from 'ui/Utils';
import {EKeyCode} from 'ui/Common/Enums';
import {Highlight} from 'ui/Components/Highlight/Highlight';
import {IAutoComplete, ICompleteItem, IInput} from './Models';
import {IFuzzySortResult} from 'ui/Common/Models';
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

// TODO: отвзять состояние автокомплита от инпута. Попытку делал, но получилось не очень эффективно.
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
    /** Значение максимальной высоты для контейнера автокомплита */
    const [maxHeight, setMaxHeight] = useState<number>(200);
    /** Флаг использования навигационных кнопок в автокомплите */
    const [usedKey, setUsedKey] = useState<boolean>(false);

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
        if (autoCompleteList.length && !autoCompleteIsOpen && !usedKey && value) {
            setAutoCompleteIsOpen(true);
        }
        // eslint-disable-next-line
    }, [value, usedKey]);

    /**
     * Реализация нечёткого поиска по списку автокомплита.
     *
     * @param value Текущее значение введённое в инпут.
     * @param autoComplete Список для автокомплита по которому произойдёт поиск.
     */
    const search = (value: string, autoComplete: string[]): string[] => {
        //@ts-ignore
        const filtered: IFuzzySortResult[] = go(value, autoComplete, {
            limit: 100,
        });

        return filtered.sort((a, b) => (a.score < b.score ? 1 : -1)).map(({target}) => target);
    };

    /**
     * Обработчик ввода передающий значение из инпута в onInput.
     *
     * @param value Значение из инпута.
     */
    const onInputHandler = ({currentTarget: {value}}: FormEvent<HTMLInputElement>) => {
        if (autoComplete?.length) {
            if (selectedItem !== null) setSelectedItem(null);

            setAutoCompleteList(value ? search(value, autoComplete) : autoComplete);
        }

        onInput(value);
    };

    /**
     * Обработчик фокуса. Так же устанавливает базовые параметры для контейнера автокомплита, если он есть.
     *
     * @param e Событие полученное из фокуса.
     */
    const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => {
        if (autoCompleteList.length) {
            const {y, height} = e.target.getBoundingClientRect();
            const heightContainer = document.body.clientHeight || 200;

            setMaxHeight(heightContainer - y - height * 2);
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
    const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
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
    };

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
                className="ui-lib-input__controller"
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

            {placeholder && <span className={classNames('ui-lib-placeholder', {required})}>{placeholder}</span>}

            <div className="ui-lib-input__filled" />

            {!!autoCompleteList.length && (
                <AutoComplete
                    isOpen={autoCompleteIsOpen}
                    autoComplete={autoCompleteList}
                    selectedItem={selectedItem}
                    width={ref?.current?.offsetWidth}
                    maxHeight={maxHeight}
                    setMouseSelected={setMouseSelected}
                    value={value}
                />
            )}

            {message?.text && <div className="ui-lib-message">{message.text}</div>}
        </InputContainer>
    );
};

/**
 * Компонент автокомплита.
 */
const AutoComplete: FunctionComponent<IAutoComplete> = (props) => {
    const {width = 200, maxHeight = 200, setMouseSelected, selectedItem} = props;
    const ref = useRef<HTMLElement>();

    useRemoteScrollControl(ref, selectedItem);

    /**
     * Обработчик мыши на наведение на элемент автокомплита.
     *
     * @param target Текущий элемент под указателем мыши.
     */
    const mouseHandler = ({target}: ChangeEvent<HTMLElement>): void => {
        const index = target.dataset.index;
        console.log(index);
        index !== undefined && setMouseSelected(+index);
    };

    /**
     * Обработчик мыши на покидание области контейнера.
     */
    const mouseHandlerOver = (): void => {
        setMouseSelected(null);
    };

    return props.isOpen ? (
        <ListContainer
            ref={ref}
            className="ui-lib-auto-complete"
            style={{width, maxHeight}}
            onMouseOver={mouseHandler}
            onMouseLeave={mouseHandlerOver}
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
    <li data-index={props.index} className={classNames('ui-lib-auto-complete__item', {'active-item': props.isActive})}>
        <Highlight search={props.value || ''} text={`${props.children}`} />
    </li>
);
