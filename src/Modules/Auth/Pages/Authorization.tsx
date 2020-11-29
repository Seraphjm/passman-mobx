import React, {FunctionComponent} from 'react';
import './Authorization.style.scss';

export const Authorization: FunctionComponent = ({children}) => (
    <div id="authorization" className="v-center">
        {children}
    </div>
);
