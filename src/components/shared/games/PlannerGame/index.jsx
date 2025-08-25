import styled from "styled-components";
import { SCREENS } from "../../../../constants/screens";
import { useProgress } from "../../../../contexts/ProgressContext";
import { FlexWrapper } from "../../ContentWrapper";
import { useEffect, useState } from "react";
import { TimeBlock } from "./TimeBlock";
import { RulesModal } from "./RulesModal";
import { PlanCard } from "./PlanCard";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { CommonModal } from "../../modals/CommonModal";
import { FindingModal } from "../../modals";
import { BackHeader } from "../../BackHeader";
import { SkipModal } from "../../modals/SkipModal";
import { findings } from "../../../../constants/findings";
import { weekInfo } from "../../../../constants/weeksInfo";

const Wrapper = styled(FlexWrapper)`
    width: 100%;
    height: 100%;
`

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
  padding: var(--spacing_x3) 0;
`;

const MAX_AMOUNT = 9;

export const PlannerGame = ({ isNeverPlayed, cards, week, day, lobbyScreen, onCloseRules }) => {
    const { next, endGame } = useProgress();
    const ratio = useSizeRatio();
    const [isRules, setIsRules] = useState(isNeverPlayed);
    const [isSkipping, setIsSkipping] = useState(false);
    const [dayCards, setDayCards] = useState([]);
    const [morningCards, setMorningCards] = useState([]);
    const [eveningCards, setEveningCards] = useState([]);
    const [shownCards, setShownCards] = useState(cards);
    const [isCollegue, setIsCollegue] = useState(false);
    const [isFinding, setIsFinding] = useState(false);
    const [isFinishModal, setIsFinishModal] = useState(false);
    const [pickedCard, setPickedCard] = useState();
    const [finishPoints, setFinishPoints] = useState(0);

    const weekData = weekInfo.find((info) => info.week === week);
    const collegueMessage = weekData.plannersCollegueMessage[day];
    const findingId = findings.find((finding) => finding.day === day && finding.week === week).id;
    const finishMessage = weekData.plannersEndMessage[day];
       

    const commonAmount = morningCards.length + dayCards.length + eveningCards.length;

    useEffect(() => {
        if (commonAmount === MAX_AMOUNT) {
            setIsCollegue(true);
            endGame({finishPoints, gameName: 'planners', week, day});
        }
    }, [commonAmount]);

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

        setFinishPoints(prev => prev + pickedCard.points);
        setShownCards(prev => prev.filter(({ id }) => id !== pickedCard.id));
        setPickedCard();
    };

    const handleShowFinding = () => {
        setIsCollegue(false);
        setIsFinding(true);
    };
    const handleShowFinish = () => {
        setIsFinding(false);
        setIsFinishModal(true);
    };

    const handleCloseRules = () => {
        onCloseRules?.();
        setIsRules(false);
    };

    return (
        <>
            <Wrapper>
                <BackHeader onBack={() => setIsSkipping(true)} onInfoClick={() => setIsRules(true)}>
                    <Amount $ratio={ratio}>{commonAmount}/{MAX_AMOUNT}</Amount>
                </BackHeader>
                <TimeBlock title="утро" color="green" cards={morningCards} onClick={() => handleFieldPick('morning')} />
                <TimeBlock title="день" color="red" cards={dayCards} onClick={() => handleFieldPick('day')} />
                <TimeBlock title="вечер" color="purple" cards={eveningCards} onClick={() => handleFieldPick('evening')} />
                <CardsContainer>
                    {shownCards.map((card) => (
                        <PlanCard key={card.id} card={card} onClick={() => setPickedCard(prev => prev?.id === card.id ? undefined : card)} isPicked={pickedCard?.id === card.id}/>
                    ))}
                </CardsContainer>
            </Wrapper>
            <CommonModal isOpen={isCollegue} isCollegue btnText="Получить лайфхак" onClose={handleShowFinding}>
                <p>
                    {collegueMessage}
                </p>
            </CommonModal>
            <FindingModal isOpen={isFinding} onClose={handleShowFinish} id={findingId} isNew />
            <CommonModal isOpen={isFinishModal} btnText="В комнату" onClose={() => next(lobbyScreen)}>
                <p>{finishMessage}</p>
            </CommonModal>
            <RulesModal isOpen={isRules} onClose={handleCloseRules} />
            <SkipModal isOpen={isSkipping} onClose={() => setIsSkipping(false)} onExit={() => next(lobbyScreen)} />
        </>

    )
}