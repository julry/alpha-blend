import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { uid } from 'uid';
import { useProgress } from '../../../../contexts/ProgressContext';
import { weekInfo } from '../../../../constants/weeksInfo';
import { SCREENS } from '../../../../constants/screens';
import { useSizeRatio } from '../../../../hooks/useSizeRatio';
//TODO: перенести эксопрт в индекс -> пройтись по модалкам поправить инпуты
import { CommonModal } from '../../modals/CommonModal';
import { SkipModal } from '../../modals/SkipModal';
import { StartGameModal } from '../../modals/StartGameModal';
import { FlexWrapper } from '../../ContentWrapper';
import { BackHeader } from '../../BackHeader';
import { Bold, RedText } from '../../Spans';
import { Timer, LifeContainer } from '../parts';
import { MAX_TIME } from './constants';
import { RulesModal } from './RulesModal';
import { EndGameModal } from './EndGameModal';
import { useGame } from './useGame';

const Wrapper = styled(FlexWrapper)`
    padding: 0;
`;

const CanvasWrapper = styled(FlexWrapper)`
    justify-content: flex-end;
    padding: 0;
`;

const InfoContainer = styled.div`
    position: absolute;
    z-index: 4;
    top: 0;
    left: 0;
    width: 100%;
    padding: var(--spacing_x4);
    padding-bottom: 0;

    & > div:first-child {
      margin-bottom: var(--spacing_x5);
    }
`;

const Amount = styled.p`
    font-size: ${({ $ratio }) => $ratio * 24}px;
    font-weight: 400;
`;

export const BasketballGame = ({ isNeverPlayed, day }) => {
    const { next, endGame,} = useProgress();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [dpr, setDpr] = useState(0);
    const ratio = useSizeRatio();
    const [isRulesModal, setIsRulesModal] = useState();
    const [isFirstMessage, setIsFirstMessage] = useState(isNeverPlayed);
    const [isSkipping, setIsSkipping] = useState(false);
    const [isEndModal, setIsEndModal] = useState({ shown: false, title: '' });
    const [isCollegueModal, setIsCollegueModal] = useState(false);
    const [isStartModal, setIsStartModal] = useState(!isNeverPlayed);
    const $timerId = useRef(uid());
    const isGameActive = useMemo(
        () => !(isRulesModal || isSkipping || isEndModal?.shown || isFirstMessage || isCollegueModal || isStartModal),
        [isRulesModal, isSkipping, isEndModal, isFirstMessage, isCollegueModal, isStartModal],
    );
    const collegueMessage = useMemo(() => weekInfo.find((info) => info.week === 2).challengeCollegueMessage[day], [day]);

    const { gameContainerRef, currentScore, setCurrentScore } = useGame({ width, height, dpr, });

    const handleBack = () => {
        next(SCREENS.LOBBY2);
    };

    useEffect(() => {
        const rect = gameContainerRef.current.getBoundingClientRect();

        setWidth(rect.width);
        setHeight(rect.height > 700 ? 700 : rect.height);
        setDpr(window?.devicePixelRatio || 1);
    }, []);

    const restartGame = () => {
        $timerId.current = uid();
        setIsEndModal();
        setCurrentScore(0);
    }

    const finishGame = (isTime) => {
        endGame({ finishPoints: currentScore, gameName: 'gameBasket', week: 2, day });
       
        setIsEndModal({ shown: true, isTime });
    }

    const handleCloseEndModal = () => {
        setIsEndModal({ shown: false });
        setIsCollegueModal(true);
    }

    return (
        <Wrapper>
            <InfoContainer>
                <BackHeader onInfoClick={() => setIsRulesModal(true)} onBack={() => setIsSkipping(true)}>
                    <Timer
                        key={$timerId.current}
                        initialTime={MAX_TIME}
                        isStart={isGameActive}
                        onFinish={() => finishGame(true)}
                    />
                    <Amount $ratio={ratio}>{currentScore}</Amount>
                </BackHeader>
            </InfoContainer>
            <CanvasWrapper ref={gameContainerRef} />
            <RulesModal isOpen={isRulesModal} onClose={() => setIsRulesModal(false)} />
            <CommonModal isOpen={isFirstMessage} btnText="Играть" onClose={() => setIsFirstMessage(false)}>
                <p>
                    <Bold>Готов проверить меткость?
                    </Bold>
                </p>
                <p>
                    Зажми мяч и проведи пальцем вверх, чтобы совершить бросок. Точное попадание в кольцо даёт <Bold><RedText>10</RedText> баллов.</Bold>
                </p>
                <p><Bold>Промах — минус жизнь.</Bold> У тебя их <Bold>всего <RedText>3</RedText>.</Bold> Успей набрать максимум баллов <Bold>за <RedText>1</RedText> минуту!</Bold></p>
            </CommonModal>
            <CommonModal isOpen={isCollegueModal} isCollegue onClose={() => next(SCREENS.LOBBY2)} btnText="В комнату">
                {typeof collegueMessage === 'function' ? collegueMessage() : <p>{collegueMessage}</p>}
            </CommonModal>
            <SkipModal isOpen={isSkipping} onClose={() => setIsSkipping(false)} onExit={handleBack} />
            <EndGameModal
                isOpen={isEndModal?.shown}
                onClose={handleCloseEndModal}
                isTime={isEndModal?.isTime}
                points={currentScore}
                onRestart={restartGame}
            />
            <StartGameModal isOpen={isStartModal} onClose={() => setIsStartModal(false)} />
        </Wrapper>
    );
};
