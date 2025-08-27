import { useEffect, useMemo } from "react";
import styled, { keyframes } from 'styled-components';
import { preloadImages } from "../constants/screensComponents";
import { useProgress } from "../contexts/ProgressContext";
import { useImagePreloader } from "../hooks/useImagePreloader";
import { FlexWrapper } from "./shared/ContentWrapper";

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

const Loading = styled(FlexWrapper)`
    gap: var(--spacing_x2);
    flex-direction: row;
    justify-content: center;
`;

const dotPulse = keyframes`
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
`;

const Dot = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--color-red);
    animation: ${dotPulse} 1.5s infinite ease-in-out;

        &:nth-child(1) {
            animation-delay: 0s;
        }

        &:nth-child(2) {
        animation-delay: calc(1.5s * 0.13);
        }

        &:nth-child(3) {
        animation-delay: calc(1.5s * 0.26);
        }
`;

export function ScreenContent() {
    const { screen, isLoading } = useProgress();
    const Screen = useMemo(() => screen, [screen]);
    useImagePreloader(preloadImages);

    if (isLoading) return (
        <Loading>
            <Dot />
            <Dot />
            <Dot />
        </Loading>
    )

    return Screen && (
        <Wrapper>
            <Screen />
        </Wrapper>
    )
}