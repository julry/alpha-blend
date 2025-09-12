import { DAYS } from "../../../constants/days";
import { planCardsWeek3_Friday } from "../../../constants/planCards";
import { SCREENS } from "../../../constants/screens";
import { PlannerGame } from "../../shared/games/PlannerGame"

export const Planner3F = () => {
    return (
        <PlannerGame 
            cards={planCardsWeek3_Friday} 
            lobbyScreen={SCREENS.LOBBY3}
            week={3}
            day={DAYS.Friday}
        />
    )
}