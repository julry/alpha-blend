import { DAYS } from "../../../constants/days";
import { SCREENS } from "../../../constants/screens";
import { Game2048 } from "../../shared/games/Game2048"

export const Game2048M = () => {    
    return <Game2048 lobbyScreen={SCREENS.LOBBY1M} isFirst day={DAYS.Monday}/>
}