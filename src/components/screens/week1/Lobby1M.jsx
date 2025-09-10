import { SCREENS } from "../../../constants/screens"
import { weekInfo } from "../../../constants/weeksInfo"
import { CURRENT_DAY } from "../../../contexts/ProgressContext"
import { useImagePreloader } from "../../../hooks/useImagePreloader"
import { Lobby } from "../Lobby"

export const Lobby1M = () => {
    const endMessage = weekInfo.find((info) => info.week === 1)?.dayEndMessages[CURRENT_DAY];
    // useImagePreloader(preloadImagesWeek1);
    return (
        <Lobby 
            week={1} 
            plannerScreen={SCREENS.PLANNER1M} 
            challengeScreen={SCREENS.GAME1M}
            blender={SCREENS.BLENDER1M}
            endMessage={endMessage}
        />
    )
}
