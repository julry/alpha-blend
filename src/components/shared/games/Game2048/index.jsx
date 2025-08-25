import {useEffect, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import {useProgress} from "../../../../contexts/ProgressContext";
import {useGame} from "./useGame";
import {GameBoard} from "./GameBoard";
import {GameController} from "./GameController";
import {ACTIONS} from "./constants";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import {useCallbackRef} from "../../../../hooks/useCallbackRef";
import { BackHeader } from "../../BackHeader";
import { Timer } from "../parts";
import { MAX_TIME } from "./constants";
import { FlexWrapper } from "../../ContentWrapper";
import { RulesModal } from "./RulesModal";
import { CommonModal } from "../../modals/CommonModal";
import { EndGameModal } from "../../modals/EndGameModal";
import { LifeContainer } from "../parts/LifesContainer";
import { SCREENS } from "../../../../constants/screens";
import { SkipModal } from "../../modals/SkipModal";
import { uid } from "uid";

const WrapperInner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: ${({$ratio}) => `calc(26px * ${$ratio})`};
    padding: ${({$ratio}) => `0 calc(16px * ${$ratio}) calc(50px * ${$ratio})`};
`

const Amount = styled.p`
    font-size: ${({ $ratio }) => $ratio * 24}px;
    font-weight: 400;
`;

const LifeContainerStyled = styled(LifeContainer)`
    margin: var(--spacing_x8) 0;
`;

const TRIES_AMOUNT = 3;

export function Game2048({isFirst, collegueMessage, lobbyScreen}) {
    const {next} = useProgress()
    const ratio = useSizeRatio();
    const [tries, setTries] = useState(TRIES_AMOUNT);
    const [isRulesModal, setIsRulesModal] = useState();
    const [isFirstMessage, setIsFirstMessage] = useState(isFirst);
    const [isSkipping, setIsSkipping] = useState(false);
    const [isEndModal, setIsEndModal] = useState({shown: false, title: ''});
    const [isFinishModal, setIsFinishModal] = useState(false);
    const isGameActive = useMemo(
        () => !(isRulesModal || isSkipping || isEndModal?.shown || isFirstMessage || isFinishModal),
        [isRulesModal, isSkipping, isEndModal, isFirstMessage, isFinishModal],
    );
    const handleResultRef = useCallbackRef(handleResult);
    const timerRef = useRef(uid());

    const {startGame, restartGame, getTiles, moveTiles, score} = useGame(handleResultRef, handleResultRef, TRIES_AMOUNT);

    const handleRetry = () => {
        setIsEndModal({shown: false});
        timerRef.current = uid();
        restartGame();
    }

    function handleResult({isFromGame}) {
        setIsEndModal({shown: true, title: isFromGame ? 'Закончились клетки!' : undefined});
        setTries(prev => prev - 1);
        // addPoints2048(points)
    }

    useEffect(() => {
        startGame();
    }, []);

    const handleCloseCollegue = () => {
        setIsEndModal({shown: false});
        setIsFinishModal(true);
    };

    return (
        <>
            <FlexWrapper>
                <BackHeader onInfoClick={() => setIsRulesModal(true)} onBack={() => setIsSkipping(true)}>
                    <Timer initialTime={MAX_TIME} isStart={isGameActive} onFinish={handleResult} key={timerRef.current}/>
                    <Amount $ratio={ratio}>{score}</Amount>
                </BackHeader>
                <LifeContainerStyled lives={tries}/>
                <GameController
                    active={isGameActive}
                    onMoveUp={() => moveTiles(ACTIONS.MOVE_UP)}
                    onMoveDown={() => moveTiles(ACTIONS.MOVE_DOWN)}
                    onMoveLeft={() => moveTiles(ACTIONS.MOVE_LEFT)}
                    onMoveRight={() => moveTiles(ACTIONS.MOVE_RIGHT)}
                >
                    {(ref) => (
                        <WrapperInner ref={ref} $ratio={ratio}>
                            <GameBoard tiles={getTiles()} />
                        </WrapperInner>
                    )}
                </GameController>
            </FlexWrapper>
            <RulesModal isOpen={isRulesModal} onClose={() => setIsRulesModal(false)}/>
            <CommonModal isOpen={isFirstMessage} btnText="Играть" onClose={() => setIsFirstMessage(false)}>
                <p>
                    Это игра в стиле «2048», нужно соединять одинаковые числа.{'\n\n'}
                    За каждое соединение ты получаешь баллы, чем больше число — тем больше очков. Всё просто — удачи и вперёд в игру!
                </p>
            </CommonModal>
            <CommonModal isOpen={isEndModal?.shown && tries === 0} isCollegue onClose={handleCloseCollegue}>
                <p>{collegueMessage}</p>
            </CommonModal>
            <CommonModal isOpen={isFinishModal} onClose={() => next(lobbyScreen)} btnText="В комнату">
                <p>Сегодня с челленджем — всё.</p>
            </CommonModal>
            <SkipModal opened={isSkipping} onClose={() => setIsSkipping(false)} onExit={() => next(lobbyScreen)}/>
            <EndGameModal isOpen={isEndModal?.shown && tries > 0} onRetry={handleRetry} onClose={() => next(lobbyScreen)} title={isEndModal?.title}/>
        </>
    )
}