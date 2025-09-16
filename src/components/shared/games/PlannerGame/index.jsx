import { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useProgress } from "../../../../contexts/ProgressContext";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { findings } from "../../../../constants/findings";
import { weekInfo } from "../../../../constants/weeksInfo";
import { FlexWrapper } from "../../ContentWrapper";
import { CommonModal, SkipModal } from "../../modals";
import { FindingModal } from "../../modals";
import { BackHeader } from "../../BackHeader";
import { Button } from "../../Button";
import { EndGameModal } from "./EndGameModal";
import { TimeBlock } from "./TimeBlock";
import { RulesModal } from "./RulesModal";
import { PlanCard } from "./PlanCard";
import { DAYS } from "../../../../constants/days";
import { reachMetrikaGoal } from "../../../../utils/reachMetrikaGoal";

const Wrapper = styled(FlexWrapper)`
    width: 100%;
    height: 100%;
    padding-left: 0;
    padding-right: 0;
`;

const Amount = styled.p`
    font-size: ${({ $ratio }) => $ratio * 23}px;
    font-weight: 400;
`;

const CardsContainer = styled.div`
    width: 100%;
    display: flex;
    gap: var(--spacing_x1);
    overflow-y: visible;
    height: fit-content;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch; /* Для плавного скролла на iOS */
    white-space: nowrap; /* Предотвращает перенос элементов */
    touch-action: pan-x;
    scroll-snap-type: x mandatory;
    padding: var(--spacing_x3) var(--spacing_x2);
    margin-top: auto;
`;

const BlocksWrapper = styled.div`
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 var(--spacing_x4);
    max-height: 500px;
`;

const HeaderStyled = styled(BackHeader)`
    padding: 0 var(--spacing_x4);
`;

const ButtonWrapper = styled(motion.div)`
    position: absolute;
    bottom: var(--spacing_x6);
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
`;

const MAX_AMOUNT = 9;

export const PlannerGame = ({ isNeverPlayed, cards, week, day, lobbyScreen, onCloseRules }) => {
    const { user, next, endGame } = useProgress();
    const ratio = useSizeRatio();
 
    const [dayCards, setDayCards] = useState([]);
    const [morningCards, setMorningCards] = useState([]);
    const [eveningCards, setEveningCards] = useState([]);
    const [shownCards, setShownCards] = useState(cards);
    const [pickedCard, setPickedCard] = useState();

    const [isRules, setIsRules] = useState(isNeverPlayed);
    const [isSkipping, setIsSkipping] = useState(false);
    const [isCollegue, setIsCollegue] = useState(false);
    const [isFinding, setIsFinding] = useState(false);
    const [endModal, setEndModal] = useState({shown: false});

    const weekData = weekInfo.find((info) => info.week === week);
    const collegueMessage = weekData.plannersCollegueMessage[day];

    const findingId = findings.find((finding) => finding.day === day && finding.week === week).id;

    const commonAmount = morningCards.length + dayCards.length + eveningCards.length;

    const handleFieldPick = (time) => {
        if (!pickedCard) return;

        if (time === 'morning') {
            if (morningCards.length > 2) return;
            setMorningCards(prev => [...prev, pickedCard]);
        };
        if (time === 'day') {
            if (dayCards.length > 2) return;
            setDayCards(prev => [...prev, pickedCard]);
        }
        if (time === 'evening'){
            if (eveningCards.length > 2) return;
            setEveningCards(prev => [...prev, pickedCard]);
        };

        setShownCards(prev => prev.filter(({ id }) => id !== pickedCard.id));
        setPickedCard();
    };

    const handleShowFinding = () => {
        setIsCollegue(false);
        setIsFinding(true);
    };

    const handleCloseRules = () => {
        onCloseRules?.();
        setIsRules(false);
    };

    const handleFinish = () => {
        let isWin = false;
        if (!shownCards.find((card) => card.isSpecial)) {
            isWin = true;
            if (day === DAYS.Friday) {
                reachMetrikaGoal(`finish planner week${week}`);
            }
            endGame({finishPoints: 10, gameName: `planner${week}`, week, day, addictiveData: {
                findings: [...user.findings, findingId],
            }});
        }

        setEndModal({shown: true, isWin});
    };

    const handleClickEnd = () => {
        if (endModal.isWin) {
            setIsCollegue(true);
        } else {
            setShownCards(cards);
            setMorningCards([]);
            setEveningCards([]);
            setDayCards([]);
        }

        setEndModal({shown: false});
    };

    return (
        <>
            <Wrapper>
                <HeaderStyled onBack={() => setIsSkipping(true)} onInfoClick={() => setIsRules(true)}>
                    <Amount $ratio={ratio}>{commonAmount}/{MAX_AMOUNT}</Amount>
                </HeaderStyled>
                <BlocksWrapper>
                    <TimeBlock title="утро" type="morning" cards={morningCards} onClick={() => handleFieldPick('morning')} />
                    <TimeBlock title="день" type="day" cards={dayCards} onClick={() => handleFieldPick('day')} />
                    <TimeBlock title="вечер" type="evening" cards={eveningCards} onClick={() => handleFieldPick('evening')} />
                </BlocksWrapper>
                
                <CardsContainer>
                    {shownCards.map((card) => (
                        <PlanCard key={card.id} card={card} onClick={() => setPickedCard(prev => prev?.id === card.id ? undefined : card)} isPicked={pickedCard?.id === card.id}/>
                    ))}
                </CardsContainer>
                <AnimatePresence>
                    {commonAmount === MAX_AMOUNT && (
                        <ButtonWrapper initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                            <Button onClick={handleFinish}>
                                Запланировать
                            </Button>
                        </ButtonWrapper>
                    )}
                </AnimatePresence>
            </Wrapper>
            <CommonModal isOpen={isCollegue} isCollegue btnText="Получить лайфхак" onClose={handleShowFinding}>
                {typeof collegueMessage  === 'function' ? collegueMessage() : <p>collegueMessage</p>}
            </CommonModal>

            <FindingModal isOpen={isFinding} onClose={() => next(lobbyScreen)} id={findingId} isNew buttonText={"В комнату"}/>
            <RulesModal isOpen={isRules} onClose={handleCloseRules} />
            <SkipModal isOpen={isSkipping} onClose={() => setIsSkipping(false)} onExit={() => next(lobbyScreen)} />
            <EndGameModal isOpen={endModal.shown} isWin={endModal.isWin} onClick={handleClickEnd} />
        </>

    )
}