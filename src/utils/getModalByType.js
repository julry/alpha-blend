import { 
    WhiteStarModal, ProfileModal, RedStarModal, ExitModal, 
    WinModal, InfoModal, RefreshStarsModal, PreRulesModal,
    CardRulesModal, PrizesModal, TgModal, MovementModal,
    NewWeekModal,
    EndGameModal
} from "../components/shared/modals";

export const getModalByType = (type, props) => {
    let Component;

    switch(type) {
        case 'profile':
            Component = ProfileModal;
            break;
        case 'whiteStar':
            Component = WhiteStarModal;
            break;
        case 'redStar':
            Component = RedStarModal;
            break;  
        case 'exit':
            Component = ExitModal;
            break;
        case 'win':
            Component = WinModal;
            break;
        case 'cardRules':
            Component = CardRulesModal;
            break;
        case 'info':
            Component = InfoModal;
            break;
        case 'refreshStars':
            Component = RefreshStarsModal;
            break;
        case 'preRules':
            Component = PreRulesModal;
            break;
        case 'prizes':
            Component = PrizesModal;
            break; 
        case 'movement':
            Component = MovementModal;
            break;
        case 'tg':
            Component = TgModal;
            break;
        case 'newWeek':
            Component = NewWeekModal;
            break;
        case 'endGame':
            Component = EndGameModal;
            break;
        default:
            return;
    }

    return <Component {...props} />
} 