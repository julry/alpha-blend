import { DAYS } from "../../../constants/days";
import { planCardsWeek4_Wednesday } from "../../../constants/planCards";
import { SCREENS } from "../../../constants/screens";
import { PlannerGame } from "../../shared/games/PlannerGame"

export const Planner4W = () => {
    return (
        <PlannerGame 
            cards={planCardsWeek4_Wednesday} 
            lobbyScreen={SCREENS.LOBBY4}
            week={4}
            day={DAYS.Wednesday}
        />
    )
}