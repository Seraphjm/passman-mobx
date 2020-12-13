import {EPositions} from './Enums';

/**
 * Модель возможных позиций компонентов шаблона.
 */
export interface IPositions {
    position?: EPositions;
}

export interface IFuzzySortResult {
    target: string;
    score: number;
}
