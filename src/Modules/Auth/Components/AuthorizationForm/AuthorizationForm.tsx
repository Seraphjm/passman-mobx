import {FunctionComponent} from 'react';
import classNames from 'classnames';
import {IPositions} from 'ui/Common/Models';
import style from './AuthorizationForm.style.module.scss';

/**
 * Интерфейс свойств элемента формы авторизации.
 *
 * @prop className Имя передаваемого css класса.
 */
interface IAuthFormElement {
    className?: string;
}

/**
 * Тип свойств области контента формы авторизации.
 */
type TAuthContent = IAuthFormElement & IPositions;

/**
 * Компонент заголовка шаблона формы авторизации.
 */
export const AuthorizationHeader: FunctionComponent<IAuthFormElement> = ({children, className}) => (
    <div className={classNames(style.authorization__header, className)}>{children}</div>
);

/**
 * Компонент тела шаблона формы авторизации.
 */
export const AuthorizationBody: FunctionComponent<TAuthContent> = ({children, position, className}) => (
    <div className={classNames(style.authorization__body, position, className)}>{children}</div>
);

/**
 * Компонент футера шаблона формы авторизации.
 */
export const AuthorizationFooter: FunctionComponent<TAuthContent> = ({children, position, className}) => (
    <div style={{display: 'block'}} className={classNames(style.authorization__footer, position, className)}>
        {children}
    </div>
);
