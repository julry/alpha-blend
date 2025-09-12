import { DAYS } from "../../../constants/days";
import { planCardsWeek3_Monday } from "../../../constants/planCards"
import { SCREENS } from "../../../constants/screens";
import { PlannerGame } from "../../shared/games/PlannerGame"

export const Planner3M = () => {
    return (
        <PlannerGame 
            cards={planCardsWeek3_Monday} 
            lobbyScreen={SCREENS.LOBBY3}
            week={3}
            day={DAYS.Monday}
        />
    )
}