import styled from "styled-components";
import { useEffect, useState } from "react";
import { CONTAINER_SIZE, TILE_COUNT_PER_DIMENSION, MERGE_ANIMATION_DURATION, MOVE_ANIMATION_DURATION } from "./constants";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";

const VALUE_TO_BACKGROUND = {
    2: '#9DF2F5',
    4: '#9EDFFF',
    8: '#C7BFFF',
    16: '#DFBFFF',
    32: '#BFF0A8',
    64: '#D6F09A',
    128: '#FFCAC7',
    256: '#FFCF99',
}

const Tile = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    padding-top: var(--spacing_x1);
    width: ${({$sizeRatio}) => `calc(${(CONTAINER_SIZE - 20 - 10 * (TILE_COUNT_PER_DIMENSION - 1) ) / TILE_COUNT_PER_DIMENSION}px * ${$sizeRatio})`};
    height: ${({$sizeRatio}) => `calc(${(CONTAINER_SIZE - 20 - 10 * (TILE_COUNT_PER_DIMENSION - 1)) / TILE_COUNT_PER_DIMENSION}px * ${$sizeRatio})`};
    border-radius: ${({$sizeRatio}) => `calc(10px * ${$sizeRatio})`};
    background: ${({value}) => VALUE_TO_BACKGROUND[value]};
    color: #000000;
    font-size: ${({$sizeRatio}) => `calc(32px * ${$sizeRatio})`};
    font-weight: 700;
    transition-property: $left, top, transform, box-shadow;
    transition-duration: ${MOVE_ANIMATION_DURATION}ms, ${MOVE_ANIMATION_DURATION}ms, ${MERGE_ANIMATION_DURATION}ms, ${MERGE_ANIMATION_DURATION}ms;
    left: ${({$left, $sizeRatio}) => $left * $sizeRatio}px;
    top: ${({$top, $sizeRatio}) => $top * $sizeRatio}px;
    transform: scale(${({scale}) => scale});
    z-index: ${({value}) => value};
    box-shadow: 0px 0px 48px -12px rgba(0, 0, 0, 0.15);
    /* box-shadow: 0px 0px 48px -12px rgba(0, 0, 0, 0.15), inset 2px 2px 8.6px rgba(255, 255, 255, 0.45), inset 1px 1px 4.3px rgba(255, 255, 255, 0.45); */
`;

export function GameTile({ position, value }) {
    const sizeRatio = useSizeRatio();
    const [scale, setScale] = useState(1);

    const positionToPixels = (position) => ((position) / TILE_COUNT_PER_DIMENSION) * (CONTAINER_SIZE - (10 * sizeRatio));

    useEffect(() => {
        setScale(1.15);
        setTimeout(() => setScale(1), MERGE_ANIMATION_DURATION);
    }, [value]);

    return (
        <Tile
            $sizeRatio={sizeRatio}
            $left={positionToPixels(position[0])}
            $top={positionToPixels(position[1])}
            scale={scale}
            value={value}
        >
            {value}
        </Tile>
    );
}
