import React, {FunctionComponent} from 'react';
import classNames from 'classnames';
import {IPositions} from 'ui/Common/Models';
import style from './AuthorizationForm.style.module.scss';

interface IAuthFormElement {
    className?: string;
}

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
    <div className={classNames(style.authorization__footer, position, className)}>{children}</div>
);
