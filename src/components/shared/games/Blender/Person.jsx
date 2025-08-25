import styled from "styled-components";
import { useDrop } from "react-dnd";
import { useTimer } from "../../../../hooks/useTimer";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { useEffect, useMemo, useRef } from "react";
import { persons, QUEUE_TO_PERSON_TIME } from "./constants";
import { Points } from "../parts/Points";
import { motion, useAnimation } from "framer-motion";
import { Info } from "./Info";

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

export const Person = ({ setBlenderDrop, blenderDrop, isStopped, ingridients, isFinished, queueAmount, friendId, personId, drink, onEndTimer, onGetDrink, points, position = 'center' }) => {
    const ratio = useSizeRatio();
    const controls = useAnimation();
    const controlsInfo = useAnimation();
    const isFinishedPerson = useRef(false);
    const personTime = useMemo(() => QUEUE_TO_PERSON_TIME[queueAmount], []);
    const person = useMemo(() => persons.find(pers => pers.id === personId), []);

    const handleEnd = () => {
        if (isFinishedPerson.current) return;

        onEndTimer?.(friendId);
        isFinishedPerson.current = true;
    }

    const { time } = useTimer({ isStart: !isStopped, onFinish: handleEnd, initialTime: personTime });

    const handleDrop = (item) => {
        if (isFinishedPerson.current) return;

        if (drink !== item.id || ingridients.length !== item.ingridientsAmount) {
            controlsInfo.start({
                rotate: [-10, 10, 0], transition: {
                    repeat: 3,
                    duration: 0.1,
                }
            })

            return;
        }

        onGetDrink?.({ personDrinkId: drink, time, doneDrink: item, personId: friendId, isFinished: isFinishedPerson.current });
        isFinishedPerson.current = true;
    };

    const [, drop] = useDrop(() => ({
        accept: 'DRINK',
        collect: monitor => ({
            hovered: monitor.canDrop() && monitor.isOver(),
        }),
        drop: handleDrop,
    }), []);

    const [, dropHead] = useDrop(() => ({
        accept: 'DRINK',
        collect: monitor => ({
            hovered: monitor.canDrop() && monitor.isOver(),
        }),
        drop: handleDrop,
    }), []);

    const timeColor = useMemo(() => {
        if (time < personTime / 3) {
            return 'var(--color-red)';
        }
        if (time < 2 * personTime / 3) {
            return '#D7E02A'
        }

        return '#30E301'
    }, [time]);

    useEffect(() => {
        const heightPercentage = (time / personTime) * 100;
        controls.start({ height: `calc(${heightPercentage}% - ${ratio * 8}px)`, backgroundColor: timeColor });
    }, [time, controls, timeColor, ratio]);

    useEffect(() => {
        if (blenderDrop && position === 'left') {
            handleDrop(blenderDrop);
            setBlenderDrop();
        }
    }, [blenderDrop])

    return (
        <Wrapper 
            ref={drop}
            $ratio={ratio} 
            bottom={person.bottom} 
            width={person.width} 
            height={person.height} 
            $position={position}
            initial={{
                opacity: 0,
                height: 0,
            }}
            animate={{ opacity: 1, height: ratio * person.height + 'px' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
        >
            <Image src={person.pic} alt="friend" />
            {!isFinished && (
                <Info ingridients={ingridients} controls={controls} controlsInfo={controlsInfo}/>
            )}
            <PointsStyled $ratio={ratio} isShown={points > 0} shownPoints={points} />
        </Wrapper>
    )
}