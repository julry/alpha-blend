import { useEffect, useState } from 'react';
import { FlexWrapper } from '../../ContentWrapper';
import { useGame } from './useGame';
import styled from 'styled-components';
import { useSizeRatio } from '../../../../hooks/useSizeRatio';

const Wrapper = styled(FlexWrapper)`
  padding: 0;

    & > div {
      justify-content: flex-end;
      padding: 0;
    }
`;


const WorkBasketballGame = () => {
  const [width, setWidth] = useState(0); 
  const [height, setHeight] = useState(0); 
  const [dpr, setDpr] = useState(0); 
  const {gameContainerRef, showCurrentBest, currentScore} = useGame({ width, height, dpr });

  useEffect(() => {
    const rect = gameContainerRef.current.getBoundingClientRect();
      
      // Устанавливаем атрибуты width/height (важно для качества)
    setWidth(rect.width);
    setHeight(rect.height > 700 ? 700 : rect.height);
    setDpr(window?.devicePixelRatio || 1);
  }, []);

  return (
    <Wrapper>
        <FlexWrapper ref={gameContainerRef}></FlexWrapper>
    </Wrapper>
  );
};

export default WorkBasketballGame;