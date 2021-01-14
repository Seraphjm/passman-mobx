import {Children, cloneElement, FormEvent, FunctionComponent, KeyboardEvent, ReactNode, useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import {InputFilled} from 'ui/Common/InnerComponents/InputFilled/InputFilled';
import {InputMessage} from 'ui/Common/InnerComponents/InputMessage/InputMessage';
import {InputPlaceholder} from 'ui/Common/InnerComponents/InputPlaceholder/InputPlaceholder';
import {getPositionProps, isFunction} from 'ui/Utils';
import {IFuzzySortResult, IPositionProps} from 'ui/Common/Models';
import {Highlight} from 'ui/Components/Highlight/Highlight';
import {go} from 'fuzzysort';
import {useHiddenListFromWindow, useRemoteScrollControl} from 'ui/Common/Hooks';
import {EKeyCode, ESizes} from 'ui/Common/Enums';
import {faChevronUp, faSearch} from '@fortawesome/free-solid-svg-icons';
import {IOption, ISelect} from './Models';
import './Select.style.scss';
import {SVGIcon} from '../Icon';

// TODO.TYPES TODO.REFACTOR: заевбавси, доделать.

/**
 * UI Компонент select.
 */
export const Select: FunctionComponent<ISelect<any, any>> = ({
    onChange,
    placeholder,
    className,
    required,
    value,
    message,
    children,
    dataBind,
    disabled,
}) => {
    /** Скрытый контроллер компонента. На нём обвязана вся логика. */
    const controllerRef = useRef<HTMLInputElement>();
    /** Контейнер компонента. Нужен для отслеживания событий и установки размерностей внешнего контейнера. */
    const containerRef = useRef<HTMLDivElement>();
    /** Контейнер списка. Необходимо для удалённого контроля скролла по хоткеям. */
    const listRef = useRef<HTMLUListElement>();
    /** Необходимо для поиска и фильтрации потомков с заданным value, если такой будет предоставлен посредством
     *  ввода. */
    const [childes, setChildes] = useState(children);
    /** Необходимо для фильтрации потомков по введённому значению. */
    const [localValue, setLocalValue] = useState<string | null>(null);
    /** Флаг того, что на контроллер установлен фокус. */
    const [focus, setFocus] = useState<boolean>(false);
    /** Параметры размерностей и положения спискового контейнера. */
    const [style, setStyle] = useState<IPositionProps>();
    /** Значение выбранное с помощью мышки. */
    const [mouseSelected, setMouseSelected] = useState<number | null>(null);
    /** Выбранный элемент из выпадающего списка. */
    const [selectedItem, setSelectedItem] = useState<number | null>(null);

    /**
     * Установка слушателя скрытие выпадающего списка по клику вне элемента.
     * В общем-то костыль. Поанализировать потом на то, как можно это сделать менее топорным способом.
     */
    useEffect(() => {
        window.addEventListener('click', disableFocus);
        return () => window.removeEventListener('click', disableFocus);
    }, []);

    /**
     * Метод, снимающий фокус с контроллера компонента.
     *
     * @param event Входящее событие.
     */
    const disableFocus = (event: Event) => {
        if (event.target !== containerRef.current && event.target !== listRef.current) {
            controllerRef.current?.blur();
            setFocus(false);
        }
    };

    /**
     * Здесь осуществляется поиск по потомкам по введённому значению.
     * Очевидно, что поиск идёт по тому, что видит пользователь, а не по переданному value/
     */
    useEffect(() => {
        setChildes(search(localValue, Children.toArray(children)));
    }, [localValue, children]);

    /**
     * Хук, отвечающий за контроль спискового скролла хоткеями.
     */
    useRemoteScrollControl(listRef, selectedItem);

    /**
     * Хук, отслеживающий window-события, и скрывающий выпадающий список по ним.
     */
    useHiddenListFromWindow(disableFocus);

    /**
     * Реализация нечёткого поиска по списку автокомплита.
     *
     * @param value Текущее значение введённое в инпут.
     * @param childes Список для автокомплита по которому произойдёт поиск.
     */
    const search = (value: string | null, childes: ReactNode[]): ReactNode[] => {
        //@ts-ignore
        const sortedChildes = childes.sort((a: ReactNode, b: ReactNode) => (a?.props.children > b?.props.children ? 1 : -1));
        if (!value) return sortedChildes;

        //@ts-ignore
        const filtered: IFuzzySortResult[] = go(value, childes, {
            keys: ['props.children'],
            limit: 100,
        });
        //@ts-ignore
        return filtered.length ? filtered.sort((a, b) => (a.score < b.score ? 1 : -1)).map(({obj}) => obj) : sortedChildes;
    };

    /**
     * Обработчик изменения состояния компонента select.
     * TODO.TYPES посмотреть, как можно типизировать такие кейсы (дженерик описан на props.onChange).
     */
    const onChangeHandler = (v: unknown) => {
        isFunction(onChange) && onChange(v, dataBind || null);
        controllerRef.current?.blur();
    };

    /**
     * Обработчик мыши на покидание области контейнера выпадающего списка.
     */
    const mouseHandlerLeave = () => {
        setMouseSelected(null);
    };

    /**
     * Обработчик мыши на наведение на элемент выпадающего списка.
     *
     * @param target Текущий элемент под указателем мыши.
     */
    const mouseHandlerOver = ({target}: any) => {
        const index = target.dataset.index;
        index !== undefined && setMouseSelected(+index);
    };

    /**
     * Обработчик клика по компоненту.
     * Задача: скрыть или показать выпадающий список.
     *
     * @param event Событие по клику.
     */
    const onClickHandler = (event: Event) => {
        if (!focus) {
            controllerRef.current?.focus();
            setStyle(getPositionProps<Event>(event, '1rem'));
        } else {
            controllerRef.current?.blur();
        }

        setFocus(!focus);
    };

    /**
     * Обработчик onKeyDown. В основном содержит логику для навигационных клавиш.
     *
     * @param e Событие полученное при вводе.
     */
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

    /**
     * Обработчик ввода передающий значение из инпута в onInput.
     *
     * @param e Событие из контроллера.
     */
    const onInputHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        // @ts-ignore
        const incomingValue = localValue === null ? e.nativeEvent.data : e.currentTarget.value;
        selectedItem !== null && setSelectedItem(null);
        mouseSelected !== null && setMouseSelected(null);
        setLocalValue(incomingValue);
    };

    /**
     * Обработчик потери фокуса.
     *
     * @param e Событие полученное из фокуса.
     */
    const onBlurHandler = (e: FormEvent<HTMLInputElement>) => {
        setLocalValue(null);
        if (mouseSelected !== null) {
            setMouseSelected(null);
            // @ts-ignore
            isFunction(onChange) && onChangeHandler(childes[mouseSelected]?.props.value);
        }
    };

    return (
        //@ts-ignore
        <div
            ref={containerRef}
            className={classNames('ui-lib-select', className, required, message?.type, {disabled})}
            onClick={onClickHandler}
        >
            <input
                placeholder={'\u2063'}
                onKeyDown={onKeyDownHandler}
                className="ui-lib__hidden-controller ui-lib__input--controller"
                //@ts-ignore
                ref={controllerRef}
                value={localValue === null ? value : localValue}
                onInput={onInputHandler}
                onBlur={onBlurHandler}
                disabled={disabled}
            />

            {placeholder && (
                <InputPlaceholder>
                    {placeholder}
                    {localValue && (
                        <span className="font-monospace">
                            {' '}
                            | <SVGIcon icon={faSearch} size={ESizes.ES} />: {localValue}
                        </span>
                    )}
                </InputPlaceholder>
            )}

            <div className="ui-lib-select__value text-ellipsis" tabIndex={0}>
                {value}
                <div className="ui-lib-select__arrow">
                    <SVGIcon icon={faChevronUp} size={ESizes.ES} />
                </div>
            </div>

            <InputFilled />

            {message && <InputMessage>{message.text}</InputMessage>}

            <ul
                //@ts-ignore
                ref={listRef}
                style={{...style, width: containerRef.current?.offsetWidth}}
                className="ui-lib__drop-list"
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

/**
 * UI компонент option для выпадающего списка select.
 */
export const Option: FunctionComponent<IOption> = (props) => (
    <li data-value={props.value} data-index={props.index} className={classNames('ui-lib-option', {active: props.active})}>
        {props.icon && <div className="ui-lib-option__icon">{props.icon}</div>}
        <Highlight search={props.search || ''} text={`${props.children}`} />
    </li>
);
