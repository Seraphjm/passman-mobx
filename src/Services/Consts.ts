import {
    faArchive,
    faAt,
    faBriefcase,
    faDollarSign,
    faGamepad,
    faKey,
    faSchool,
    faShoppingBag,
    faUniversity,
} from '@fortawesome/free-solid-svg-icons';
import {faConnectdevelop, faGithub, faHubspot, faOptinMonster, faReact} from '@fortawesome/free-brands-svg-icons';
import {ICategory, IFieldsCategory} from 'Modules/Main/Store/Models';

/**
 * Дефолтный ключ по которому происходит записть в indexedDB.
 */
export const KEY_PATH = '_id';

/**
 * Имя базы indexedDB.
 */
export const BASE_NAME = 'passman';

/**
 * Список дефолтных категорий. Используется при создании БД, и там и живёт.
 */
const defaultFields: IFieldsCategory[] = [
    {name: 'name', placeholder: 'placeholder:name', required: true},
    {name: 'login', placeholder: 'placeholder:login'},
    {name: 'email', placeholder: 'placeholder:email'},
    {name: 'phone', placeholder: 'placeholder:phone'},
    {name: 'site', placeholder: 'placeholder:site'},
];

export const defaultCategories: ICategory[] = [
    {
        name: 'archive',
        icon: faArchive,
        fields: defaultFields,
    },
    {
        name: 'develop',
        icon: faGithub,
        fields: defaultFields,
    },
    {
        name: 'services',
        icon: faReact,
        fields: defaultFields,
    },
    {
        name: 'emails',
        icon: faAt,
        fields: [
            {name: 'name', placeholder: 'placeholder:name', required: true},
            {name: 'login', placeholder: 'placeholder:login'},
            {name: 'email', placeholder: 'placeholder:email', required: true},
            {name: 'phone', placeholder: 'placeholder:phone'},
            {name: 'site', placeholder: 'placeholder:site'},
            {name: 'secret_answer', placeholder: 'placeholder:secret_answer'},
            {name: 'secret_question', placeholder: 'placeholder:secret_question'},
        ],
    },
    {
        name: 'games',
        icon: faGamepad,
        fields: defaultFields,
    },
    {
        name: 'network',
        icon: faConnectdevelop,
        fields: defaultFields,
    },
    {name: 'keys', icon: faKey, fields: [{name: 'name', placeholder: 'placeholder:name', required: true}]},
    {
        name: 'social',
        icon: faHubspot,
        fields: defaultFields,
    },
    {
        name: 'finance',
        icon: faDollarSign,
        fields: defaultFields,
    },
    {
        name: 'government',
        icon: faUniversity,
        fields: defaultFields,
    },
    {
        name: 'others',
        icon: faOptinMonster,
        fields: defaultFields,
    },
    {
        name: 'shops',
        icon: faShoppingBag,
        fields: defaultFields,
    },
    {
        name: 'job',
        icon: faBriefcase,
        fields: defaultFields,
    },
    {
        name: 'education',
        icon: faSchool,
        fields: defaultFields,
    },
];
