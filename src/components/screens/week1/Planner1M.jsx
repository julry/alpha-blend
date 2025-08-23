import { DAYS } from "../../../constants/days";
import { findings } from "../../../constants/findings";
import { planCardsWeek1_Monday } from "../../../constants/planCards"
import { SCREENS } from "../../../constants/screens";
import { weekInfo } from "../../../constants/weeksInfo"
import { PlannerGame } from "../../shared/games/PlannerGame"

export const Planner1M = () => {
    const weekData = weekInfo.find((info) => info.week === 1);
    const collegueMessage = weekData.plannersCollegueMessage[DAYS.Monday];
    const findingId = findings.find(({day, week}) => day === DAYS.Monday && week === 1).id;
    const finishMessage = weekData.plannersEndMessage[DAYS.Monday];
   
    return (
        <PlannerGame 
            cards={planCardsWeek1_Monday} 
            collegueMessage={collegueMessage} 
            findingId={findingId}
            finishMessage={finishMessage}
            isNeverPlayed
            lobbyScreen={SCREENS.LOBBY1M}
        />
    )
}