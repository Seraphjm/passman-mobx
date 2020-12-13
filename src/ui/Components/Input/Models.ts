import {EMessageType} from 'ui/Common/Enums';
import {ChangeEvent} from 'react';

export interface ICompleteItem {
    selectedItem: boolean;
    index: number;
    value: string | undefined;
}

export interface IAutoComplete {
    isOpen: boolean;
    selectedItem: number | null;
    value: string | undefined;
    autoCompleteList: string[];
    width: number | undefined;
    maxHeight: number | undefined;
    setMouseSelected: (v: number | null) => void;
}

export interface IInput {
    message?: {
        text?: string;
        type?: EMessageType;
    };
    autoComplete?: string[];
    placeholder?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    onInput: (value: string) => void;
    onEnter?: (value: string) => void;
    type?: string;
    required?: boolean;
    value?: string;
    className?: string;
    onFocus?: (event: unknown) => void;
    onBlur?: (event: unknown) => void;
    onKeyUp?: (event: unknown) => void;
    onKeyDown?: (event: unknown) => void;
}
