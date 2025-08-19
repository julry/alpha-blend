import styled from "styled-components";
import { useDrop } from "react-dnd";
import { useTimer } from "../../../../hooks/useTimer";
import { PlanCard } from "./PlanCard";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { useEffect, useMemo } from "react";
import { PERSON_TIME, persons } from "./constants";
import { Points } from "../parts/Points";
import { motion, useAnimation } from "framer-motion";

const POSITION_TO_LEFT = {
    center: 50,
    left: 25,
    right: 75
};

const POSITION_TO_INDEX = {
    center: 6,
    left: 5,
    right: 4
};

const Wrapper = styled(motion.div)`
    position: absolute;
    bottom: ${({bottom, $ratio}) => $ratio * bottom}px;
    left: ${({$position}) => POSITION_TO_LEFT[$position]}%;
    transform: translateX(-50%);
    width: ${({width, $ratio}) => $ratio * width}px;
    height: ${({height, $ratio}) => $ratio * height}px;
    z-index: ${({$position}) => POSITION_TO_INDEX[$position]};
    transition: left 300ms;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

const Info = styled.div`
    position: absolute;
    bottom: calc(100% + var(--spacing_x3));
    left: 50%;
    /* min-height: ${({$ratio}) => $ratio * 76}px; */
    background-color: white;
    transform: translateX(-50%);
    padding: ${({$ratio}) => $ratio * 4}px;
    padding-right: ${({$ratio}) => $ratio * 12}px;
    border-radius: var(--border-radius-sm);
    border: 1px solid red;
`;


const TimeLine = styled(motion.div)`
    position: absolute;
    bottom: ${({$ratio}) => $ratio * 4}px;
    right: ${({$ratio}) => $ratio * 4}px;
    width: ${({$ratio}) => $ratio * 4}px;
    /* height: calc((100% -  ${({$ratio}) => $ratio * 8}px) * ${({$heightK}) => $heightK}); */
    background: ${({$color}) => $color};
    border-radius: 100px;
    transition-property: height, background-color;
    transition-duration: 100ms, 300ms;
`;

const CardStyled = styled(PlanCard)`
    width: ${({$ratio}) => $ratio * 34}px;
    height: ${({$ratio}) => $ratio * 34}px;
    padding: ${({$ratio}) => $ratio * 1}px;
    & + & {
        margin-top: ${({$ratio}) => $ratio * 4}px;
    }
`;

const PointsStyled = styled(Points)`
    bottom: calc(100% + var(--spacing_x3));
    top: auto;
    left: 50%;
    transform: translateX(-50%);
`;

export const Person = ({isStopped, ingridients, isFinished, personId, drink, onEndTimer, onGetDrink, points, position = 'center'}) => {
    const ratio = useSizeRatio();
    const person = persons.find(pers => pers.id === personId);
    const controls = useAnimation();

    const handleEnd = () => {
        onEndTimer?.(personId);
    }

    const { time } = useTimer({isStart: !isStopped && !isFinished, onFinish: handleEnd, initialTime: PERSON_TIME});
    const [, drop] = useDrop(() => ({
        accept: 'DRINK',
        collect: monitor => ({
            hovered: monitor.canDrop() && monitor.isOver(),
        }),
        drop: (item) => {
            onGetDrink?.({personDrinkId: drink, time, doneDrink: item, personId});
        },
    }), []);

    const timeColor = useMemo(() => {
        if (time < 10) {
            return 'var(--color-red)';
        }
        if (time < 20) {
            return '#D7E02A'
        }

        return '#30E301'
    }, [time]);

    useEffect(() => {
        const heightPercentage = (time / PERSON_TIME) * 100;
        controls.start({ height: `${heightPercentage}%`, backgroundColor:  timeColor});
    }, [time, controls, timeColor]);

    return (
        <Wrapper ref={drop} $ratio={ratio} bottom={person.bottom} width={person.width} height={person.height} $position={position}>
            <Image src={person.pic} alt="friend" />
            {!isFinished && (<Info $ratio={ratio}>
                <div>
                    {ingridients.map((card) => (
                        <CardStyled key={`key_${card}`} $ratio={ratio}  {...card} />
                    ))}
                </div>
                <TimeLine $ratio={ratio} 
                    initial={{ height: '100%' }}
                    animate={controls}
                    transition={{ duration: 0.1 }}
                />
            </Info>)}
                <PointsStyled $ratio={ratio} isShown={true} shownPoints={points}/>
        </Wrapper>
    )
}