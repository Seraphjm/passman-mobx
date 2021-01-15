import {FunctionComponent} from 'react';
import {Input} from 'ui';
import {IInput} from '../Input/Models';
import classNames from 'classnames';
import './InputGroup.style.scss';

/**
 * Компонент группирующий потомственные элементы рядом инпутом. Работает только с кнопками.
 */
export const InputGroup: FunctionComponent<IInput> = ({children, className, ...rest}) => (
    <div className={classNames('ui-lib-input-group', {disabled: rest.disabled})}>
        <Input className="ui-lib-input-group__input" {...rest} />
        <div className="ui-lib-input-group__content">{children}</div>
    </div>
);
