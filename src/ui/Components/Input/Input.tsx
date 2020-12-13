import {FormEvent, forwardRef, FunctionComponent, useEffect, useRef, useState, KeyboardEvent, FocusEvent, ChangeEvent} from 'react';
import classNames from 'classnames';
import {go} from 'fuzzysort';
import {useRemoteScrollControl} from 'ui/Common/Hooks';
import {isFunction} from 'Utils/Utils';
import {EKeyCode} from 'ui/Common/Enums';
import {Highlight} from 'ui/Components/Highlight/Highlight';
import {IAutoComplete, ICompleteItem, IInput} from './Models';
import {IFuzzySortResult} from 'ui/Common/Models';
import './Input.style.scss';

const InputContainer: any = forwardRef<HTMLDivElement, IInput>(({children, className, message}, ref) => (
    <div ref={ref} className={classNames('ui-lib-input', className, message?.type)}>
        {children}
    </div>
));

// TODO: отвзять состояние автокомплита от инпута. Попытку делал, но получилось не очень эффективно.
export const Input: FunctionComponent<IInput> = ({
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
}) => {
    const ref = useRef<HTMLElement>();
    const [autoCompleteIsOpen, setAutoCompleteIsOpen] = useState<boolean>(false);
    // Удаляем дубликаты из исходного массива.
    const [autoCompleteList, setAutoCompleteList] = useState<string[]>([...new Set([...autoComplete])]);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [mouseSelected, setMouseSelected] = useState<number | null>(null);
    const [maxHeight, setMaxHeight] = useState<number>(200);
    const [usedKey, setUsedKey] = useState<boolean>(false);

    useEffect(() => {
        if (autoCompleteList.length && selectedItem !== null && !usedKey) onInput(autoCompleteList[selectedItem]);
        // eslint-disable-next-line
    }, [selectedItem]);

    useEffect(() => {
        if (autoCompleteList.length && !autoCompleteIsOpen && !usedKey && value) {
            setAutoCompleteIsOpen(true);
        }
        // eslint-disable-next-line
    }, [value, usedKey]);

    const search = (value: string, autoComplete: string[]): string[] => {
        //@ts-ignore
        const filtered: IFuzzySortResult[] = go(value, autoComplete, {
            limit: 100,
        });

        return filtered.sort((a, b) => (a.score < b.score ? 1 : -1)).map(({target}) => target);
    };

    const onInputHandler = ({currentTarget: {value}}: FormEvent<HTMLInputElement>) => {
        if (autoComplete?.length) {
            if (selectedItem !== null) setSelectedItem(null);

            setAutoCompleteList(value ? search(value, autoComplete) : autoComplete);
        }

        onInput(value);
    };

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

    const onKeyUpHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        //@ts-ignore ложноположительное срабатывание.
        if (isFunction(onKeyUp)) onKeyUp(e);
    };

    return (
        <InputContainer ref={ref} className={className} message={message}>
            <input
                className="ui-lib-input__controller"
                placeholder={'\u2063'}
                value={value}
                onInput={onInputHandler}
                autoFocus={autoFocus}
                onFocus={onFocusHandler}
                onBlur={onBlurHandler}
                onKeyUp={onKeyUpHandler}
                onKeyDown={onKeyDownHandler}
            />

            {placeholder && <span className={classNames('ui-lib-placeholder', {required})}>{placeholder}</span>}

            <div className="ui-lib-input__filled" />

            {!!autoCompleteList.length && (
                <AutoComplete
                    isOpen={autoCompleteIsOpen}
                    autoCompleteList={autoCompleteList}
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

const AutoComplete: FunctionComponent<IAutoComplete> = (props) => {
    const {width, maxHeight = 200, autoCompleteList, setMouseSelected, selectedItem} = props;
    const ref = useRef<HTMLElement>();

    useRemoteScrollControl(ref, selectedItem);

    const mouseHandler = ({target}: ChangeEvent<HTMLElement>): void => {
        const index = target.dataset.index;
        index !== undefined && setMouseSelected(+index);
    };

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
            {autoCompleteList.map((item: string, i: number) => (
                <CompleteItem value={props.value} key={item} selectedItem={props.selectedItem === i} index={i}>
                    {item}
                </CompleteItem>
            ))}
        </ListContainer>
    ) : null;
};

export const ListContainer: any = forwardRef<HTMLUListElement, IAutoComplete>((props, ref) => {
    return (
        <ul ref={ref} {...props}>
            {props.children}
        </ul>
    );
});

const CompleteItem: FunctionComponent<ICompleteItem> = (props) => (
    <li data-index={props.index} className={classNames('ui-lib-auto-complete__item', {'active-item': props.selectedItem})}>
        <Highlight search={props.value || ''} text={`${props.children}`} />
    </li>
);
