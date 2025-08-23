import styled from "styled-components";
import { useDrop } from "react-dnd";
import { useTimer } from "../../../../hooks/useTimer";
import { PlanCard } from "./PlanCard";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { useEffect, useMemo, useState } from "react";
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
    bottom: ${({ bottom, $ratio }) => $ratio * bottom}px;
    left: ${({ $position }) => POSITION_TO_LEFT[$position]}%;
    transform: translateX(-50%);
    width: ${({ width, $ratio }) => $ratio * width}px;
    height: ${({ height, $ratio }) => $ratio * height}px;
    z-index: ${({ $position }) => POSITION_TO_INDEX[$position]};
    transition: left 300ms;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

const Info = styled(motion.div)`
    position: absolute;
    bottom: calc(100% + var(--spacing_x3));
    left: 50%;
    /* min-height: ${({ $ratio }) => $ratio * 76}px; */
    background-color: white;
    /* transform: translateX(-50%); */
    padding: ${({ $ratio }) => $ratio * 4}px;
    padding-right: ${({ $ratio }) => $ratio * 12}px;
    border-radius: var(--border-radius-sm);
    border: 1px solid red;
`;

const TimeLine = styled(motion.div)`
    position: absolute;
    bottom: ${({ $ratio }) => $ratio * 4}px;
    right: ${({ $ratio }) => $ratio * 4}px;
    width: ${({ $ratio }) => $ratio * 4}px;
    background: ${({ $color }) => $color};
    border-radius: 100px;
    transition-property: height, background-color;
    transition-duration: 100ms, 300ms;
`;

const CardStyled = styled(PlanCard)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({ $ratio }) => $ratio * 34}px;
    height: ${({ $ratio }) => $ratio * 34}px;
    padding: ${({ $ratio }) => $ratio * 1}px;

    & + & {
        margin-top: ${({ $ratio }) => $ratio * 4}px;
    }

    & img {
        object-fit: cover;

        width: ${({ $ratio }) => $ratio * 46}px;
        height: ${({ $ratio }) => $ratio * 46}px;
    }
`;

const PointsStyled = styled(Points)`
    bottom: calc(100% + var(--spacing_x3));
    top: auto;
    left: 50%;
    transform: translateX(-50%);
`;

const DropHead = styled.div`
    position: absolute;
    border: 1px solid red;
    left: ${({ $headLeft, $ratio }) => $headLeft * $ratio}px;
    top: ${({ $headTop, $ratio }) => $headTop * $ratio}px;
    width: ${({ $headWidth, $ratio }) => $headWidth * $ratio}px;
    height: ${({ $headHeight, $ratio }) => $headHeight * $ratio}px;
    z-index: 10;
`;

const DropBody = styled.div`
    position: absolute;
    border: 1px solid red;
    left: ${({ $bodyLeft, $ratio }) => $bodyLeft * $ratio}px;
    top: ${({ $bodyTop, $ratio }) => $bodyTop * $ratio}px;
    width: ${({ $bodyWidth, $ratio }) => $bodyWidth * $ratio}px;
    height: ${({ $bodyHeight, $ratio }) => $bodyHeight * $ratio}px;
    z-index: 10;
`;

export const Person = ({ isStopped, ingridients, isFinished, personId, drink, onEndTimer, onGetDrink, points, position = 'center' }) => {
    const ratio = useSizeRatio();
    const person = persons.find(pers => pers.id === personId);
    const controls = useAnimation();
    const controlsInfo = useAnimation();

    const handleEnd = () => {
        onEndTimer?.(personId);
    }

    const { time } = useTimer({ isStart: false, onFinish: handleEnd, initialTime: PERSON_TIME });

    const [, drop] = useDrop(() => ({
        accept: 'DRINK',
        collect: monitor => ({
            hovered: monitor.canDrop() && monitor.isOver(),
        }),
        drop: (item) => {
            if (drink !== item.id || ingridients.length !== item.ingridientsAmount) {
                controlsInfo.start({
                    rotate: [-10, 10, 0], transition: {
                        repeat: 3,
                        duration: 0.1,
                    }
                })

                return;
            }

            onGetDrink?.({ personDrinkId: drink, time, doneDrink: item, personId, ingridientsAmount: ingridients.length });
        },
    }), []);

    const [, dropHead] = useDrop(() => ({
        accept: 'DRINK',
        collect: monitor => ({
            hovered: monitor.canDrop() && monitor.isOver(),
        }),
        drop: (item) => {
            if (drink !== item.id || ingridients.length !== item.ingridientsAmount) {
                controlsInfo.start({
                    rotate: [-10, 10, 0], transition: {
                        repeat: 3,
                        duration: 0.1,
                    }
                })
                return;
            }

            onGetDrink?.({ personDrinkId: drink, time, doneDrink: item, personId, ingridientsAmount: ingridients.length });
        },
    }), []);

    const timeColor = useMemo(() => {
        if (time < PERSON_TIME / 3) {
            return 'var(--color-red)';
        }
        if (time < 2 * PERSON_TIME / 3) {
            return '#D7E02A'
        }

        return '#30E301'
    }, [time]);

    useEffect(() => {
        const heightPercentage = (time / PERSON_TIME) * 100;
        controls.start({ height: `calc(${heightPercentage}% - ${ratio * 8}px)`, backgroundColor: timeColor });
    }, [time, controls, timeColor, ratio]);

    console.log(ingridients);
    return (
        <Wrapper $ratio={ratio} bottom={person.bottom} width={person.width} height={person.height} $position={position}>
            <Image src={person.pic} alt="friend" />
            <DropHead
                ref={dropHead}
                $ratio={ratio}
                $headLeft={person.headLeft}
                $headTop={person.headTop}
                $headWidth={person.headWidth}
                $headHeight={person.headHeight}
            />
            <DropBody
                ref={drop}
                $ratio={ratio}
                $bodyLeft={person.bodyLeft}
                $bodyTop={person.bodyTop}
                $bodyWidth={person.bodyWidth}
                $bodyHeight={person.bodyHeight}
            />
            {!isFinished && (
                <Info initial={{ translateX: '-50%', rotate: 0 }} $ratio={ratio} animate={controlsInfo}>
                    <div>
                        {ingridients.map((card) => (
                            <CardStyled key={`key_${card}`} $ratio={ratio} card={{id: card}} />
                        ))}
                    </div>
                    <TimeLine
                        $ratio={ratio}
                        initial={{ height: `calc(100% - ${ratio * 8}px)` }}
                        animate={controls}
                        transition={{ duration: 0.1 }}
                    />
                </Info>
            )}
            <PointsStyled $ratio={ratio} isShown={true} shownPoints={points} />
        </Wrapper>
    )
}