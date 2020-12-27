import {EColors, ESizes} from 'ui/Common/Enums';

/**
 * Модель модуля иконки.
 *
 * icon Массив svg данных иконки.
 * prefix Префикс иконки.
 * iconName Имя иконки.
 */
export interface IIcon {
    icon: any[];
    prefix: string;
    iconName: string;
}

/**
 * Модель компонента svg-иконок.
 *
 * @prop icon Модуль иконки.
 * @prop [size] Размеры иконки.
 * @prop [color] Цвет иконки.
 * @prop [className] css класс.
 */
export interface ISVGIcon {
    icon: IIcon;
    size?: ESizes;
    color?: EColors;
    className?: string;
}

/**
 * Модель svg-иконоки, которая принимается в качестве свойства в компонент, который её использует.
 * Отличие от ISVGIcon в отсутсвии возможности передать класс, т.к. это внесёт больше хаоса внутри используемого
 * компонента.
 *
 * @prop icon Модуль иконки.
 * @prop [icon.size]  Размеры иконки.
 * @prop [icon.color] Цвет иконки.
 */
export interface IPropsIcon {
    icon: IIcon;
    size?: ESizes;
    color?: EColors;
}
