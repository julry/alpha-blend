import { week2Images } from "../../../constants/preloadImages"
import { useImagePreloader } from "../../../hooks/useImagePreloader"
import { Lobby } from "../Lobby"

export const Lobby2 = () => {
    useImagePreloader(week2Images);

    return (
        <Lobby week={2} />
    )
}
