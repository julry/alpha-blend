import { DAYS } from "../../../constants/days";
import { planCardsWeek4_Friday } from "../../../constants/planCards";
import { SCREENS } from "../../../constants/screens";
import { PlannerGame } from "../../shared/games/PlannerGame"

export const Planner4F = () => {
    return (
        <PlannerGame 
            cards={planCardsWeek4_Friday} 
            lobbyScreen={SCREENS.LOBBY4}
            week={4}
            day={DAYS.Friday}
        />
    )
}