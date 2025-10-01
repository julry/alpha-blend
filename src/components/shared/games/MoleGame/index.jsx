import { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { FlexWrapper } from '../../ContentWrapper';
import { BackHeader } from '../../BackHeader';
import { Points, Timer } from '../parts';
import { useSizeRatio } from '../../../../hooks/useSizeRatio';
import { AnimatePresence, motion } from 'framer-motion';
import { MAX_TIME } from './constants';
import { getElements } from './utils';
import { useProgress } from '../../../../contexts/ProgressContext';
import { DAYS } from '../../../../constants/days';
import { CommonModal, EndGameModal, SkipModal, StartGameModal } from '../../modals';
import { SCREENS } from '../../../../constants/screens';
import { weekInfo } from '../../../../constants/weeksInfo';
import { RulesModal } from './RulesModal';
import { Bold, RedText } from '../../Spans';

const GameWrapper = styled(FlexWrapper)`
    position: relative;
    height: ${({$ratio}) => $ratio * 330}px;
    width: 100%;
    min-height: ${({$ratio}) => $ratio * 330}px;
    max-width: var(--content-width);
    margin: auto;
    padding: 0;
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
    overflow: hidden;

    & img {
        height: ${({ $ratio }) => $ratio * 90}px;
        width: ${({ $ratio }) => $ratio * 90}px;
        object-fit: contain;
    }
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
`;

const LogoWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: ${({$ratio}) => $ratio * 120}px;
    border-radius: var(--border-radius-sm);
    margin-top:  ${({$ratio}) => $ratio * 208}px;
    background: #EF3124;

    & svg {
        width: ${({$ratio}) => $ratio * 140}px; 
        height:  ${({$ratio}) => $ratio * 50}px;
    }
`;

const PointsStyled = styled(Points)`
    top: calc(0px - var(--spacing_x3));
    left: 50%;
    transform: translateX(-50%);
    z-index: 11;
`;

export const MoleGame = ({ day, isFirstTime }) => {
    const ratio = useSizeRatio();
    const {endGame, user, next} = useProgress();
    const [score, setScore] = useState(0);
    const [isStartModal, setIsStartModal] = useState(!isFirstTime);
    const [isEndModal, setIsEndModal] = useState(false);
    const [isCollegueModal, setIsCollegueModal] = useState(false);
    const [isSkipping, setIsSkipping] = useState(false);
    const [isRules, setIsRules] = useState(false);
    const [isFirstRules, setIsFirstRules] = useState(isFirstTime);
    const [gameActive, setGameActive] = useState(false);
    const [holes, setHoles] = useState(Array(9).fill(null));
    const [level, setLevel] = useState(1);
    const [shownPoints, setShownPoints] = useState([]);

    const finalScore = useRef(0);

    const isGameActive = gameActive && !isFirstRules && !isRules && !isEndModal && !isCollegueModal && !isSkipping && !isStartModal;

    const collegueMessage = weekInfo.find((info) => info.week === 4).challengeCollegueMessage[day];

    const levelSettings = {
        1: { appearTime: 500, speed: 2.8 },
        2: { appearTime: 450, speed: 3.0 },
        3: { appearTime: 400, speed: 3.2 },
        4: { appearTime: 400, speed: 3.6 },
        5: { appearTime: 450, speed: 3.8 },
        6: { appearTime: 300, speed: 4.0 }
    };

    const whackMole = (index) => {
        if (holes[index] && !holes[index]?.isClicked && gameActive) {
            const points = holes[index]?.isPositive ? 5 : -5;
            finalScore.current = Math.max(finalScore.current + points, 0);
            setScore(prev => Math.max(prev + points, 0));
            setShownPoints(prev => [...prev, {index, points}]);

            setTimeout(() => {
                setShownPoints(prev => prev.filter(ind => ind.index !== index));
            }, 400);

            setHoles(prev => {
                const newHoles = [...prev];
                newHoles[index] = {...newHoles[index], isShown: false, isClicked: true};
                return newHoles;
            });
        }
    };

    const spawnMole = useCallback(() => {
        if (!gameActive) return;

        const emptyHoles = holes
            .map((hole, index) => hole === null ? index : null)
            .filter(index => index !== null);

        if (emptyHoles.length > 0) {
            const elements = getElements();
            const randomElement = elements[Math.floor(Math.random() * elements.length)]
            const randomIndex = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];

            setHoles(prev => {
                const newHoles = [...prev];
                newHoles[randomIndex] = {
                    ...randomElement,
                    id: Date.now(),
                    duration: levelSettings[level].appearTime / 1000,
                    isShown: true,
                };
                return newHoles;
            });

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

    useEffect(() => {
        let interval;
        if (isGameActive) {
            interval = setInterval(spawnMole, 2000 / levelSettings[level].speed);
        }
        return () => clearInterval(interval);
    }, [isGameActive, gameActive, spawnMole, level]);

    useEffect(() => {
        if (gameActive) {
            const levelUpInterval = setInterval(() => {
                if (isGameActive) {
                    setLevel(prev => Math.min(prev + 1, 5));
                }
            }, MAX_TIME / 7 * 1000);
            return () => clearInterval(levelUpInterval);
        }
    }, [gameActive, isGameActive]);

    const finishGame = () => {
        setGameActive(false);
        const hasAchieve = day === DAYS.Friday && user.gameMoles[DAYS.Monday].isCompleted && user.gameMoles[DAYS.Wednesday].isCompleted && !user.achieves.includes(9);
    
        endGame({ 
            finishPoints: finalScore.current, 
            gameName: 'gameMoles', 
            week: 4, 
            day,
            achieve: hasAchieve ? 9 : undefined,
        });

        setIsEndModal(true);
    }

    const handleCloseEndModal = () => {
        setIsEndModal(false);
        setIsCollegueModal(true);
    }

    const handleStart = () => {
        setIsStartModal(false);
        setIsFirstRules(false);
        setGameActive(true);
    }

    return (
        <FlexWrapper>
            <BackHeader onBack={() => setIsSkipping(true)} onInfoClick={() => setIsRules(true)}>
                <Timer isStart={isGameActive} initialTime={MAX_TIME} onFinish={finishGame}/>
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
                                        initial={{height: 0, translateX: '-50%'}}
                                        animate={{height: `${80 * ratio}px`}}
                                        exit={{height: 0}}
                                        src={hole.img}
                                        transition={{
                                            duration: hole?.duration
                                        }}
                                    >
                                        <img src={hole.img} alt={hole.isPositive ? '+5' : '-5'}/>
                                    </HoleItem>
                                )} 
                                {shownPoints.find(ind => ind.index === index) && (
                                    <PointsStyled isShown shownPoints={shownPoints.find(ind => ind.index === index).points} />
                                )}
                            </AnimatePresence>
                        </HoleContainer>
                    ))}
                </HolesWrapper>
                <LogoWrapper $ratio={ratio}>
                    <svg  viewBox="0 0 141 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_1730_14376" style={{maskType:"luminance"}} maskUnits="userSpaceOnUse" x="0" y="0" width="141" height="50">
                        <path d="M140.65 0H0V49.79H140.65V0Z" fill="white"/>
                        </mask>
                        <g mask="url(#mask0_1730_14376)">
                        <path d="M69.6976 22.2719L76.0496 6.37734L22.0758 0L0 49.79L52.0525 34.2659L47.9745 47.7227L130.808 49.79L140.65 0L69.6976 22.2719Z" fill="white"/>
                        <path d="M23.7035 29.0195L22.6841 20.1849L22.5468 20.2044L20.9784 29.6437L23.7035 29.0195ZM28.9773 34.8117L24.7426 36.138L24.3309 33.271L20.057 34.4218L19.3904 37.7372L14.4302 39.2388L20.7627 12.0329L25.2328 11.8184L28.9773 34.8117Z" fill="#EF3124"/>
                        <path d="M31.9167 24.3979L32.8185 11.3313L41.4842 10.8047L41.0921 31.2434L37.465 32.3354L37.8572 14.7832L36.2692 14.9392L35.7789 24.0079C35.6222 26.9528 35.2889 29.2541 34.7204 30.9509C33.9752 33.1546 31.8382 34.5979 29.5054 34.5979L29.5445 30.3852L30.113 30.3658C31.3091 30.0732 31.603 28.9615 31.9167 24.3979Z" fill="#EF3124"/>
                        <path d="M48.0338 22.5643C48.0535 20.7311 47.7593 19.4244 46.6616 19.6194L46.2498 19.6974L46.1516 26.3283L46.5635 26.2308C47.6614 25.9188 48.0144 24.3975 48.0338 22.5643ZM51.0139 21.9207C50.9748 26.1918 49.5042 28.7272 47.0732 29.4682L42.8579 30.736L43.2109 10.7263L46.3871 10.5312L46.3086 16.2845L47.2889 16.1675C49.6611 15.8164 51.053 17.7082 51.0139 21.9207Z" fill="#EF3124"/>
                        <path d="M59.2869 17.5915C59.2869 16.0703 59.0712 14.8027 58.2478 14.9197L57.9735 14.9587L57.9342 20.7315L58.2087 20.673C59.0124 20.4974 59.2869 19.1127 59.2869 17.5915ZM55.2874 21.297L55.5817 21.2385L55.6208 15.2707L55.3268 15.3098C54.4053 15.4268 54.1307 16.87 54.111 18.5082C54.111 20.1464 54.3659 21.492 55.2874 21.297ZM58.0126 9.45898L57.9929 12.0918L58.4439 12.0528C60.1497 11.8968 61.4827 13.574 61.4631 17.221C61.4436 20.868 60.0909 23.1108 58.3654 23.5593L57.8951 23.6763L57.8754 26.5822L55.5032 27.3038L55.5229 24.2809L55.0326 24.4174C53.0328 24.944 51.3273 23.1108 51.3664 18.9957C51.4055 14.7832 53.1504 12.5404 55.111 12.3649L55.6208 12.3258L55.6404 9.61499L58.0126 9.45898Z" fill="#EF3124"/>
                        <path d="M64.4229 19.7952L63.9526 13.8469H63.9132L63.4623 20.0097L64.4229 19.7952ZM66.5993 23.6177L64.8935 24.1248L64.7172 22.3695L63.1683 22.7791L62.9723 24.6903L61.188 25.2169L63.1095 9.47835L64.9523 9.36133L66.5993 23.6177Z" fill="#EF3124"/>
                        <path d="M57.6609 38.2827L57.4454 38.3218V42.7683L57.6609 42.7489C58.2884 42.6903 58.5236 41.3446 58.5236 40.3696C58.5236 39.492 58.2884 38.1853 57.6609 38.2827ZM58.0139 45.3036L55.7593 45.4597V31.2032L59.9549 29.9551V32.5489L57.4648 33.1535V35.6888L58.0336 35.5718C59.5236 35.2598 60.4449 36.8396 60.4449 40.038C60.4255 43.0802 59.5039 45.206 58.0139 45.3036Z" fill="#EF3124"/>
                        <path d="M62.4042 45.4409L61.6593 45.48L61.6984 42.2816L62.2866 42.2231C62.6396 42.184 62.7769 41.6771 62.8357 41.0335L60.8359 29.6828L62.7572 29.1174L63.6982 36.7234L63.7963 36.7037L64.7767 28.5128L66.8743 27.8887L65.4431 37.913C64.5609 44.3098 64.0903 45.3239 62.4042 45.4409Z" fill="#EF3124"/>
                        <path d="M70.9717 41.2861V29.7989L69.9523 30.0527L69.7759 37.3271C69.7562 39.0433 69.6386 40.389 69.4425 41.4616L70.9717 41.2861ZM67.384 41.7151C67.5801 40.9935 67.6779 39.5699 67.7367 37.3659L68.031 27.5562L73.3636 25.957V41.0129L74.1672 40.9156V46.3762L71.7559 46.4932V44.1919L69.0895 44.3868V46.6102L66.9722 46.7078V41.7345L67.384 41.7151Z" fill="#EF3124"/>
                        <path d="M76.5789 44.3284L75.5986 44.4064V40.7008L76.3828 40.6032C76.8534 40.5447 77.0101 39.9402 77.1083 39.1601L74.481 25.6059L76.9907 24.8453L78.3041 32.9777H78.3826L79.6569 24.0847L82.4997 23.2266L80.5587 35.3181C79.402 43.0606 78.8138 44.1723 76.5789 44.3284Z" fill="#EF3124"/>
                        <path d="M91.9701 20.3997V38.8297L94.1071 38.5957V19.7756L98.1066 18.5664V38.1664L99.4788 37.9909V45.3238L95.4205 45.519V42.3791L83.2847 43.2956V22.9935L86.4805 22.0379V39.473L88.3821 39.239V21.4723L91.9701 20.3997Z" fill="#EF3124"/>
                        <path d="M111.752 19.2879L105.713 20.8481V26.0747L111.007 24.9436V29.7023L105.713 30.6188V37.2107L112.026 36.4695L111.967 41.0527L101.106 41.8913L101.165 17.6691L111.752 14.4902V19.2879Z" fill="#EF3124"/>
                        <path d="M127.514 15.1932L119.849 17.1825V23.0723L126.554 21.6291V27.0118L119.849 28.1819V35.5539L127.848 34.6372L127.828 39.8249L114.084 40.8587L114.104 13.789L127.514 9.79102V15.2127V15.1932Z" fill="#EF3124"/>
                        </g>
                    </svg>

                </LogoWrapper>
            </GameWrapper>
            <CommonModal isOpen={isCollegueModal} isCollegue onClose={() => next(SCREENS.LOBBY4)} btnText="В комнату">
                {typeof collegueMessage === 'function' ? collegueMessage() : <p>{collegueMessage}</p>}
            </CommonModal>
            <SkipModal isOpen={isSkipping} onClose={() => setIsSkipping(false)} onExit={() => next(SCREENS.LOBBY4)}/>
            <EndGameModal isOpen={isEndModal} onClose={handleCloseEndModal} points={score}/>
            <StartGameModal isOpen={isStartModal} onClose={handleStart} />
            <RulesModal isOpen={isRules} onClose={() => setIsRules(false)} />
            <CommonModal isOpen={isFirstRules} onClose={handleStart} btnText="Играть">
                <p>
                    <Bold>Нажимай на объекты, которые заряжают —</Bold> и избегай тех, что разряжают. 
                </p>
                <p>У тебя <Bold><RedText>30</RedText> секунд</Bold>, чтобы набрать максимум!</p>
            </CommonModal>
        </FlexWrapper>
    );
};
