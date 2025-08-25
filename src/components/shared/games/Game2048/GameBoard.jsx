import isNil from "lodash/isNil";
import styled from "styled-components";
import {GameTile} from "./GameTile";
import {CONTAINER_SIZE} from "./constants";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";

const Board = styled.div`
    position: relative;
    width: ${({$sizeRatio}) => `calc(${CONTAINER_SIZE}px * ${$sizeRatio})`};
    height: ${({$sizeRatio}) => `calc(${CONTAINER_SIZE}px * ${$sizeRatio})`};
    background: #898FA6;
    border-radius: var(--border-radius-lg);
    padding: var(--spacing_x2);
`

const Tiles = styled.div`
    position: absolute;
    z-index: 2;
    left: var(--spacing_x2);
    top: var(--spacing_x2);
    right: var(--spacing_x2);
    bottom: var(--spacing_x2);
`

export function GameBoard({ className, tiles }) {
    const sizeRatio = useSizeRatio()
    const renderTiles = () => {
        return tiles.filter((tile) => !isNil(tile?.id)).map((tile) => (
            <GameTile key={`${tile.id}`} {...tile} />
        ));
    };

    return (
        <Board className={className} $sizeRatio={sizeRatio}>
            <Tiles $sizeRatio={sizeRatio}>{renderTiles()}</Tiles>
        </Board>
    );
}