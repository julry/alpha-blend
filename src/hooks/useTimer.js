import { useCallback, useEffect, useRef, useState } from "react";

export const useTimer = ({ timerId, isStart, initialTime, reverse, onFinish, onStop, interval = 1 }) => {
    const [time, setTime] = useState(initialTime);
    const $interval = useRef(null);
    const $time = useRef(initialTime);
    const $restart = useRef(false);
    const started = useRef(false);

    useEffect(() => {
        if (isStart) {
            if ($restart.current) {
                $time.current = initialTime;
                $restart.current = false;
            };

            if ($interval.current) {
                clearInterval($interval.current);
                $interval.current = null;
            }

            if (!started.current) {
                setTime($time.current);
                started.current = true;

                if (reverse) {
                    $time.current += interval;
                } else {
                    if ($time.current <= 0) {
                        onFinish?.();
                        clearInterval($interval.current);
                        $interval.current = null;

                        return;
                    }

                    $time.current -= interval;
                }
            }

            $interval.current = setInterval(() => {
                setTime($time.current);

                if (reverse) {
                    $time.current += interval;
                } else {
                    if ($time.current <= 0) {
                        onFinish?.();
                        clearInterval($interval.current);
                        $interval.current = null;

                        return;
                    }

                    $time.current -= interval;
                }

            }, interval * 1000);
        }
        if (!isStart) {
            onStop?.($time.current);
            clearInterval($interval.current);
            $interval.current = null;
            if ($time.current === 0) {
                $restart.current = true;
            };
        }

        return () => {
            if ($interval.current) {
                clearInterval($interval.current);
                $interval.current = null;
            }
        }
    }, [initialTime, isStart, timerId]);

    const getMinutes = useCallback(() => {
        const minutes = Math.floor(time / 60);
        return minutes > 9 ? minutes : `0${minutes}`;
    }, [time]);

    const getSeconds = useCallback(() => {
        const seconds = Math.floor(time % 60);
        return seconds > 9 ? seconds : `0${seconds}`;
    }, [time]);

    return {
        getSeconds,
        getMinutes,
        time
    }
}