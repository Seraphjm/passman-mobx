import {FunctionComponent, useCallback} from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import {AUTH_ROUTE_NAMES} from 'Modules/Auth/Router/Routes';
import {SideBar as Container} from 'Common/Components/Sidebar/Sidebar';
import {SideBarItem} from 'Common/Components/Sidebar/SideBarItem';
import {useIntl} from 'react-intl';
import {faLongArrowAltLeft} from '@fortawesome/free-solid-svg-icons/faLongArrowAltLeft';
import {useMainStore} from '../../Store/Hooks';

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
                main.enabledCategories.map((category) => (
                    <SideBarItem
                        key={category.id}
                        active={category.id === main.activeCategory}
                        id={category.id}
                        icon={category.icon}
                        text={category.name}
                    />
                ))
            ) : (
                <SideBarItem active={true} id="search" icon={faLongArrowAltLeft} text={formatMessage({id: 'COMMON__ACTION_CANCEL'})} />
            )}

            {process.env.NODE_ENV === 'development' && <Link to={AUTH_ROUTE_NAMES.ROOT}>GO TO Auth</Link>}
        </Container>
    );
});
