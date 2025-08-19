import styled from "styled-components";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { MouseTransition, TouchTransition, DndProvider } from 'react-dnd-multi-backend';
import { SCREENS } from "../../../../constants/screens";
import { useProgress } from "../../../../contexts/ProgressContext";
import { FlexWrapper } from "../../ContentWrapper";
import { useEffect, useRef, useState } from "react";
import { RulesModal } from "./RulesModal";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { CommonModal } from "../../modals/CommonModal";
import { FindingModal } from "../../modals";
import { BackHeader } from "../../BackHeader";
import { LifeContainer } from "../parts/LifesContainer";
import { ingridients } from "../../../../constants/ingridients";
import { PlanCard } from "./PlanCard";
import { BlenderObject } from "./BlenderObject";
import { Person } from "./Person";
import { LEVEL_TO_PEOPLE_AMOUNT, LEVEL_TO_PROBABILITY } from "./constants";
import { getPersonsArray } from "./utils";
import { DoneDrinkOject } from "./DoneDrinkObject";
import { AnimatePresence } from "framer-motion";

const Wrapper = styled(FlexWrapper)`
    width: 100%;
    height: 100%;
`

const Amount = styled.p`
    font-size: ${({ $ratio }) => $ratio * 23}px;
    font-weight: 400;
`;

const CardsContainer = styled.div`
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: var(--container-width);
    display: flex;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch; /* Для плавного скролла на iOS */
    white-space: nowrap; /* Предотвращает перенос элементов */
    touch-action: pan-x;
    scroll-snap-type: x mandatory;
    margin-top: auto;
    background-color: white;
    border-radius: var(--border-radius-lg);
`;

const Table = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 7;
    width: 100%;
    height: ${({ $ratio }) => $ratio * 172}px;
    background: gray no-repeat center center / cover;
`;

const BlenderShadow = styled.div`
    position: absolute;
    z-index: 8;
    width: ${({ $ratio }) => $ratio * 128}px;
    height: ${({ $ratio }) => $ratio * 12}px;
    left: ${({ $ratio }) => $ratio * -3}px;
    bottom: ${({ $ratio }) => $ratio * 119}px;
    background: radial-gradient(50% 50% at 50% 50%, #2B2C44 0%, rgba(43, 44, 68, 0) 100%);
    filter: blur(3.25px);
`;

const CardStyled = styled(PlanCard)`
    width: ${({ $ratio }) => $ratio * 72}px;
    height: ${({ $ratio }) => $ratio * 72}px;
`;

const DoneDrinksWrapper = styled.div `
    position: absolute;
    display: flex;
    gap: var(--spacing_x1);
    left:  ${({ $ratio }) => $ratio * 120}px;
    bottom: ${({ $ratio }) => $ratio * 119}px;
    z-index: 12;
`;

const POSITIONS = ['center', 'right', 'left'];

export const BlenderGame = ({ isNeverPlayed, collegueMessage, findingId, finishMessage }) => {
    const { next } = useProgress();
    const ratio = useSizeRatio();
    const [isRules, setIsRules] = useState(isNeverPlayed);
    const [level, setLevel] = useState(1);
    const [points, setPoints] = useState(0);
    const [blenderCards, setBlenderCards] = useState([]);
    const [comingFriends, setComingFriends] = useState([]);
    const [shownFriends, setShownFriends] = useState([]);
    // const [shownCards, setShownCards] = useState();
    const [isCollegue, setIsCollegue] = useState(false);
    const [isFinding, setIsFinding] = useState(false);
    const [isFinishModal, setIsFinishModal] = useState(false);
    const [queue, setQueue] = useState(1);
    const [doneDrinks, setDoneDrinks] = useState([]);
    const [maxQueue, setMaxQueue] = useState(1);
    const correctAmount = useRef(0);
    const shownAmount = useRef(0);

    const HTML5toTouch = {
        backends: [
            {
                id: 'html5',
                backend: HTML5Backend,
                transition: MouseTransition,
            },
            {
                id: 'touch',
                backend: TouchBackend,
                preview: true,
                transition: TouchTransition,
            },
        ],
    };

    // const commonAmount = morningCards.length + dayCards.length + eveningCards.length;

    const shownCards = level > 1 ? ingridients : ingridients.filter(({isBased}) => isBased);

    const handleBack = () => {
        next(SCREENS.LOBBY);
    };

    useEffect(() => {
        const {friends, maxQueue} = getPersonsArray({isBased: level < 3, peopleAmount: LEVEL_TO_PEOPLE_AMOUNT[level], maxSize: level, ingridientsProbability: LEVEL_TO_PROBABILITY[level]});
        setMaxQueue(maxQueue);
        setComingFriends(friends);
    }, [level]);

    useEffect(() => {
        const shown = comingFriends.filter((friend) => friend.queue === queue);
        const friends = shown.map((friend, index) => ({...friend, position: POSITIONS[index]}));
        setShownFriends(friends);

        shownAmount.current = friends.length;
    }, [queue, comingFriends])


    const handleNext = () => {
        setLevel(prev => prev + 1);
        setQueue(1);
    }

    const handleChangePerson = () => {
        if (maxQueue === queue) {
            handleNext();
            return;
        }

        setQueue(prev => prev + 1);
    }

    // useEffect(() => {
    //     //TODO: сделать пойнты
    //     setIsCollegue(true)
    // }, [commonAmount]);

    const handleShowFinding = () => {
        setIsCollegue(false);
        setIsFinding(true);
    };

    const handleShowFinish = () => {
        setIsFinding(false);
        setIsFinishModal(true);
    };

    const handleClickCard = (card) => {
        if (blenderCards.length > 2) return;

        setBlenderCards(prev => [...prev, card]);
    }
    const handleClickBlenderCard = (ind) => {
        setBlenderCards(prev => prev.filter((_, index) => index !== ind));
    }

    const handleBlenderStop = (drink) => {
        setDoneDrinks(prev => [...prev, drink]);
        setBlenderCards([]);
    }

    const personLeave = (personId, tryPoints) => {
        console.log('leave');
        console.log(personId);
        console.log(tryPoints);
        setShownFriends(prev => prev.map((friend) => friend.person === personId ? ({...friend, isFinished: true, points: tryPoints}) : friend));
        setTimeout(() => {
            setShownFriends(prev => prev.filter((friend) => friend.person !== personId));
            shownAmount.current -= 1;

            if (shownAmount.current === 0) {
                handleChangePerson();
            }
        }, 1000);
    }

    const handleDropDrink = ({personDrinkId, time, doneDrink, personId}) => {
        setDoneDrinks(prev => prev.filter(drink => drink.id !== doneDrink.id));

        let tryPoints = 10;

        if (personDrinkId !== doneDrink.id) {
            correctAmount.current = 0;
            tryPoints = -5;
        } else {
            correctAmount.current += 1;

            if (correctAmount.current === 3) tryPoints += 10;
            if (correctAmount.current === 5) tryPoints += 20;

            if (time < 10) tryPoints += 10;
            if (time >= 10 && time < 20) tryPoints += 15;
            if (time >= 20) tryPoints += 20;
        }        

        personLeave(personId, tryPoints)
        setPoints(prev => (prev + tryPoints) >= 0 ? (prev + tryPoints) : 0);
    }

    const handleEndTimer = (personId) => {
        setPoints(prev => prev >= 5 ? prev - 5 : 0);
        personLeave(personId, -5);
        correctAmount.current = 0;
    }

    return (
        <>
            <Wrapper>
                <BackHeader onBack={handleBack} onInfoClick={() => setIsRules(true)}>
                    <Amount $ratio={ratio}>{points}</Amount>
                </BackHeader>
                <LifeContainer />
                <Table $ratio={ratio}/>
                <BlenderShadow $ratio={ratio}/>
            
                <DndProvider options={HTML5toTouch}>
                    <BlenderObject 
                        // canDrop={shownFriends.some(({position}) => position === 'left')}
                        isStopped={isRules} 
                        onCardClick={handleClickBlenderCard} 
                        cards={blenderCards} 
                        onBlenderStop={handleBlenderStop}
                    />
                    <AnimatePresence>
                        {shownFriends.map((friend) => (
                            <Person 
                                key={`person_${friend.personId}_${friend.drink}`}
                                ingridients={friend.ingridients} 
                                personId={friend.person} 
                                drink={friend.drink} 
                                position={friend.position}
                                onGetDrink={handleDropDrink}
                                onEndTimer={handleEndTimer}
                                isStopped={isRules}
                                isFinished={friend.isFinished}
                                points={friend.points}
                            />
                        ))}
                    </AnimatePresence>
                    <DoneDrinksWrapper $ratio={ratio}>
                        {doneDrinks.map((drink) => (
                            <DoneDrinkOject drink={drink}/>
                        ))}
                    </DoneDrinksWrapper>
                </DndProvider>
                
                <CardsContainer>
                    {shownCards.map((card) => (
                        <CardStyled key={card.id} $ratio={ratio} card={card} onClick={() => handleClickCard(card)}/>
                    ))}
                </CardsContainer>
            </Wrapper>
            <CommonModal isOpen={isCollegue} isCollegue btnText="Получить лайфхак" onClose={handleShowFinding}>
                <p>
                    {collegueMessage}
                </p>
            </CommonModal>
            <FindingModal isOpen={isFinding} onClose={handleShowFinish} id={findingId} isNew />
            <CommonModal isOpen={isFinishModal} btnText="В комнату" onClose={() => next(SCREENS.LOBBY)}>
                <p>{finishMessage}</p>
            </CommonModal>
            <RulesModal isOpen={isRules} onClose={() => setIsRules(false)} />
        </>

    )
}