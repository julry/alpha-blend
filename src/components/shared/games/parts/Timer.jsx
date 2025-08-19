import { memo, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSizeRatio } from '../../../../hooks/useSizeRatio';
import { useTimer } from '../../../../hooks/useTimer';

const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Time = styled.p`
  font-weight: 400;
  font-size: calc(${({size}) => size}px * ${({$ratio}) => $ratio});
`;

export const Timer = memo(({ className, reverse, isStart, onFinish, onStop, shownTime = true, size = 24, initialTime = 0 }) => {
    const ratio = useSizeRatio();

    const {getMinutes, getSeconds} = useTimer({reverse, isStart, onFinish, onStop, initialTime});

    return (
        <TimerWrapper className={className}>
            <Time $ratio={ratio} size={size}>{shownTime && `${getMinutes()}:${getSeconds()}`}</Time>
        </TimerWrapper>
    );
});