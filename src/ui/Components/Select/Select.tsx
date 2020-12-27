import {Children, cloneElement, FormEvent, FunctionComponent, KeyboardEvent, useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import {isFunction} from 'ui/Utils';
import {IEventMessage, IFuzzySortResult} from 'ui/Common/Models';
import {Highlight} from 'ui/Components/Highlight/Highlight';
import {go} from 'fuzzysort';
import {useRemoteScrollControl} from 'ui/Common/Hooks';
import {EKeyCode} from 'ui/Common/Enums';
import './Select.style.scss';

interface ISelect {
    value: string;
    onChange: (v: any) => void;
    className?: string;
    placeholder?: string;
    required?: boolean;
    message?: IEventMessage;
}

function getMaxHeight<T>(eventContainer: T) {
    //@ts-ignore
    const {y, height} = eventContainer.target.getBoundingClientRect();
    const heightContainer = document.body.clientHeight || 200;

    return heightContainer - y - height * 2;
}

export const Select: FunctionComponent<ISelect> = ({onChange, placeholder, className, required, value, message, children}) => {
    const controllerRef = useRef<any>();
    const containerRef = useRef<any>();
    const listRef = useRef<any>();
    const [childes, setChildes] = useState(children);
    const [localValue, setLocalValue] = useState<string | null>(null);
    const [focus, setFocus] = useState<boolean>(false);
    const [maxHeight, setMaxHeight] = useState<number>(200);
    /** Значение выбранное с помощью мышки */
    const [mouseSelected, setMouseSelected] = useState<number | null>(null);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);

    useEffect(() => {
        window.addEventListener('click', disableFocus);
        return () => window.removeEventListener('click', disableFocus);
    }, []);

    const disableFocus = (e: any) => {
        if (e.target !== containerRef.current) setFocus(false);
    };

    useEffect(() => {
        setChildes(search(localValue, Children.toArray(children)));
    }, [localValue, children]);

    useRemoteScrollControl(listRef, selectedItem);

    /**
     * Реализация нечёткого поиска по списку автокомплита.
     *
     * @param value Текущее значение введённое в инпут.
     * @param childes Список для автокомплита по которому произойдёт поиск.
     */
    const search = (value: string | null, childes: any): string[] => {
        if (!value) return childes;

        //@ts-ignore
        const filtered: IFuzzySortResult[] = go(value, childes, {
            keys: ['props.children'],
            limit: 100,
        });
        //@ts-ignore
        return filtered.length ? filtered.sort((a, b) => (a.score < b.score ? 1 : -1)).map(({obj}) => obj) : childes;
    };

    const onChangeHandler = (v: unknown) => {
        //@ts-ignore
        isFunction(onChange) && onChange(v);
        controllerRef?.current.blur();
    };

    const mouseHandlerLeave = () => {
        setMouseSelected(null);
    };

    const mouseHandlerOver = ({target}: any) => {
        const index = target.dataset.index;
        index !== undefined && setMouseSelected(+index);
    };

    const onClickHandler = (e: any) => {
        if (!focus) {
            controllerRef?.current.focus();
            setMaxHeight(getMaxHeight(e));
        } else {
            controllerRef?.current.blur();
        }

        setFocus(!focus);
    };

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        const {keyCode} = e;
        // @ts-ignore
        const endPosition = childes.length - 1;

        // отключаем дефолтное поведение для некоторых key и идём далее.
        switch (keyCode) {
            case EKeyCode.RIGHT:
            case EKeyCode.LEFT:
            case EKeyCode.SPACE:
            case EKeyCode.UP:
            case EKeyCode.DOWN:
                e.preventDefault();
                break;
            default:
                break;
        }

        switch (keyCode) {
            case EKeyCode.UP:
                if (!selectedItem) setSelectedItem(endPosition);
                else setSelectedItem(selectedItem - 1);
                break;
            case EKeyCode.DOWN:
            case EKeyCode.SPACE:
                if (selectedItem === null || selectedItem === endPosition) setSelectedItem(0);
                else setSelectedItem(selectedItem + 1);
                break;
            case EKeyCode.ENTER:
                // @ts-ignore
                selectedItem !== null && onChangeHandler(childes[selectedItem]?.props.value);
                break;
            default:
                break;
        }
    };

    const onInputHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        // @ts-ignore
        const incomingValue = localValue === null ? e.nativeEvent.data : e.currentTarget.value;
        setLocalValue(incomingValue);
    };

    const onBlurHandler = (e: FormEvent<HTMLInputElement>) => {
        setLocalValue(null);
        if (mouseSelected !== null) {
            setMouseSelected(null);
            // @ts-ignore
            isFunction(onChange) && onChangeHandler(childes[mouseSelected]?.props.value);
        }
    };

    return (
        <div ref={containerRef} className={classNames('ui-lib-select', className, required, message?.type)} onClick={onClickHandler}>
            <input
                placeholder={'\u2063'}
                onKeyDown={onKeyDownHandler}
                className="ui-lib-select__hidden-controller"
                ref={controllerRef}
                value={localValue === null ? value : localValue}
                onInput={onInputHandler}
                onBlur={onBlurHandler}
            />

            {placeholder && (
                <div className="ui-lib-select__placeholder">
                    {placeholder}
                    {localValue && <span className="font-monospace"> | icon-search: {localValue}</span>}
                </div>
            )}

            <div className="ui-lib-select__value" tabIndex={0}>
                {value}
                <div className="ui-lib-select__arrow">^</div>
            </div>

            <div className="ui-lib-select__filled" />

            {message && <div className="ui-lib-select__message">{message.text}</div>}

            <ul
                ref={listRef}
                style={{maxHeight, width: containerRef.current?.offsetWidth}}
                className="ui-lib-select__list"
                onMouseOver={mouseHandlerOver}
                onMouseLeave={mouseHandlerLeave}
            >
                {Children.map<any, any>(childes, (child, index) =>
                    cloneElement(child, {index, search: localValue, active: selectedItem === index})
                )}
            </ul>
        </div>
    );
};

interface ISelectItem {
    index?: never;
    search?: never;
    active?: never;
    value?: unknown;
}

export const SelectItem: FunctionComponent<ISelectItem> = (props) => {
    return (
        <li data-value={props.value} data-index={props.index} className={classNames('ui-lib-select__item', {active: props.active})}>
            <Highlight search={props.search || ''} text={`${props.children}`} />
        </li>
    );
};
