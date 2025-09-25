import { week4Images } from "../../../constants/preloadImages"
import { useImagePreloader } from "../../../hooks/useImagePreloader"
import { Lobby } from "../Lobby"

export const Lobby4 = () => {
    useImagePreloader(week4Images);

    return (
        <Lobby week={4} />
    )
}
