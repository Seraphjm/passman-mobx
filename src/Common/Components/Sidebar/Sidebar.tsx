import {FunctionComponent} from 'react';
import './Sidebar.style.scss';

/**
 * Свойства компонента.
 *
 * @prop onClick Обработчик кликов по элементам сайдбара.
 */
interface ISideBar {
    onClick: (id: string) => void;
}

/**
 * Контейнер сайдбара.
 */
export const SideBar: FunctionComponent<ISideBar> = (props) => {
    const onClickHandle = ({target: {dataset}}: any): void => {
        if (dataset?.id || dataset?.name) {
            props.onClick(dataset.id || dataset.name);
        }
    };

    return (
        <ul onClick={onClickHandle} className="sidebar">
            {props.children}
        </ul>
    );
};
