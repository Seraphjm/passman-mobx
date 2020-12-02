import {makeAutoObservable} from 'mobx';
import {ELanguages} from 'Common/Locales/Enums';
import {ISettingsStore} from './Models';

export class SettingsStore implements ISettingsStore {
    /**
     * @inheritDoc
     */
    language: ELanguages = ELanguages.en_US;

    constructor() {
        makeAutoObservable(this);
    }

    /**
     * @inheritDoc
     */
    setLanguage = (language: ELanguages = ELanguages.en_US): void => {
        this.language = this.language === ELanguages.en_US ? ELanguages.ru_RU : ELanguages.en_US;
    };
}
