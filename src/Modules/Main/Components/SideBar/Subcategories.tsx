import {BaseSyntheticEvent, FunctionComponent} from 'react';
import {observer} from 'mobx-react';
import {useMainStore} from '../../Store/Hooks';
import {SVGIcon} from 'ui/Components/Icon';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import classNames from 'classnames';
import './Subcategories.style.scss';

/**
 * Свойства компонента.
 *
 * @prop subcategories Список подкатегорий.
 */
interface ISubcategories {
    subcategories: string[];
}

/**
 * Компонент отображения подкатегорий в списке категорий сайдбара.
 */
export const Subcategories: FunctionComponent<ISubcategories> = observer((props) => {
    /** mobx-store главной страницы */
    const main = useMainStore();

    /**
     * Функция, вызывающая экшн установки активной подкатегории.
     *
     * @param event Событие клика.
     */
    const setActiveSubcategory = (event: BaseSyntheticEvent) => {
        main.setSelectedSubcategory(event.target.dataset.subcategory);
    };

    return (
        <ul className="subcategory-list" onClick={setActiveSubcategory}>
            {props.subcategories.map((subcategory) => (
                <li className="subcategory-item" data-subcategory={subcategory} key={subcategory}>
                    <div className="subcategory-item__icon-container">
                        <SVGIcon
                            className={classNames('subcategory-item__icon', {active: subcategory === main.selectedSubcategory})}
                            icon={faChevronRight}
                        />
                    </div>
                    <div className="subcategory-item__text">{subcategory}</div>
                </li>
            ))}
        </ul>
    );
});
