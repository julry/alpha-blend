import { DAYS } from "../../../constants/days";
import { planCardsWeek3_Wednesday } from "../../../constants/planCards";
import { SCREENS } from "../../../constants/screens";
import { PlannerGame } from "../../shared/games/PlannerGame"

export const Planner3W = () => {
    return (
        <PlannerGame 
            cards={planCardsWeek3_Wednesday} 
            lobbyScreen={SCREENS.LOBBY3}
            week={3}
            day={DAYS.Wednesday}
        />
    )
}