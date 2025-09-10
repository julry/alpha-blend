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
import { SkipModal } from "../../modals/SkipModal";
import { weekInfo } from "../../../../constants/weeksInfo";
import { Bold } from "../../Spans";
import { StartGameModal } from "../../modals/StartGameModal";

const WrapperInner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    padding: ${({$ratio}) => `0 calc(16px * ${$ratio}) calc(50px * ${$ratio})`};
`

const Amount = styled.p`
    font-size: ${({ $ratio }) => $ratio * 24}px;
    font-weight: 400;
`;

const TRIES_AMOUNT = 3;

export function Game2048({isFirst, lobbyScreen, day}) {
    const {next, endGame } = useProgress();
    const ratio = useSizeRatio();
    const [isRulesModal, setIsRulesModal] = useState();
    const [isFirstMessage, setIsFirstMessage] = useState(isFirst);
    const [isSkipping, setIsSkipping] = useState(false);
    const [isEndModal, setIsEndModal] = useState({shown: false, title: ''});
    const [isCollegueModal, setIsCollegueModal] = useState(false);
    const [isStartModal, setIsStartModal] = useState(!isFirst);

    const isGameActive = useMemo(
        () => !(isRulesModal || isSkipping || isEndModal?.shown || isFirstMessage || isCollegueModal || isStartModal),
        [isRulesModal, isSkipping, isEndModal, isFirstMessage, isCollegueModal, isStartModal],
    );
    const handleResultRef = useCallbackRef(handleResult);

    const collegueMessage = useMemo(() => weekInfo.find((info) => info.week === 1).challengeCollegueMessage[day], [day]);

    const {startGame, getTiles, moveTiles, score} = useGame(handleResultRef, handleResultRef, TRIES_AMOUNT);

    function handleResult({isFromGame}) {
        setIsEndModal({shown: true, title: isFromGame ? 'Закончились клетки!' : undefined});
    }

    useEffect(() => {
        startGame();
    }, []);

    const handleCloseEndModal = () => {
        setIsEndModal({shown: false});
        setIsCollegueModal(true);
    }

    useEffect(() => {
        if (isEndModal.shown) {
            endGame({finishPoints: score, gameName: 'game2048', week: 1, day})
        }
    }, [isEndModal, score]);
    
    return (
        <>
            <FlexWrapper>
                <BackHeader onInfoClick={() => setIsRulesModal(true)} onBack={() => setIsSkipping(true)}>
                    <Timer 
                        initialTime={MAX_TIME} 
                        isStart={isGameActive} 
                        onFinish={() => handleResult({isFromGame: false})} 
                    />
                    <Amount $ratio={ratio}>{score}</Amount>
                </BackHeader>
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
                    <Bold>Соединяй плитки с одинаковыми числами и зарабатывай очки!</Bold>
                </p>
                <p>
                    За каждое соединение{'\n'}ты получаешь баллы.{'\n'}<Bold>Твоя цель —</Bold> набрать как можно больше за ограниченное время!
                </p>
            </CommonModal>
            <CommonModal isOpen={isCollegueModal} isCollegue onClose={() => next(lobbyScreen)} btnText="В комнату">
                {typeof collegueMessage === 'function' ? collegueMessage() : <p>{collegueMessage}</p>}
            </CommonModal>
            <SkipModal isOpen={isSkipping} onClose={() => setIsSkipping(false)} onExit={() => next(lobbyScreen)}/>
            <EndGameModal isOpen={isEndModal?.shown} onClose={handleCloseEndModal} title={isEndModal?.title} points={score}/>
            <StartGameModal isOpen={isStartModal} onClose={() => setIsStartModal(false)} />
        </>
    )
}