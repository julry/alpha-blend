import styled from "styled-components";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { MouseTransition, TouchTransition, DndProvider } from 'react-dnd-multi-backend';
import { FlexWrapper } from "../../ContentWrapper";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { BackHeader } from "../../BackHeader";
import { LifeContainer } from "../parts/LifesContainer";
import { PlanCard } from "./PlanCard";
import { BlenderObject } from "./BlenderObject";
import { Person } from "./Person";
import { DoneDrinkOject } from "./DoneDrinkObject";
import { AnimatePresence } from "framer-motion";

import { useGame } from "./useGame";
import { ModalsPart } from "./ModalsPart";

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

export const BlenderGame = ({ isNeverPlayed, collegueMessage, drinkInfo, lobbyScreen, levelMessages }) => {
    const ratio = useSizeRatio();
    const {
        isPaused,
        handleEndTimer,
        handleDropDrink,
        handleBlenderStop,
        handleClickBlenderCard,
        handleResetBlender,
        handleClickCard,
        points,
        shownFriends,
        blenderCards,
        shownCards,
        modalFuncs,
        modalsState,
        lives,
        doneDrinks,
        passedLevel,
        handleBack,
    } = useGame({isNeverPlayed, lobbyScreen});


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


    return (
        <>
            <Wrapper>
                <BackHeader onBack={() => modalFuncs.setIsSkipping(true)} onInfoClick={() => modalFuncs.setIsRules(true)}>
                    <Amount $ratio={ratio}>{points}</Amount>
                </BackHeader>
                <LifeContainer lives={lives}/>
                <Table $ratio={ratio}/>
                <BlenderShadow $ratio={ratio}/>
            
                <DndProvider options={HTML5toTouch}>
                    <BlenderObject 
                        // canDrop={shownFriends.some(({position}) => position === 'left')}
                        isStopped={isPaused} 
                        onCardClick={handleClickBlenderCard} 
                        cards={blenderCards} 
                        onBlenderStop={handleBlenderStop}
                        resetBlender={handleResetBlender}
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
                                isStopped={isPaused}
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
            <ModalsPart 
                modalsFunc={modalFuncs}
                modalsState={modalsState} 
                onGoLobby={handleBack}
                passedLevel={passedLevel}
                drinkInfo={drinkInfo} 
                collegueMessage={collegueMessage} 
                levelMessages={levelMessages}
            />
        </>

    )
}