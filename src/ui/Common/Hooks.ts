import {KeyboardEvent, MutableRefObject, useEffect, useRef} from 'react';
import {EKeyCode} from './Enums';

export const usePrevious = <T = unknown>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export const useRemoteScrollControl = <T extends HTMLElement>(
    refContainer: MutableRefObject<T | undefined>,
    selectedItem: number | null
) => {
    const prevSelectedItem = usePrevious(selectedItem);

    useEffect(() => {
        if (selectedItem == null) return;

        if (selectedItem !== null && refContainer.current) {
            const {children, scrollHeight, clientHeight, scrollTop} = refContainer.current;
            const scrollBottom = scrollHeight - (scrollHeight - clientHeight - scrollTop);
            const activeChild = children[selectedItem];
            const next: any = children[selectedItem + 1];
            const prev: any = children[selectedItem - 1];

            // @ts-ignore в общем-то кейс с null|0 отрабатывает после ||.
            if (prevSelectedItem > selectedItem || !prevSelectedItem) {
                if (selectedItem === children.length - 1) {
                    children[children.length - 1].scrollIntoView();
                } else if (prev && scrollBottom > prev.offsetTop) activeChild.scrollIntoView();
                else if (selectedItem === 0) activeChild.scrollIntoView();
            } else {
                if (prevSelectedItem === children.length - 1) {
                    children[0].scrollIntoView();
                } else if (next && scrollBottom < next.offsetTop) activeChild.scrollIntoView();
            }
        }
        // eslint-disable-next-line
    }, [selectedItem]);
};
