import { DAYS } from "../../../constants/days";
import { planCardsWeek2_Friday } from "../../../constants/planCards";
import { SCREENS } from "../../../constants/screens";
import { PlannerGame } from "../../shared/games/PlannerGame"

export const Planner2F = () => {
    return (
        <PlannerGame 
            cards={planCardsWeek2_Friday} 
            lobbyScreen={SCREENS.LOBBY2}
            week={2}
            day={DAYS.Friday}
        />
    )
}