import {ComponentType} from 'react';
import {RouteComponentProps, RouteProps} from 'react-router-dom';

/**
 * Интерфейс роута приложения.
 */
export interface IRoute extends IHRouteProps {
    path: string;
    redirect?: string;
    component?: ComponentType<RouteComponentProps<any>> | ComponentType<any>;
    routes?: IRoute[];
}

/**
 * Свойства компонента.
 *
 * @prop lazyComponent Ленивый компонент, созданный через динамический import. Имеет приоритет над свойством component.
 */
export interface IHRouteProps extends RouteProps {
    loadChildren?: () => Promise<{default: ComponentType<unknown>}>;
}
