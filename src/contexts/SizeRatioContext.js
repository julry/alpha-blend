import {createContext, useCallback, useLayoutEffect, useState} from 'react';
import useResizeObserver from "use-resize-observer";
import {getSizeRatio} from "../utils/getSizeRatio";

const INITIAL_STATE = 1;

export const SizeRatioContext = createContext(INITIAL_STATE);

export function SizeRatioContextProvider(props) {
    const {children, target, targetWidth, targetHeight} = props;

    const [sizeRatio, setSizeRatio] = useState(INITIAL_STATE);

    const calculateSizeRatio = useCallback(() => {
        const width = target?.current?.clientWidth;
        const height = target?.current?.clientHeight;
        setSizeRatio(getSizeRatio(width, height, targetWidth, targetHeight));
    }, [target, targetHeight, targetWidth]);

    useLayoutEffect(() => {
        calculateSizeRatio();
    }, [calculateSizeRatio]);

    useResizeObserver({ onResize: calculateSizeRatio, ref: target });

    return (
        <SizeRatioContext.Provider value={sizeRatio}>
            {typeof children === 'function' ? children(sizeRatio) : children}
        </SizeRatioContext.Provider>
    );
};
