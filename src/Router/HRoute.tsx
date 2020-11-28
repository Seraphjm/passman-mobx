import React, {ComponentType, Suspense} from 'react';
import {RouteComponentProps} from 'react-router';
import {Route} from 'react-router-dom';
import {IHRouteProps} from './Models';

/**
 * HOC над стандартным Route с поддержкой lazy load.
 */
const HOCRoute: React.FunctionComponent<IHRouteProps> = <T extends IHRouteProps>(props: T): JSX.Element => {
    const {component, children, loadChildren, ...restProps} = props;

    if (component || loadChildren) {
        /**
         * Переопределяем тип компонента, чтобы он не кричал на отсутсвие пропсов history и staticContext.
         */
        const Component = loadChildren ? React.lazy(loadChildren) : (component as ComponentType<RouteComponentProps> | ComponentType<any>);
        return (
            <Route
                {...restProps}
                render={(props) =>
                    loadChildren ? (
                        <Suspense fallback={<div>Loading...</div>}>
                            <Component {...props}>{children}</Component>
                        </Suspense>
                    ) : (
                        <Component {...props}>{children}</Component>
                    )
                }
            />
        );
    }

    return <Route {...props} />;
};

export {HOCRoute as HRoute};
