import styled from "styled-components";
import { DAYS } from "../../../constants/days";
import { planCardsWeek1_Monday } from "../../../constants/planCards"
import { SCREENS } from "../../../constants/screens";
import { Block } from "../../shared/Block";
import { PlannerGame } from "../../shared/games/PlannerGame"
import { useRef, useState } from "react";
import { Modal } from "../../shared/modals/Modal";
import { Bold } from "../../shared/Spans";

const ModalStyled = styled(Modal)`
    bottom: auto;
`;

const ChallengeInfo = styled(Block)`
    position: absolute;
    z-index: 4;
    top: var(--spacing_x8);
    left: 50%;
    transform: translateX(-50%);
`;

export const Planner1M = () => {
    const [isInfo, setIsInfo] = useState(false);
    const infoShown = useRef({});

    const handleCloseRules = () => {
        if (infoShown.current?.shown) return;

        setIsInfo(true);

        infoShown.current.timeout = setTimeout(() => {
            setIsInfo(false)
        }, 8000);

        infoShown.current.shown = true;
    };

    const handleCloseInfo = () => {
        setIsInfo(false);
        infoShown.current.timeout = undefined;
    };

    return (
        <>
            <PlannerGame 
                cards={planCardsWeek1_Monday} 
                isNeverPlayed
                lobbyScreen={SCREENS.LOBBY1}
                week={1}
                day={DAYS.Monday}
                onCloseRules={handleCloseRules}
            />
            <ModalStyled isOpen={isInfo}>
                <ChallengeInfo hasCloseIcon={true} onClose={handleCloseInfo}>
                    <p>
                        <Bold>Помнишь письмо про хакатон?</Bold> Это и есть челлендж недели. Не забудь добавить карточку в список дел — без неё не получится запланировать день!
                    </p>
                </ChallengeInfo>
            </ModalStyled>
        </>
    )
}