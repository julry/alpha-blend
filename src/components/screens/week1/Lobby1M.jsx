import { DAYS } from "../../../constants/days"
import { SCREENS } from "../../../constants/screens"
import { weekInfo } from "../../../constants/weeksInfo"
import { Lobby } from "../Lobby"

export const Lobby1M = () => {
    const endMessage = weekInfo.find((info) => info.week === 1)?.dayEndMessages[DAYS.Monday];

    return (
        <Lobby 
            week={1} 
            day={DAYS.Monday} 
            plannerScreen={SCREENS.PLANNER1M} 
            challengeScreen={SCREENS.GAME1M}
            blender={SCREENS.BLENDER1M}
            endMessage={endMessage}
        />
    )
}
