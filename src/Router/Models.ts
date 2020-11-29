import {ComponentType} from 'react';
import {RouteComponentProps, RouteProps} from 'react-router-dom';

/**
 * Интерфейс роута приложения.
 *
 * path Путь роута.
 * [redirect] Редирект.
 * [component] Передаваемый компонент. Может быть lazy load.
 * [routes] Дочерние роуты текущего роута.
 */
export interface IRoute extends IHRouteProps {
    path?: string;
    redirect?: string;
    component?: ComponentType<RouteComponentProps<any>> | ComponentType<any>;
    routes?: IRoute[];
}

/**
 * Свойства компонента.
 *
 * @prop loadChildren Ленивый компонент, созданный через динамический import. Имеет приоритет над свойством component.
 */
export interface IHRouteProps extends RouteProps {
    loadChildren?: () => Promise<{default: ComponentType<unknown>}>;
}
