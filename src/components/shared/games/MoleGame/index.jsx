import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FlexWrapper } from '../../ContentWrapper';
import { BackHeader } from '../../BackHeader';
import { Timer } from '../parts';
import { useSizeRatio } from '../../../../hooks/useSizeRatio';
import { AnimatePresence, motion } from 'framer-motion';
import { MAX_TIME } from './constants';

const GameWrapper = styled(FlexWrapper)`
    position: relative;
    height: ${({$ratio}) => $ratio * 330}px;
    width: 100%;
    min-height: ${({$ratio}) => $ratio * 330}px;
    max-width: var(--content-width);
    margin: auto;
`;

const HolesBg = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: ${({$ratio}) => $ratio * 210}px;
    width: 100%;
    min-height: ${({$ratio}) => $ratio * 210}px;
    background: #ECECEC;
    border: 4px solid #EF3124;
    border-radius: var(--border-radius-sm);
    z-index: 2;
`;

const HoleItem = styled(motion.div)`
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${({ $ratio }) => $ratio * 90}px;
    z-index: 5;
`;

const HolesWrapper = styled(HolesBg)`
    background: transparent;
    border: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-row-gap: var(--spacing_x6);
    grid-column-gap: var(--spacing_x2);
    z-index: 5;
    padding: var(--spacing_x3);
`;

const HoleContainer = styled.div`
    position: relative;
    z-index: ${({$zIndex}) => $zIndex + 2};
`;

const Amount = styled.p`
    font-size: ${({ $ratio }) => $ratio * 24}px;
    font-weight: 400;
`;

const HolePart = styled.div`
    position: absolute;
    width: ${({ $ratio }) => $ratio * 84}px;
    height: ${({ $ratio }) => $ratio * 37}px;
    border: 4px solid white;
    border-radius: 50%;
    left: 50%;
    background: #D9D9D9;

`;
const MiddlePart = styled(HolePart)`
    top: 0;
    transform: translate(-50%, 0);
    z-index: 1;
    border-color: transparent;
`;

const FrontHole = styled(HolePart)`
    top: 50%;
    transform: translate(-50%, -50%);
    background: none;
    z-index: 10;
    clip-path: polygon(0 47%, 100% 47%, 100% 100%, 0% 100%);
`;

const BackHole = styled(HolePart)`
    top: 0%;
    z-index: 2;
    transform: translate(-50%, 0);
    clip-path: polygon(0 0, 100% 0, 100% 53%, 0 53%);
`;

const BottomHole = styled.div`
    position: absolute;
    bottom: -5%;
    left: 50%;
    transform: translate(-50%, 0);
    width: ${({ $ratio }) => $ratio * 90}px;
    height: 100%;
    clip-path: polygon(0% 100%, 0% 44%, 24% 80%, 35% 82%, 43% 85%, 52% 86%, 60% 85%, 69% 82%, 74% 78%, 80% 75%, 86% 74%, 100% 44%, 100% 100%);
    z-index: 7;
    background: #ECECEC;
`

const WhackAMole = () => {
    const ratio = useSizeRatio();
    const [score, setScore] = useState(0);
    const [gameActive, setGameActive] = useState(true);
    const [holes, setHoles] = useState(Array(9).fill(null));
    const [level, setLevel] = useState(1);

    // Настройки уровня: время появления и скорость
    const levelSettings = {
        1: { appearTime: 800, speed: 1.9 },
        2: { appearTime: 700, speed: 2.2 },
        3: { appearTime: 600, speed: 2.3 },
        4: { appearTime: 500, speed: 2.4 },
        5: { appearTime: 400, speed: 2.5 },
        6: { appearTime: 300, speed: 2.8 }
    };

    // Обработчик удара по кроту
    const whackMole = (index) => {
        if (holes[index] && !holes[index]?.isClicked && gameActive) {
            setScore(prev => prev + 1);
            setHoles(prev => {
                const newHoles = [...prev];
                newHoles[index] = {...newHoles[index], isShown: false, isClicked: true};
                return newHoles;
            });
        }
    };

    // Появление кротов
    const spawnMole = useCallback(() => {
        if (!gameActive) return;

        const emptyHoles = holes
            .map((hole, index) => hole === null ? index : null)
            .filter(index => index !== null);

        if (emptyHoles.length > 0) {
            const randomIndex = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];

            setHoles(prev => {
                const newHoles = [...prev];
                newHoles[randomIndex] = {
                    id: Date.now(),
                    duration: levelSettings[level].appearTime / 1000,
                    isShown: true,
                };
                return newHoles;
            });

            // Убираем крота через определенное время
            setTimeout(() => {
                setHoles(prev => {
                    const newHoles = [...prev];
                    if (newHoles[randomIndex]?.id === newHoles[randomIndex]?.id) {
                        newHoles[randomIndex] = null;
                    }
                    return newHoles;
                });
            }, levelSettings[level].appearTime * 2);
        }
    }, [gameActive, holes, level]);

    // Интервал появления кротов
    useEffect(() => {
        let interval;
        if (gameActive) {
            interval = setInterval(spawnMole, 2000 / levelSettings[level].speed);
        }
        return () => clearInterval(interval);
    }, [gameActive, spawnMole, level]);

    // Повышение уровня каждые MAX_TIME / 7 секунд
    useEffect(() => {
        if (gameActive) {
            const levelUpInterval = setInterval(() => {
                setLevel(prev => Math.min(prev + 1, 5));
            }, MAX_TIME / 7 * 1000);
            return () => clearInterval(levelUpInterval);
        }
    }, [gameActive]);

    return (
        <FlexWrapper>
            <BackHeader>
                <Timer isStart={gameActive} initial={MAX_TIME}/>
                <Amount $ratio={ratio}>{score}</Amount>
            </BackHeader>
            <GameWrapper $ratio={ratio}>
                <HolesBg $ratio={ratio}/>
                <HolesWrapper $ratio={ratio}>
                    {holes.map((hole, index) => (
                        <HoleContainer $ratio={ratio} key={index} $zIndex={index} onClick={() => whackMole(index)}>
                            <BackHole $ratio={ratio} />
                            <FrontHole $ratio={ratio} />
                            <BottomHole $ratio={ratio}/>
                            <MiddlePart $ratio={ratio}/>
                            <AnimatePresence>
                                {hole?.isShown && (
                                    <HoleItem 
                                        $ratio={ratio}
                                        initial={{height: 0, background: 'red', translateX: '-50%'}}
                                        animate={{height: `${90 * ratio}px`}}
                                        exit={{height: 0}}
                                        transition={{
                                            duration: hole?.duration
                                        }}
                                    />
                                )} 
                            </AnimatePresence>
                            {/* {hole && (
                                <div className="mole">
                                    🐹
                                    <div
                                        className="timer-bar"
                                        style={{
                                            animationDuration: `${hole.duration}ms`,
                                            animationPlayState: gameActive ? 'running' : 'paused'
                                        }}
                                    />
                                </div>
                            )} */}
                        </HoleContainer>
                    ))}
                </HolesWrapper>
            </GameWrapper>
        </FlexWrapper>
    );
};

export default WhackAMole;