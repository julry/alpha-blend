import { DAYS } from "../../../constants/days"
import { SCREENS } from "../../../constants/screens"
import { Lobby } from "../Lobby"

export const Lobby1M = () => (
    <Lobby 
        week={1} 
        day={DAYS.Monday} 
        plannerScreen={SCREENS.PLANNER1_1} 
        challengeScreen={SCREENS.GAME1M}
        blender={SCREENS.BLENDER1M}
    />
)
