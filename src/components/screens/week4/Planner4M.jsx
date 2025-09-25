import { DAYS } from "../../../constants/days";
import { planCardsWeek4_Monday } from "../../../constants/planCards"
import { SCREENS } from "../../../constants/screens";
import { PlannerGame } from "../../shared/games/PlannerGame"

export const Planner4M = () => {
    return (
        <PlannerGame 
            cards={planCardsWeek4_Monday} 
            lobbyScreen={SCREENS.LOBBY4}
            week={4}
            day={DAYS.Monday}
        />
    )
}