import {EColors, ESizes} from 'ui/Common/Enums';
import {EBadgeCounterPosition} from './Enums';

/**
 * Interface of badge component.
 *
 * @prop type Color type.
 * @prop text Badge text.
 * @prop [forceSize] Force size for badge. Default badges scale to match the size of the immediate parent element by using relative font sizing
 * @prop [counter] Add badge counter.
 * @prop [counterPosition] set counter position.
 */
export interface IBadge {
    type: EColors;
    text: string;
    forceSize?: ESizes;
    counter?: number;
    counterPosition?: EBadgeCounterPosition;
}
