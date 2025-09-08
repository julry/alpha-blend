import { DAYS } from "../../../constants/days";
import { drinks } from "../../../constants/drinks";
import { SCREENS } from "../../../constants/screens";
import { weekInfo } from "../../../constants/weeksInfo";
import { BlenderGame } from "../../shared/games/Blender";

export const Blender1W = () => {
    const weekData = weekInfo.find((info) => info.week === 1);
    const collegueMessage = weekData.blenderCollegueMessage?.[DAYS.Wednesday];
    const levelMessages = weekData.blenderEndMessage?.[DAYS.Wednesday];
    const drinkInfo = drinks.find(drink => drink.id === 11);

    return (
        <BlenderGame 
            lobbyScreen={SCREENS.LOBBY1M} 
            collegueMessage={collegueMessage} 
            levelMessages={levelMessages} 
            drinkInfo={drinkInfo}
            isNeverPlayed2
            week={1}
        />
    )
}