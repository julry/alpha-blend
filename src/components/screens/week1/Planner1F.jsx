import { DAYS } from "../../../constants/days";
import { planCardsWeek1_Friday } from "../../../constants/planCards";
import { SCREENS } from "../../../constants/screens";
import { PlannerGame } from "../../shared/games/PlannerGame"

export const Planner1F = () => {
    return (
            <PlannerGame 
                cards={planCardsWeek1_Friday} 
                lobbyScreen={SCREENS.LOBBY1}
                week={1}
                day={DAYS.Friday}
            />
    )
}