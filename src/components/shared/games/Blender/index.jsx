import styled from "styled-components";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import bgBlender from '../../../../assets/images/blenderBg.png';
import table from '../../../../assets/images/table.png';
import { MouseTransition, TouchTransition, DndProvider } from 'react-dnd-multi-backend';
import { FlexWrapper } from "../../ContentWrapper";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { BackHeader } from "../../BackHeader";
import { LifeContainer } from "../parts/LifesContainer";
import { BlenderObject } from "./BlenderObject";
import { Person } from "./Person";
import { DoneDrinkOject } from "./DoneDrinkObject";
import { AnimatePresence } from "framer-motion";

import { useGame } from "./useGame";
import { ModalsPart } from "./ModalsPart";
import { CardsField } from "./CardsField";
import { MIN_MOCKUP_WIDTH } from "../../../ScreenTemplate";
import { LEVEL_TO_PEOPLE_AMOUNT, QUEUE_TO_PERSON_TIME_WEEK } from "./constants";

const Wrapper = styled(FlexWrapper)`
    width: 100%;
    height: 100%;
    background: url(${bgBlender}) no-repeat 0 100% /cover;

    @media screen and (min-width: 350px) and (max-width: ${MIN_MOCKUP_WIDTH}px){
        background-position-y: 78%;
    }
`

const Amount = styled.p`
    font-size: ${({ $ratio }) => $ratio * 23}px;
    font-weight: 400;
    color: white;
`;

const Table = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 7;
    width: 100%;
    height: ${({ $ratio }) => $ratio * 172}px;
    background: url(${table}) no-repeat center center / cover;
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

const DoneDrinksWrapper = styled.div `
    position: absolute;
    display: flex;
    align-items: flex-end;
    gap: var(--spacing_x1);
    left:  ${({ $ratio }) => $ratio * 120}px;
    bottom: ${({ $ratio }) => $ratio * 119}px;
    z-index: 12;
`;

export const BlenderGame = ({ isNeverPlayed, week, collegueMessage, drinkInfo, lobbyScreen, gameName, day, isDelayed=true }) => {
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
        handleBack,
        blenderDrop,
        setBlenderDrop,
        peopleAmount,
        handleBlenderStart
    } = useGame({isNeverPlayed, lobbyScreen, gameName, week, isDelayed, day, drinkInfo});

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
                    <Amount $ratio={ratio}>{peopleAmount}/{LEVEL_TO_PEOPLE_AMOUNT[week]}</Amount>
                    <Amount $ratio={ratio}>{points}</Amount>
                </BackHeader>
                <LifeContainer lives={lives}/>
                <Table $ratio={ratio}/>
                <BlenderShadow $ratio={ratio}/>
                <DndProvider options={HTML5toTouch}>
                    <BlenderObject
                        isStopped={isPaused} 
                        onCardClick={handleClickBlenderCard} 
                        cards={blenderCards} 
                        onBlenderStop={handleBlenderStop}
                        onBlenderClick={handleBlenderStart}
                        resetBlender={handleResetBlender}
                        onDrop={setBlenderDrop}
                    />
                    <AnimatePresence>
                        {shownFriends.map((friend) => (
                            <Person 
                                key={`person_${friend.id}_${friend.drink}`}
                                ingridients={friend.ingridients} 
                                queueAmount={friend.queueAmount}
                                personId={friend.person} 
                                friendId={friend.id} 
                                drink={friend.drink}
                                position={friend.position}
                                onGetDrink={handleDropDrink}
                                onEndTimer={handleEndTimer}
                                isStopped={isPaused}
                                isFinished={friend.isFinished}
                                points={friend.points}
                                blenderDrop={blenderDrop}
                                setBlenderDrop={setBlenderDrop}
                                queuePersonTime={QUEUE_TO_PERSON_TIME_WEEK[week]}
                            />
                        ))}
                    </AnimatePresence>
                    <DoneDrinksWrapper $ratio={ratio}>
                        {doneDrinks.map((drink, index) => (
                            <DoneDrinkOject key={`${drink.id}_${index}`} drink={drink} doneDrinkIndex={index}/>
                        ))}
                    </DoneDrinksWrapper>
                </DndProvider>
                
                <CardsField shownCards={shownCards} onCardClick={handleClickCard} />
            </Wrapper>

            <ModalsPart 
                modalsFunc={modalFuncs}
                modalsState={modalsState} 
                onGoLobby={handleBack}
                drinkInfo={drinkInfo} 
                collegueMessage={collegueMessage} 
            />
        </>

    )
}