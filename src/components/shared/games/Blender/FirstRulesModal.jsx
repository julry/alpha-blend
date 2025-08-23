import { useState } from "react"
import { CommonModal } from "../../modals/CommonModal";
import styled from "styled-components";
import { persons } from "./constants";
import { Info } from "./Info";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { CardsField } from "./CardsField";
import { BlenderObject } from "./BlenderObject";
import { Modal } from "../../modals/Modal";
import { Block } from "../../Block";

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
`;


const InfoStyled = styled(Info)`
    z-index: 1004;
    bottom: calc(${({$bottom}) => $bottom}px + var(--spacing_x3));

    & > div:last-child {
        background-color: #30E301;
    }
`;

const CardsFieldStyled = styled(CardsField)`
    & {
position: absolute;
    bottom: var(--spacing_x6);
    z-index: 1004; 
    }
    
`;

const BlenderObjectStyled = styled(BlenderObject)`
    z-index: 1004 !important;
`;

export const FirstRulesModal = ({isOpen, modalsFuncs, modalsState}) => {
    const ratio = useSizeRatio();
    const [part, setPart] = useState(0);
    const [cards, setCards] = useState([]);

    const handleBegin = () => {
        setPart(prev => prev + 1);
        const res = modalsFuncs.getFriends();
        const person = persons.find(pers => pers.id === res.person);
        setCards({ingridients: res.ingridients, bottom: person.bottom + person.height})

        setTimeout(() => {
            setPart(prev => prev + 1);
        }, 500);
    }

    const handleStartTraining = () => {
        setPart(prev => prev + 1);
        modalsFuncs.setIsTraining(true);
    }

    const handleStartGame = () => {
        modalsFuncs.setIsFirstRules(false);
        modalsFuncs.handleRestart();
    }

    return (
        <>
            <CommonModal isDarken isOpen={isOpen && part === 0} btnText="Далее" onClose={handleBegin}>
                <p>
                    У тебя классно получается совмещать работу и личную жизнь.{'\n\n'}
                    К тебе в гости пришли друзья — взбодри их полезными напитками и помоги найти свой баланс.
                </p>
            </CommonModal>
            <ThirdPartModal isDarken isOpen={isOpen && part === 2} btnText="Далее" onClose={handleStartTraining}>
                 <p>
                    К каждому нужен индивидуальный подход — друзья сами покажут, какой именно напиток им нужен.
                </p>
            </ThirdPartModal>
            {
                isOpen && part === 2 && (
                    <InfoStyled $bottom={cards.bottom * ratio} ingridients={cards.ingridients}/>
                )
            }
            <Modal isDarken isOpen={isOpen && part === 3 && !modalsState.isFinishTraining}>
                <BlockStyled>
                    <p>
                        Выбирай правильные ингредиенты, загружай их в блендер, нажимай на кнопку и подавай готовый напиток. Попробуешь?
                    </p>
                </BlockStyled>
            </Modal>
            {
                isOpen && part === 3 && !modalsState.isFinishTraining && (
                    <>
                        <CardsFieldStyled shownCards={modalsState.shownCards ?? []} onCardClick={modalsFuncs.handleClickCard} />
                        <BlenderObjectStyled />
                    </>
                    
                )
            }
            <CommonModal isDarken isOpen={isOpen && modalsState.isFinishTraining} btnText="Начать" onClose={handleStartGame}>
                <p>
                    Ты быстро учишься, так держать!{'\n\n'}
                    Впереди 3 раунда, так что будь внимателен и не теряй время — чем быстрее отдашь напиток, тем больше будут баллы. Удачи!
                </p>
            </CommonModal>
        </>
       
    )
}