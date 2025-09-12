import { DAYS } from "../../../constants/days";
import { planCardsWeek1_Wednesday } from "../../../constants/planCards";
import { SCREENS } from "../../../constants/screens";
import { PlannerGame } from "../../shared/games/PlannerGame"

export const Planner2W = () => {
    return (
        <PlannerGame 
            cards={planCardsWeek1_Wednesday} 
            lobbyScreen={SCREENS.LOBBY2}
            week={2}
            day={DAYS.Wednesday}
        />
    )
}