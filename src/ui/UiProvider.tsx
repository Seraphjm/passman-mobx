import React, {FunctionComponent} from 'react';
import {EThemes} from './Common/Enums';
import 'ui/Styles/common.style.scss';

/**
 * Модель свойств передаваемых в ui-lib.
 *
 * @prop theme Активная тема ui.
 */
export interface IUiProvider {
    theme?: EThemes;
}

/**
 * Компонент, предоставляющий стили, свойства и контекст для ui либы.
 * По готовности перейдёт в отдельный пакет.
 */
export const UiProvider: FunctionComponent<IUiProvider> = ({children, theme = EThemes.LIGHT}) => (
    <>
        <div className={`ui-lib ui-lib-${theme}`}>{children}</div>
        <div id="ui-lib-modal-portal" />
    </>
);
