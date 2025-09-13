import { useRef, useState } from "react";
import styled from "styled-components";
import { DndProvider } from "react-dnd-multi-backend";
import { motion } from "framer-motion";
import { drinks } from "../../../../constants/drinks";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { Modal, CommonModal } from "../../modals";
import { Block } from "../../Block";
import { Bold, RedText } from "../../Spans";
import { persons } from "./constants";
import { Info } from "./Info";
import { CardsField } from "./CardsField";
import { BlenderObject } from "./BlenderObject";
import { DoneDrinkOject } from "./DoneDrinkObject";
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
    }
`;

const BlenderObjectStyled = styled(BlenderObject)`
    z-index: 5 !important;
`;

const BlenderButtonWrapper = styled(motion.div)`
    border-radius: 50%;
    position: absolute;
    left: 37%;
    bottom: 9.5%;
    transform: translateX(-40%);
    height: var(--spacing_x6);
    width: var(--spacing_x6);
    box-shadow: 0 0 25px 5px var(--color-red);
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

const CardStyled = styled.div`
    position: absolute;
    inset: 0;
    width: ${({ $ratio }) => $ratio * 72}px;
    height: ${({ $ratio }) => $ratio * 72}px;
    display: flex;
    justify-content: center;
    align-items: center;
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
        const res = modalsFuncs.getEducationFriend();
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
        modalsFuncs.handleStartGame();
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
            <Modal isDarken={isReady} isOpen={isOpen && part === 3 && !modalsState.isFinishTraining}>
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
                    <CardsFieldStyled shownCards={shownCards} onCardClick={handlePickIngridient} activeCardType2={activeCard} $inactive={isReady}>
                        {activeCard === 'mint' && (
                            <CardStyled $ratio={ratio}>
                                <svg width="95%" height="95%" viewBox="0 0 77 77" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_d_1490_10107)">
                                    <path d="M22.5 15C18.5 17 19.8335 23.261 21.0002 26.4276L19.5 27.9276L21.5 29.9276C15.9 30.7276 14.1667 34.5943 14 36.4276C15.6 39.2276 19.0001 40.261 20.5002 40.4276C18.5002 44.0276 21.0002 47.261 22.5002 48.4276C21.0002 51.9276 19.5 58.5 22.5002 59.9276C25.9268 61.5581 32 59 35 56C34 59 35.0002 61.9276 37.0002 62.9276C38.6002 63.7276 40.6668 61.9276 41.5002 60.9276C42.3002 60.9276 43.1668 60.261 43.5002 59.9276C43.1002 57.5276 45.0002 55.9276 46.0002 55.4276C48.0002 60.9276 60.0002 64.9276 61.5002 61.9276C62.7002 59.5276 61.3335 55.5943 60.5002 53.9276C61.3002 52.7276 59 49.6667 58 48C60.9998 46.0724 64.8002 39.2276 62.0002 36.4276C59.2002 33.6276 53.5002 36.5943 51.0002 38.4276C49.8002 32.4276 43.8333 33.1667 41 34C44.1667 29.6667 48.9998 21.0725 46 18.5C42.8738 15.8192 36.8335 19.0943 34.5002 20.9276C32.1668 17.9276 26.5 13 22.5 15Z" fill="#D9D9D9" fillOpacity="0.01" shapeRendering="crispEdges"/>
                                    <path d="M22.5 15C18.5 17 19.8335 23.261 21.0002 26.4276L19.5 27.9276L21.5 29.9276C15.9 30.7276 14.1667 34.5943 14 36.4276C15.6 39.2276 19.0001 40.261 20.5002 40.4276C18.5002 44.0276 21.0002 47.261 22.5002 48.4276C21.0002 51.9276 19.5 58.5 22.5002 59.9276C25.9268 61.5581 32 59 35 56C34 59 35.0002 61.9276 37.0002 62.9276C38.6002 63.7276 40.6668 61.9276 41.5002 60.9276C42.3002 60.9276 43.1668 60.261 43.5002 59.9276C43.1002 57.5276 45.0002 55.9276 46.0002 55.4276C48.0002 60.9276 60.0002 64.9276 61.5002 61.9276C62.7002 59.5276 61.3335 55.5943 60.5002 53.9276C61.3002 52.7276 59 49.6667 58 48C60.9998 46.0724 64.8002 39.2276 62.0002 36.4276C59.2002 33.6276 53.5002 36.5943 51.0002 38.4276C49.8002 32.4276 43.8333 33.1667 41 34C44.1667 29.6667 48.9998 21.0725 46 18.5C42.8738 15.8192 36.8335 19.0943 34.5002 20.9276C32.1668 17.9276 26.5 13 22.5 15Z" stroke="#EF3124" shapeRendering="crispEdges"/>
                                    </g>
                                    <defs>
                                    <filter id="filter0_d_1490_10107" x="0.387793" y="0.93503" width="76.1907" height="75.7925" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset/>
                                    <feGaussianBlur stdDeviation="6.55"/>
                                    <feComposite in2="hardAlpha" operator="out"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.929412 0 0 0 0 0.192157 0 0 0 0 0.145098 0 0 0 1 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1490_10107"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1490_10107" result="shape"/>
                                    </filter>
                                    </defs>
                                </svg>
                            </CardStyled>
                        )}
                        {activeCard === 'orange' && (
                            <CardStyled $ratio={ratio}>
                                <svg width="82%" height="82%" viewBox="0 0 73 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_d_1490_10110)">
                                    <path d="M22.0857 15.1655C33.0857 8.66543 65.5857 30.6654 57.5857 48.6655C35.0003 72 -3 41.5 22.0857 15.1655Z" fill="#D9D9D9" fillOpacity="0.01" shapeRendering="crispEdges"/>
                                    <path d="M22.0857 15.1655C33.0857 8.66543 65.5857 30.6654 57.5857 48.6655C35.0003 72 -3 41.5 22.0857 15.1655Z" stroke="#EF3124" shapeRendering="crispEdges"/>
                                    </g>
                                    <defs>
                                    <filter id="filter0_d_1490_10110" x="0.232519" y="0.399988" width="72.2063" height="70.1787" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset/>
                                    <feGaussianBlur stdDeviation="6.55"/>
                                    <feComposite in2="hardAlpha" operator="out"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.929412 0 0 0 0 0.192157 0 0 0 0 0.145098 0 0 0 1 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1490_10110"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1490_10110" result="shape"/>
                                    </filter>
                                    </defs>
                                </svg>
                            </CardStyled>
                        )}
                    </CardsFieldStyled>
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

            <CommonModal isDarken isOpen={isOpen && part === 4} btnText="Начать" onClose={handleStartGame}>
                <p><Bold>Ты быстро учишься, так держать!</Bold></p>
                <p>
                    Будь внимателен и не теряй время — чем больше напитков подашь, тем больше получишь баллов!
                </p>
                <p>На каждого гостя — <Bold><RedText>15 </RedText>секунд.</Bold></p>
                <p><Bold>Удачи!</Bold></p>
            </CommonModal>
        </>

    )
}