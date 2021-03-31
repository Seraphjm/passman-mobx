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
import {uuid} from 'Utils/Utils';

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
        id: uuid(),
        name: 'archive',
        icon: faArchive,
        fields: defaultFields,
    },
    {
        id: uuid(),
        name: 'develop',
        icon: faGithub,
        fields: defaultFields,
    },
    {
        id: uuid(),
        name: 'services',
        icon: faReact,
        fields: defaultFields,
    },
    {
        id: uuid(),
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
        id: uuid(),
        name: 'games',
        icon: faGamepad,
        fields: defaultFields,
    },
    {
        id: uuid(),
        name: 'network',
        icon: faConnectdevelop,
        fields: defaultFields,
    },
    {
        id: uuid(),
        name: 'keys',
        icon: faKey,
        fields: [{name: 'name', placeholder: 'placeholder:name', required: true}],
    },
    {
        id: uuid(),
        name: 'social',
        icon: faHubspot,
        fields: defaultFields,
    },
    {
        id: uuid(),
        name: 'finance',
        icon: faDollarSign,
        fields: defaultFields,
    },
    {
        id: uuid(),
        name: 'government',
        icon: faUniversity,
        fields: defaultFields,
    },
    {
        id: uuid(),
        name: 'others',
        icon: faOptinMonster,
        fields: defaultFields,
    },
    {
        id: uuid(),
        name: 'shops',
        icon: faShoppingBag,
        fields: defaultFields,
    },
    {
        id: uuid(),
        name: 'job',
        icon: faBriefcase,
        fields: defaultFields,
    },
    {
        id: uuid(),
        name: 'education',
        icon: faSchool,
        fields: defaultFields,
    },
];
