import {makeAutoObservable} from 'mobx';
import {ELanguage} from 'Modules/Settings/Enums';
import {ISettingsStore} from './Models';

export class SettingsStore implements ISettingsStore {
    /**
     * @inheritDoc
     */
    language: ELanguage = ELanguage.en_US;

    constructor() {
        makeAutoObservable(this);
    }

    /**
     * @inheritDoc
     */
    setLanguage = (language: ELanguage = ELanguage.en_US): void => {
        this.language = this.language === ELanguage.en_US ? ELanguage.ru_RU : ELanguage.en_US;
    };
}
