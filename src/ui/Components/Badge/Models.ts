import {EColors, ESizes} from 'ui/Common/Enums';
import {EBadgeCounterPosition} from './Enums';

/**
 * Interface of badge component.
 *
 * type Color type.
 * text Badge text.
 * [forceSize] Force size for badge. Default badges scale to match the size of the immediate parent element by using relative font sizing
 * [counter] Add badge counter.
 * [counterPosition] set counter position.
 */
export interface IBadge {
    type: EColors;
    text: string;
    forceSize?: ESizes;
    counter?: number;
    counterPosition?: EBadgeCounterPosition;
}
