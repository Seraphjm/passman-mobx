import {FunctionComponent} from 'react';
import {observer} from 'mobx-react';
import {useAuthorization} from '../../Store/Hooks';
import {Spinner} from 'ui/Components/Spiner/Spiner';
import style from './AuthorizationForm.style.module.scss';

/**
 * Шаблон форм авторизации.
 */
export const TemplateAuthForm: FunctionComponent = observer(({children}) => {
    const auth = useAuthorization();
    return (
        <div className={style.authorization}>
            <Spinner enable={auth.isChecking} />
            <div className={`${style.authorization__container} v-center`}>{children}</div>
        </div>
    );
});
