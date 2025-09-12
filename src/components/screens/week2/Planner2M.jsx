import { DAYS } from "../../../constants/days";
import { planCardsWeek2_Monday } from "../../../constants/planCards"
import { SCREENS } from "../../../constants/screens";
import { PlannerGame } from "../../shared/games/PlannerGame"

export const Planner2M = () => {
    return (
        <PlannerGame 
            cards={planCardsWeek2_Monday} 
            lobbyScreen={SCREENS.LOBBY2}
            week={2}
            day={DAYS.Monday}
        />
    )
}