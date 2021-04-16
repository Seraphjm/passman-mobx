import {FunctionComponent, useState} from 'react';
import {useRecursionTimeout} from 'ui/Common/Hooks';
import {Button} from './Button';
import {ITimeoutButton} from './Models';

/** Хок-компонент над Button, запускающий таймер, блокирующий кнопку до его истечения. Может использоваться для
 *  подстраховки от случайного клика по кнопке.
 */
export const TimeoutButton: FunctionComponent<ITimeoutButton> = ({children, timeout, ...rest}) => {
    /** Время таймаута */
    const [seconds, setSeconds] = useState<number>(timeout);

    /**
     * Функция, декрементирующая заданный таймаут.
     */
    const countDown = (): void => {
        if (seconds > 0) setSeconds(seconds - 1);
    };

    useRecursionTimeout(countDown, 1000, seconds === 0);

    return (
        <Button disabled={seconds !== 0} {...rest}>
            {children}
            {seconds > 0 && ` (${seconds})`}
        </Button>
    );
};
