import {ComponentType} from 'react';
import {RouteComponentProps, RouteProps} from 'react-router-dom';

/**
 * Модель роута приложения.
 *
 * @prop path Путь роута.
 * @prop [redirect] Редирект.
 * @prop [component] Передаваемый компонент. Может быть lazy load.
 * @prop [routes] Дочерние роуты текущего роута.
 */
export interface IRoute extends IHRouteProps {
    path?: string;
    redirect?: string;
    component?: ComponentType<RouteComponentProps<any>> | ComponentType<any>;
    routes?: IRoute[];
}

/**
 * Свойства компонента переданного в роут.
 *
 * @prop loadChildren Ленивый компонент, созданный через динамический import. Имеет приоритет над свойством component.
 */
export interface IHRouteProps extends RouteProps {
    loadChildren?: () => Promise<{default: ComponentType<unknown>}>;
}
