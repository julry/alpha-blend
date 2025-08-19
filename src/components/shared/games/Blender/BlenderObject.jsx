import styled from "styled-components"
import { PlanCard } from "./PlanCard";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { memo, useState } from "react";
import './test.css';
import { useTimer } from "../../../../hooks/useTimer";
import { BLENDER_TIME } from "./constants";
import { uid } from "uid";
import { drinks } from "../../../../constants/drinks";
import blender from './assets/blender.png';

const Wrapper = styled.div`
    position: absolute;
    z-index: 9;
    height: ${({$ratio}) => $ratio * 189}px;
    width: ${({$ratio}) => $ratio * 93}px;
    left: ${({$ratio}) => $ratio * 16}px;
    bottom: ${({$ratio}) => $ratio * 125}px;
    background: url(${blender}) no-repeat center center / cover;
`;

const IndigrientsPart = styled.div`
    position: absolute;
    z-index: 4;
    height: ${({$ratio}) => $ratio * 114}px;
    top: 0;
    left: 0;
    width: 100%;
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: auto;
    grid-gap: ${({$ratio}) => $ratio * 2}px;
    padding: var(--spacing_x1) 0;
    padding-top: ${({$ratio}) => $ratio * 8}px;
    /* background-color: gray; */
`;

const ButtonPart = styled.div`
    position: absolute;
    z-index: 3;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background-color: pink; */
`;

const PlanCardStyled = styled(PlanCard)`
    height: ${({$ratio}) => $ratio * 32}px;
    width: ${({$ratio}) => $ratio * 32}px;
    padding: ${({$ratio}) => $ratio * 1}px;
    justify-self: center;
`;

const LiquidWrapper = styled.div`
    display: flex;
    align-items: flex-end;
    position: absolute;
    width: 70%;
    height: 83%;
    bottom: 10px;
    left: 6px;
    border-radius: 0 0 50px 50px;
    overflow: hidden;
`;
const Liquid = styled.div`
    width: 100%;
    height: 60%;
    background: red;
    filter: blur(5px);
    animation: shake 1s ease-in-out infinite;
`
  

const Bubbles  = styled.div`
position: absolute;
  width: 100%;
  height: 65%;
  bottom: 0;
  overflow: hidden;

  &::before {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  bottom: 20%;
  left: 30%;
  animation: bubble 1s ease-in infinite;
  filter: blur(2px);
}

 &::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  bottom: 15%;
  left: 60%;
  filter: blur(2px);
  animation: bubble 1.2s ease-in infinite;
}`


export const BlenderObject = memo(({cards = [], isStopped, onCardClick, onBlenderClick, onBlenderStop}) => {
    const ratio = useSizeRatio();
    const [isBlendering, setIsBlendering] = useState(false);
    const [drink, setDrink] = useState();
    const [timerId, setTimerId] = useState();
    useTimer({ isStart: isBlendering && !isStopped, initialTime: BLENDER_TIME, onFinish: handleBlenderFinish, timerId })

    const handleCardClick = (index) => {
        if (isBlendering) return;
        onCardClick?.(index);
    };

    const handleBlenderClick = () => {
        if (isBlendering || cards.length < 2) return;

        setTimerId(uid());
    
        const blendering = drinks.find(dr => cards.every(card => dr.recipe.includes(card.id)));

        setDrink(blendering ?? {
            id: 12,
            size: 102,
            title: 'заряд бодрости',
            recipe: [],
        });
        setIsBlendering(true);
        onBlenderClick?.();
    };


    function handleBlenderFinish() {
        setIsBlendering(false);
        setTimerId();
        onBlenderStop?.(drink);
    };

    return (
        <Wrapper $ratio={ratio}>
            <IndigrientsPart $ratio={ratio}>
                {cards.map((card, index) => (
                    <PlanCardStyled key={card.id + index} $ratio={ratio} onClick={() => handleCardClick(index)} />
                ))}
                {/* {isBlendering && ( */}
                    <>
                        <LiquidWrapper>
                            <Liquid/>
                            <Bubbles />
                        </LiquidWrapper>
                    </>
                {/* )} */}
            </IndigrientsPart>
            <ButtonPart onClick={handleBlenderClick} />
        </Wrapper>
    )
});
