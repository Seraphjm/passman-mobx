import {FunctionComponent} from 'react';
import {ISVGIcon} from 'ui/Components/Icon/Models';
import {ESizes, SVGIcon} from 'ui';
import {faKeycdn} from '@fortawesome/free-brands-svg-icons';
import classNames from 'classnames';

interface ILogotype {
    logotype?: ISVGIcon;
    className?: string;
    size?: ESizes;
}

export const Logotype: FunctionComponent<ILogotype> = ({className, logotype, size}) => (
    <SVGIcon className={classNames('logotype', className)} color={logotype?.color} icon={logotype?.icon || faKeycdn} size={size} />
);
