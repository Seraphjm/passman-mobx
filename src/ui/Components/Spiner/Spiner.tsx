import {FunctionComponent} from 'react';
import './Spinner.style.scss';
/**
 * Свойства компонента спиннер.
 *
 * @prop enable флаг активности спинера.
 */
interface ISpinner {
    enable: boolean;
}

/**
 * Компонент спиннер.
 */
export const Spinner: FunctionComponent<ISpinner> = ({enable}) =>
    enable ? (
        <div className="spinner-wrap">
            <div className="spinner-box" />
            <div className="spinner-block" />
        </div>
    ) : null;
