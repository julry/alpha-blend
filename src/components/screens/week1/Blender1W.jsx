import { DAYS } from "../../../constants/days";
import { drinks } from "../../../constants/drinks";
import { SCREENS } from "../../../constants/screens";
import { weekInfo } from "../../../constants/weeksInfo";
import { BlenderGame } from "../../shared/games/Blender";

export const Blender1W = () => {
    const weekData = weekInfo.find((info) => info.week === 1);
    const collegueMessage = weekData.blenderCollegueMessage?.[DAYS.Wednesday];
    const drinkInfo = drinks.find(drink => drink.id === 11);

    return (
        <BlenderGame 
            lobbyScreen={SCREENS.LOBBY1M} 
            collegueMessage={collegueMessage} 
            drinkInfo={drinkInfo}
            week={1}
            day={DAYS.Wednesday}
            gameName={'blender1'}
        />
    )
}