import {FunctionComponent} from 'react';
import {observer} from 'mobx-react';
import {Spinner} from 'ui/Components/Spiner/Spiner';
import {useAuthorizationStore} from '../../Store/Hooks';
import style from './AuthorizationForm.style.module.scss';

/**
 * Шаблон форм авторизации.
 */
export const TemplateAuthForm: FunctionComponent = observer(({children}) => {
    const auth = useAuthorizationStore();
    return (
        <div className={style.authorization}>
            <Spinner enable={auth.isChecking} />
            <div className={`${style.authorization__container} v-center`}>{children}</div>
        </div>
    );
});
