import { useRef, useState } from "react"
import { CommonModal } from "../../modals/CommonModal";
import styled from "styled-components";
import { persons } from "./constants";
import { Info } from "./Info";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { CardsField } from "./CardsField";
import { BlenderObject } from "./BlenderObject";
import { Modal } from "../../modals/Modal";
import { Block } from "../../Block";
import { DndProvider } from "react-dnd-multi-backend";
import { Bold } from "../../Spans";
import { motion } from "framer-motion";
import { DoneDrinkOject } from "./DoneDrinkObject";
import { drinks } from "../../../../constants/drinks";
import { Person } from "./Person";

const ThirdPartModal = styled(CommonModal)`
    & > div {
        top: auto;
        bottom: calc(3 * var(--spacing_x6));
    }
`;

const BlockStyled = styled(Block)`
    position: absolute;
    left: 50%;
    top: var(--spacing_x6);
    transform: translate(-50%, 0);
    z-index: 30;
`;


const InfoStyled = styled(Info)`
    z-index: 1004;
    bottom: calc(${({ $bottom }) => $bottom}px + var(--spacing_x3));

    & > div:last-child {
        background-color: #30E301;
    }
`;

const CardsFieldStyled = styled(CardsField)`
    & {
        position: absolute;
        overflow: hidden;
        bottom: var(--spacing_x6);
        z-index: 4; 
        left: 50%;
        transform: translateX(-50%);

        ${({$inactive}) => $inactive && (
            `&::after {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: var(--border-radius_xl);
                width: 100%;
                min-width: 100%;
                height: 100%;
                min-height: 100%;
                background-color: rgba(0,0,0, 0.25);
            }`
        )}
    }
`;

const BlenderObjectStyled = styled(BlenderObject)`
    z-index: 5 !important;
`;

const BlenderButtonWrapper = styled(motion.div)`
    border-radius: 50%;
    position: absolute;
    /* z-index: 1006; */
    left: 36%;
    bottom: 7%;
    transform: translateX(-40%);
    height: var(--spacing_x8);
    width: var(--spacing_x8);
    box-shadow: 0 0 5px 10000px rgba(0,0,0,0.25);
`;

const DoneDrinkOjectStyled = styled(DoneDrinkOject)`
    position: absolute;
    z-index: 5;
    bottom: ${({$ratio}) => $ratio * 125}px;
    left: ${({$ratio}) => $ratio * 125}px;
`;

const PersonWrapper = styled.div`
    position: absolute;
    overflow: hidden;
    height: ${({$ratio}) => $ratio * 195}px;
    bottom: ${({$ratio}) => $ratio * 172}px;
    width: 100%;
    z-index: 2;
    & > div {
        bottom: auto;
        top: 0;
    }
`;

export const FirstRulesModal = ({ isOpen, modalsFuncs, modalsState }) => {
    const ratio = useSizeRatio();
    const [part, setPart] = useState(0);
    const [cards, setCards] = useState([]);
    const [pickedCards, setPickedCards] = useState([]);
    const [activeCard, setActiveCard] = useState('mint');
    const [shownCards, setShownCards] = useState(modalsState?.shownCards);
    const [isReady, setIsReady] = useState(false);
    const [isButtonPart, setIsButtonPart] = useState(false);
    const personRef = useRef();

    const handleBegin = () => {
        setPart(prev => prev + 1);
        const res = modalsFuncs.getFriends();
        const person = persons.find(pers => pers.id === res.person);
        personRef.current = person;

        setCards({ ingridients: res.ingridients, bottom: person?.bottom + person?.height })

        setTimeout(() => {
            setPart(prev => prev + 1);
        }, 500);
    }

    const handleStartTraining = () => {
        setPart(prev => prev + 1);
    }

    const handleStartGame = () => {
        // modalsFuncs.setIsFirstRules(false);
        // modalsFuncs.handleRestart();
    }

    const handlePickIngridient = (card) => {
        if (card.id !== activeCard) return;

        setActiveCard('orange');
        if (pickedCards.length === 2) {
            return;
        }
        setPickedCards(prev => [...prev, card]);
        setShownCards(prev => prev.filter((c) => c.id !== card.id));

        if (pickedCards.length === 1) {
            setIsButtonPart(true);
        }
    }

    const handleBlenderClick = () => {
        setIsButtonPart(false);
    }

    const hanleBlenderStop = () => {
        setIsReady(true);
        setPickedCards([]);
    };

    const handleFinish = () => {
        setIsReady(false);
        modalsFuncs.handleFinishTraining();
        setPart(prev => prev + 1);
    };

    return (
        <>
            <CommonModal isDarken isOpen={isOpen && part === 0} btnText="Далее" onClose={handleBegin}>
                <p><Bold>У тебя классно получается</Bold> совмещать работу и личную жизнь.</p>
                <p>
                    <Bold>К тебе в гости пришли друзья —</Bold> взбодри их полезными напитками и помоги найти свой баланс.
                </p>
            </CommonModal>
            <ThirdPartModal isDarken isOpen={isOpen && part === 2} btnText="Далее" onClose={handleStartTraining}>
                <p>
                    <Bold>К каждому нужен индивидуальный подход —</Bold> друзья сами покажут, какой именно напиток им нужен.
                </p>
            </ThirdPartModal>
            {
                isOpen && part === 2 && (
                    <InfoStyled $bottom={cards.bottom * ratio} ingridients={cards.ingridients} />
                )
            }
            <Modal isDarken isOpen={isOpen && part === 3 && !modalsState.isFinishTraining}>
                {
                    activeCard === 'mint' && (
                         <BlockStyled>
                            <p>
                                <Bold>Выбирай правильные ингредиенты,</Bold> загружай их в блендер, нажимай на кнопку и подавай готовый напиток. <Bold>Попробуешь?</Bold>
                            </p>
                        </BlockStyled>
                    )
                }
                {
                    isReady && (
                         <BlockStyled>
                            <p>
                                 
                                <Bold>Отлично, напиток готов.</Bold> Теперь перетащи напиток нужному другу!
                            </p>
                        </BlockStyled>
                    )
                }
                    <CardsFieldStyled shownCards={shownCards} onCardClick={handlePickIngridient} activeCard={activeCard} $inactive={isReady}/>
                    <DndProvider options={{ backends: [] }}>
                        {isReady && (
                            <>
                                <PersonWrapper $ratio={ratio}>
                                    <Person 
                                        personId={'girl0'} 
                                        hideInfo 
                                        drink={drinks[0].id}
                                        onGetDrink={handleFinish}
                                        ingridients={['mint', 'orange']}
                                        />
                                </PersonWrapper>
                                <DoneDrinkOjectStyled $ratio={ratio} drink={drinks[0]}/>
                            </>
                        )}
                        <BlenderObjectStyled
                            cards={pickedCards}
                            onBlenderClick={handleBlenderClick}
                            onBlenderStop={hanleBlenderStop}
                            buttonChildren={() => (
                                isButtonPart ? <BlenderButtonWrapper
                                    $ratio={ratio}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                /> : null
                            )}
                        />
                    </DndProvider>
                    
            </Modal>

            <CommonModal isDarken isOpen={part === 4} btnText="Начать" onClose={handleStartGame}>
                <p><Bold>Ты быстро учишься, так держать!</Bold></p>
                <p>
                    Будь внимателен и не теряй время — чем больше напитков подашь, тем больше получишь баллов!
                </p>
                <p><Bold>Удачи!</Bold></p>
            </CommonModal>
        </>

    )
}