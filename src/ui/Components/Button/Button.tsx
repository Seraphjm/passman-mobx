import {FunctionComponent, useState} from 'react';
import classNames from 'classnames';
import {calcRipplePosition, cancelEvent, isFunction} from 'ui/Utils';
import {IButton} from './Models';
import './Button.style.scss';

/**
 * Модель состояния риппера.
 */
interface IState {
    width?: number;
    height?: number;
    top?: number;
    left?: number;
    display?: string;
}

/**
 * Компонент кнопки.
 */
export const Button: FunctionComponent<IButton> = ({
    children,
    size,
    iconPos,
    type,
    className,
    disabled,
    onClick,
    icon,
    additionalContent,
    animate,
}) => {
    const [ripple, setRipple] = useState<IState>({});

    /**
     * Обработчик клика по кнопке.
     */
    const onClickHandler = async (e: any) => {
        cancelEvent(e);

        await setRipple({...ripple, display: 'none'});
        const style = await calcRipplePosition(e);
        setRipple({...style, display: 'initial'});

        //@ts-ignore ложноположительное срабатывание
        if (isFunction(onClick)) onClick();
    };

    return (
        <div className={classNames('ui-lib-button', size, type, iconPos, className)}>
            <button disabled={disabled} onClick={onClickHandler} className={classNames('ui-lib__flat', {animate})}>
                {icon && <span className={classNames(icon, 'logotype', 'ui-lib-button__icon')} />}
                {children && (
                    <span className={classNames('ui-lib-button__content')}>
                        {children}
                        {additionalContent && additionalContent}
                    </span>
                )}
                <span className="ui-lib__ripple" style={ripple} />
            </button>
        </div>
    );
};
