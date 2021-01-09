import {BaseSyntheticEvent, FunctionComponent} from 'react';
import classNames from 'classnames';
import './Card.style.scss';

/**
 * Модель ui компонента Card.
 *
 * @prop [active] Флаг активного состояния.
 * @prop [shadow] Флаг отрисовки тени.
 * @prop [className] css класс.
 */
interface ICard {
    active?: boolean;
    shadow?: boolean;
    className?: string;
}

/**
 * Модель ui компонента внутри Card.
 *
 * @prop [className] css класс.
 *
 * @description className Предоставлен для использования кастомного css-grid/стилей_разметки с меньшим количеством
 * костылей в css с наследованием. При использовании в других целях - стоит 10 раз подумать, действительно есть ли
 * необходимость в этом (обычно необходимости в этом нет).
 */
interface ICardComponent {
    className?: string;
}

/**
 * Модель ui компонента внутри Card.
 *
 * @prop [onMouseOver] Обработчик наведение мыши на контейнер.
 * @prop [onMouseOut] Обработчик покидания мыши с контейнера.
 * @prop [onClick] Обработчик клика по контейнеру.
 */
interface ICardBody extends ICardComponent {
    onMouseOver?: (e: BaseSyntheticEvent) => void;
    onMouseOut?: (e: BaseSyntheticEvent) => void;
    onClick?: (e: BaseSyntheticEvent) => void;
}

/**
 * ui компонент Card.
 */
export const Card: FunctionComponent<ICard> = ({active, shadow, className, children}) => (
    <div className={classNames('ui-lib-card', className, {active, shadow})}>{children}</div>
);

/**
 * ui компонент CardHeader.
 */
export const CardHeader: FunctionComponent<ICardComponent> = (props) => (
    <div className={classNames('ui-lib-card__header', props.className)}>{props.children}</div>
);

/**
 * ui компонент CardBody.
 */
export const CardBody: FunctionComponent<ICardBody> = (props) => (
    <div
        className={classNames('ui-lib-card__body', props.className)}
        onMouseOver={props.onMouseOver}
        onMouseOut={props.onMouseOut}
        onClick={props.onClick}
    >
        {props.children}
    </div>
);

/**
 * ui компонент CardFooter.
 */
export const CardFooter: FunctionComponent<ICardComponent> = (props) => (
    <div className={classNames('ui-lib-card__footer', props.className)}>{props.children}</div>
);
