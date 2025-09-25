import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { uid } from 'uid';
import { useProgress } from '../../../../contexts/ProgressContext';
import { weekInfo } from '../../../../constants/weeksInfo';
import { SCREENS } from '../../../../constants/screens';
import { useSizeRatio } from '../../../../hooks/useSizeRatio';
import { CommonModal, SkipModal } from '../../modals';
import { FlexWrapper } from '../../ContentWrapper';
import { BackHeader } from '../../BackHeader';
import { Bold, RedText } from '../../Spans';
import { Timer } from '../parts';
import { MAX_TIME } from './constants';
import { RulesModal } from './RulesModal';
import { useGame } from './useGame';
import { puzzlesM } from './puzzles';
import { FirstTimeRulesModal } from './FirstTimeRulesModal';
import { EndGameModal } from './EndGameModal';

const Wrapper = styled(FlexWrapper)`
    padding: 0;
`;

const CanvasWrapper = styled(FlexWrapper)`
    justify-content: flex-end;
    flex: 1;
    height: auto;
    min-height: unset;
    padding: 0;
`;

const InfoContainer = styled.div`
    width: 100%;
    padding: var(--spacing_x4);
    padding-bottom: 0;
`;

const Amount = styled.p`
    font-size: ${({ $ratio }) => $ratio * 24}px;
    font-weight: 400;
`;

export const PuzzleGame = ({ day, isFirstTime, startText, endText, puzzles }) => {
    const { next } = useProgress();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [dpr, setDpr] = useState(0);
    const ratio = useSizeRatio();
    const [isRulesModal, setIsRulesModal] = useState(false);
    const [isFirstMessage, setIsFirstMessage] = useState(!isFirstTime);
    const [isFirstRules, setIsFirstRules] = useState(isFirstTime);
    const [isSkipping, setIsSkipping] = useState(false);
    const [isCollegueModal, setIsCollegueModal] = useState(false);
    const $timerId = useRef(uid());
    
    const collegueMessage = useMemo(() => weekInfo.find((info) => info.week === 3).challengeCollegueMessage[day], [day]);

    const { gameContainerRef, currentScore, stopGame, endModal, setEndModal } = useGame({ width, height, dpr, initialPuzzles: puzzles, day });

    const isGameActive = useMemo(
        () => !(isRulesModal || isFirstRules || isSkipping || endModal?.shown || isFirstMessage || isCollegueModal),
        [isRulesModal, isSkipping, endModal, isFirstMessage, isCollegueModal, isFirstRules],
    );

    const handleBack = () => {
        next(SCREENS.LOBBY3);
    };

    useEffect(() => {
        const rect = gameContainerRef.current.getBoundingClientRect();

        setWidth(rect.width);
        setHeight(rect.height > 700 ? 700 : rect.height);
        setDpr(window?.devicePixelRatio || 1);
    }, []);


    const handleCloseFinish = () => {
        setIsCollegueModal(true);
        setEndModal({shown: false});
    }

    return (
        <Wrapper>
            <InfoContainer>
                <BackHeader onInfoClick={() => setIsRulesModal(true)} onBack={() => setIsSkipping(true)}>
                    <Timer
                        key={$timerId.current}
                        initialTime={MAX_TIME}
                        isStart={isGameActive}
                        onFinish={() => stopGame({isWin: false})}
                    /> 
                    <Amount $ratio={ratio}>{currentScore}</Amount>
                </BackHeader>
            </InfoContainer>
            <CanvasWrapper ref={gameContainerRef} />
            <RulesModal isOpen={isRulesModal} onClose={() => setIsRulesModal(false)} />
            <CommonModal isOpen={isFirstMessage} btnText="Играть" onClose={() => setIsFirstMessage(false)}>
                {startText?.()}
                <p>Собери картинку из кусочков пазла<Bold> за <RedText>3</RedText> минуты.</Bold></p>
            </CommonModal>
            <CommonModal isOpen={isCollegueModal} isCollegue onClose={() => next(SCREENS.LOBBY3)} btnText="В комнату">
                {typeof collegueMessage === 'function' ? collegueMessage() : <p>{collegueMessage}</p>}
            </CommonModal>
            <FirstTimeRulesModal isOpen={isFirstRules} onClose={() => setIsFirstRules(false)} />
            <SkipModal isOpen={isSkipping} onClose={() => setIsSkipping(false)} onExit={handleBack} />
            <EndGameModal
                isWin={endModal?.isWin}
                endText={endText}
                isOpen={endModal?.shown}
                points={currentScore}
                onClose={handleCloseFinish}
            />
        </Wrapper>
    );
};
