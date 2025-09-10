import styled, { keyframes } from "styled-components"
import { PlanCard } from "./PlanCard";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { memo, useState } from "react";
import { useTimer } from "../../../../hooks/useTimer";
import { BLENDER_TIME } from "./constants";
import { uid } from "uid";
import { drinks } from "../../../../constants/drinks";
import blender from './assets/blender.png';
import { AnimatePresence, motion } from "framer-motion";
import { useDrop } from "react-dnd";

const shake = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(2.5deg); }
  75% { transform: rotate(-2.5deg); }
`
const bubble = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
`;

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
    z-index: 6;
    height: ${({$ratio}) => $ratio * 108}px;
    top: 0;
    left: 0;
    width: 85%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding: var(--spacing_x1) 0;
    padding-top: ${({$ratio}) => $ratio * 8}px;
    padding-bottom: ${({$ratio}) => $ratio * 8}px;
`;

const ButtonPart = styled.div`
    position: absolute;
    z-index: 3;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const PlanCardStyled = styled(PlanCard)`
    position: relative;
    z-index: 5;
    height: ${({$ratio}) => $ratio * 28}px;
    width: ${({$ratio}) => $ratio * 28}px;
    padding: ${({$ratio}) => $ratio * 1}px;
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;

    & img {
        height: ${({$ratio}) => $ratio * 40}px;
        width: ${({$ratio}) => $ratio * 40}px;
    }
`;

const LiquidWrapper = styled.div`
    display: flex;
    align-items: flex-end;
    position: absolute;
    width: 80%;
    height: 83%;
    bottom: 10px;
    left: 6px;
    z-index: 2;
    border-radius: 0 0 10px 10px;
    overflow: hidden;
`;

const Liquid = styled.div`
    width: 300%;
    height: 75%;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    background: rgba(148, 190, 235, 0.65);
    filter: blur(8px);
    animation: ${shake} 1s ease-in-out infinite;
    clip-path: polygon(0 0, 100% 0, 93% 100%, 7% 100%);
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
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 1);
    border-radius: 50%;
    bottom: 20%;
    left: ${({$left}) => $left - 10}%;
    animation: ${bubble} 1s ease-in infinite;
    animation-delay: ${({$left}) => $left / 400}s;
}

 &::after {
  content: '';
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 1);
  border-radius: 50%;
  bottom: ${({$left}) => $left - 5 * Math.random()}%;
  left: ${({$left}) => $left + 10 * Math.random()}%;
  animation: ${bubble}  1.2s ease-in infinite;
  animation-delay: ${({$left}) => $left / 600}s;
}`

const ErrorSign = styled(motion.div)`
    position: absolute;
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
    height: ${({$ratio}) => $ratio * 50}px;
    width: ${({$ratio}) => $ratio * 50}px;
`;

export const BlenderObject = memo(({cards = [], onDrop, buttonChildren, isStopped, onCardClick, onBlenderClick, onBlenderStop, className}) => {
    const ratio = useSizeRatio();
    const [isBlendering, setIsBlendering] = useState(false);
    const [drink, setDrink] = useState();
    const [timerId, setTimerId] = useState();
    const [isError, setIsError] = useState(false);
    const [, drop] = useDrop(() => ({
        accept: 'DRINK',
        collect: monitor => ({
            hovered: monitor.canDrop() && monitor.isOver(),
        }),
        drop: (item) => {
            onDrop(item);
        },
    }), []);

    useTimer({ isStart: isBlendering && !isStopped, initialTime: BLENDER_TIME, onFinish: handleBlenderFinish, timerId })

    const handleCardClick = (index) => {
        if (isBlendering) return;
        onCardClick?.(index);
    };

    const handleBlenderClick = () => {
        if (isBlendering || cards.length < 2) return;

        const blendering = drinks.find(dr => cards.every(card => dr.recipe.slice(0, cards.length).includes(card.id)));
        
        if (!blendering) {
            setIsError(true);
            setTimeout(() => setIsError(false), 500);
            return;
        }

        setTimerId(uid());

        setDrink({...blendering, ingridientsAmount: cards.length});
        setIsBlendering(true);
        onBlenderClick?.();
    };


    function handleBlenderFinish() {
        setIsBlendering(false);
        setTimerId();
        onBlenderStop?.(drink);
    };

    return (
        <Wrapper $ratio={ratio} className={className}>
            <IndigrientsPart ref={drop} $ratio={ratio}>
                {cards.map((card, index) => (
                    <PlanCardStyled key={card.id + index} $ratio={ratio} onClick={() => handleCardClick(index)} card={card}/>
                ))}
                <AnimatePresence>
                    {isError && (
                        <ErrorSign $ratio={ratio} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                            <svg width="100%" height="100%" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.47089 1.471L10.5291 10.5292M10.5291 1.471L1.47089 10.5292" stroke="var(--color-red)" stroke-opacity="1" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </ErrorSign>
                    )}
                </AnimatePresence>
                {isBlendering && (
                    <LiquidWrapper>
                        <Liquid />
                        <Bubbles $left={20}/>
                        <Bubbles $left={50}/>
                        <Bubbles $left={80}/>
                    </LiquidWrapper>
                )} 
            </IndigrientsPart>
            <ButtonPart onClick={handleBlenderClick}>
                {typeof buttonChildren === 'function' ? buttonChildren() : buttonChildren}
            </ButtonPart>
        </Wrapper>
    )
});
