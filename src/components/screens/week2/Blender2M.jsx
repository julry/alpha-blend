import { DAYS } from "../../../constants/days";
import { drinks } from "../../../constants/drinks";
import { SCREENS } from "../../../constants/screens";
import { weekInfo } from "../../../constants/weeksInfo";
import { BlenderGame } from "../../shared/games/Blender";

export const Blender2M = () => {
    const weekData = weekInfo.find((info) => info.week === 2);
    const collegueMessage = weekData.blenderCollegueMessage?.[DAYS.Monday];
    const drinkInfo = drinks.find(drink => drink.id === 2);

    return (
        <BlenderGame 
            lobbyScreen={SCREENS.LOBBY2} 
            collegueMessage={collegueMessage} 
            drinkInfo={drinkInfo}
            week={2}
            day={DAYS.Monday}
            gameName={'blender2'}
        />
    )
}