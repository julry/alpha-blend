import styled from "styled-components";
import { DAYS } from "../../../constants/days";
import { planCardsWeek1_Monday } from "../../../constants/planCards"
import { SCREENS } from "../../../constants/screens";
import { Block } from "../../shared/Block";
import { PlannerGame } from "../../shared/games/PlannerGame"
import { useRef, useState } from "react";
import { Modal } from "../../shared/modals/Modal";

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

export const Planner1W = () => {
    return (
            <PlannerGame 
                //TODO: add carsd on wednesday and friday AT LEAST
                // cards={planCardsWeek1_We} 
                isNeverPlayed
                lobbyScreen={SCREENS.LOBBY1M}
                week={1}
                day={DAYS.Wednesday}
            />
    )
}