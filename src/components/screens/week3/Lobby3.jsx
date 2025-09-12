import { week3Images } from "../../../constants/preloadImages"
import { useImagePreloader } from "../../../hooks/useImagePreloader"
import { Lobby } from "../Lobby"

export const Lobby3 = () => {
    useImagePreloader(week3Images);

    return (
        <Lobby week={3} />
    )
}
