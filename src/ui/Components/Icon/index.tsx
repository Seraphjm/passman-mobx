import {FunctionComponent} from 'react';
import classNames from 'classnames';
import {ISVGIcon} from './Models';
import './Icon.style.scss';

/**
 * Компонент отрисовки svg-иконок.
 *
 * @supported В качестве зависимости использует иконки из пакета @fortawesome.
 */
export const SVGIcon: FunctionComponent<ISVGIcon> = (props) => {
    // eslint-disable-next-line
    const {
        icon,
        icon: {
            icon: [v1, v2, empty, before, d],
        },
    } = props;
    return (
        <svg
            aria-hidden="true"
            focusable="false"
            data-prefix={icon.prefix}
            data-icon={icon.iconName}
            className={classNames(
                'svg-inline--fa',
                'ui-lib-svg-icon',
                `fa-${icon.iconName}`,
                'fa-w-20',
                props.size,
                props.color,
                props.className
            )}
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${v1} ${v2}`}
        >
            <path fill="currentColor" d={d} />
        </svg>
    );
};
