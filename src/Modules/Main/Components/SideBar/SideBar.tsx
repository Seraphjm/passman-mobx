import {FunctionComponent, useCallback, Fragment} from 'react';
import {observer} from 'mobx-react';
import {SideBar as Container} from 'Common/Components/Sidebar/Sidebar';
import {SideBarItem} from 'Common/Components/Sidebar/SideBarItem';
import {useIntl} from 'react-intl';
import {faLongArrowAltLeft} from '@fortawesome/free-solid-svg-icons/faLongArrowAltLeft';
import {useMainStore} from '../../Store/Hooks';
import {Subcategories} from './Subcategories';

/**
 * Контейнер сайдбара.
 */
export const SideBar: FunctionComponent = observer(() => {
    const main = useMainStore();
    const {formatMessage} = useIntl();

    const setActiveCategory = useCallback((id: string) => {
        if (id !== 'search') {
            main.setSelectedCategory(id);
        } else {
            main.setSearch('');
            main.setSelectedCategory(main.enabledCategories[0]?.id);
        }
        // eslint-disable-next-line
    }, []);

    return (
        <Container onClick={setActiveCategory}>
            {!main.search ? (
                main.enabledCategories.map((category) => {
                    const isActiveCategory: boolean = category.id === main.activeCategory;
                    return (
                        <Fragment key={category.id}>
                            <SideBarItem active={isActiveCategory} id={category.id} icon={category.icon} text={category.name} />
                            {isActiveCategory && <Subcategories subcategories={main.currentSubcategoryList} />}
                        </Fragment>
                    );
                })
            ) : (
                <SideBarItem active={true} id="search" icon={faLongArrowAltLeft} text={formatMessage({id: 'ACTION__CANCEL'})} />
            )}
        </Container>
    );
});
