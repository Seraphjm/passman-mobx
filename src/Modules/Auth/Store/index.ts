import {makeAutoObservable, action} from 'mobx';
import {IAuthorizationStore} from './Models';

export class AuthStore implements IAuthorizationStore {
    /**
     * @inheritDoc
     */
    secretKey: string = '';
    /**
     * @inheritDoc
     */
    isLogin: boolean | null = null;
    /**
     * @inheritDoc
     */
    isChecking: boolean = false;
    /**
     * @inheritDoc
     */
    dbIsEmpty: boolean = false;

    constructor() {
        makeAutoObservable(this);
        this.authStoreInit();
    }

    /**
     * @inheritDoc
     */
    private authStoreInit = (): void => {
        // первоначальная подгрузка данных. В частности установка флага dbIsEmpty
    };

    /**
     * @inheritDoc
     */
    setSecretKey = (key: string): void => {
        this.secretKey = key;
    };

    /**
     * @inheritDoc
     */
    checkSecretKey = async () => {
        // позже тут будет полноценная проверка с блэк джеком и криптографией
        console.warn('checked:', this.secretKey);
        this.isChecking = true;
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.isChecking);
            }, 2000);
        }).then(
            action(() => {
                this.isLogin = true;
                this.isChecking = false;
            })
        );
    };

    /**
     * @inheritDoc
     */
    changeMasterPassword = (newPassword: string) => {
        console.warn({newPassword});
    };
}
