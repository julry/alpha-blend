import { DAYS } from "../../../constants/days";
import { SCREENS } from "../../../constants/screens";
import { weekInfo } from "../../../constants/weeksInfo";
import { Game2048 } from "../../shared/games/Game2048"

export const Game2048M = () => {
    const collegueMessage = weekInfo.find((info) => info.week === 1).challengeCollegueMessage[DAYS.Monday];
    
    return <Game2048 collegueMessage={collegueMessage} lobbyScreen={SCREENS.LOBBY1M} isFirst/>
}