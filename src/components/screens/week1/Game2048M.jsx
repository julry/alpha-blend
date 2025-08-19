import { DAYS } from "../../../constants/days";
import { weekInfo } from "../../../constants/weeksInfo";
import { useProgress } from "../../../contexts/ProgressContext"
import { Game2048 } from "../../shared/games/Game2048"

export const Game2048M = () => {
    const { user } = useProgress();
    const userTries = user.challenges[0][DAYS.Monday] ?? 3;
    const collegueMessage = weekInfo.find((info) => info.week === 1).challengeCollegueMessage[DAYS.Monday]
    return <Game2048 userTries={userTries} collegueMessage={collegueMessage}/>
}