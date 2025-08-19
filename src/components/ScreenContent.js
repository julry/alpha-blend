import {useEffect, useMemo} from "react";
import styled from 'styled-components';
import { preloadImages } from "../constants/screensComponents";
import { useProgress } from "../contexts/ProgressContext";
import { useImagePreloader } from "../hooks/useImagePreloader";

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

export function ScreenContent() {
    const {screen} = useProgress();
    const Screen = useMemo(() => screen, [screen]);
    useImagePreloader(preloadImages);

    return Screen && (
        <Wrapper>
            <Screen />
        </Wrapper>
    )
}