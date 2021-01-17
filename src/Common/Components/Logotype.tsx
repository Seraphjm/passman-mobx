import {FunctionComponent} from 'react';
import {ISVGIcon} from 'ui/Components/Icon/Models';
import {ESizes, SVGIcon} from 'ui';
import {faKeycdn} from '@fortawesome/free-brands-svg-icons';
import classNames from 'classnames';
import './Logotype.style.scss';

/**
 * Модель компонента логотипа.
 *
 * @prop [logotype] Логотип в svg формате.
 * @prop [className] css класс.
 * @prop [size] Размер логотипа.
 */
interface ILogotype {
    logotype?: ISVGIcon;
    className?: string;
    size?: ESizes;
}

/**
 * Компонент логотипа.
 */
export const Logotype: FunctionComponent<ILogotype> = ({className, logotype, size}) => (
    <SVGIcon
        className={classNames('logotype', className, {'logotype--default-color': !logotype?.color})}
        color={logotype?.color}
        icon={logotype?.icon || faKeycdn}
        size={size}
    />
);
