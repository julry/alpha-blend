import { useEffect, useRef, useState } from "react";
import { useProgress } from "../../../../contexts/ProgressContext";
import { getPersonsArray } from "./utils";
import { LEVEL_TO_PEOPLE_AMOUNT, LEVEL_TO_PROBABILITY } from "./constants";
import { ingridients } from "../../../../constants/ingridients";

const POSITIONS = ['center', 'right', 'left'];


export const useGame = ({lobbyScreen, isNeverPlayed}) => {
     const { next } = useProgress();
    const [isRules, setIsRules] = useState(false);
    const [isFirstRules, setIsFirstRules] = useState(isNeverPlayed);
    const [level, setLevel] = useState(1);
    const [points, setPoints] = useState(0);
    const [blenderCards, setBlenderCards] = useState([]);
    const [comingFriends, setComingFriends] = useState([]);
    const [shownFriends, setShownFriends] = useState([]);
    const [isSkipping, setIsSkipping] = useState(false);
    const [isLast, setIsLast] = useState(false);
    const [isFinding, setIsFinding] = useState(false);
    const [isFinishModal, setIsFinishModal] = useState(false);
    const [queue, setQueue] = useState(1);
    const [doneDrinks, setDoneDrinks] = useState([]);
    const [maxQueue, setMaxQueue] = useState(1);
    const [passedLevel, setPassedLevel] = useState();
    const [lives, setLives] = useState(3);
    const [restartModal, setRestartModal] = useState(false);
    const correctAmount = useRef(0);
    const shownAmount = useRef(0);

    const shownCards = level > 1 ? ingridients : ingridients.filter(({isBased}) => isBased);

    const handleBack = () => {
        next(lobbyScreen);
    };

    const getFriends = () => {
        const {friends, maxQueue} = getPersonsArray({isBased: level < 3, peopleAmount: LEVEL_TO_PEOPLE_AMOUNT[level], maxSize: level, ingridientsProbability: LEVEL_TO_PROBABILITY[level]});
        setMaxQueue(maxQueue);
        setComingFriends(friends);
    }

    useEffect(() => {
        if (isFirstRules && level === 1) return;
        
        getFriends();
    }, [level]);

    useEffect(() => {
        const shown = comingFriends.filter((friend) => friend.queue === queue);
        const friends = shown.map((friend, index) => ({...friend, position: POSITIONS[index]}));
        setShownFriends(friends);

        shownAmount.current = friends.length;
    }, [queue, comingFriends])


    const handleNext = () => {
        setLevel(prev => prev + 1);
        setQueue(1);
        setPassedLevel();
    }

    const handleChangePerson = () => {
        if (maxQueue === queue) {
            setPassedLevel(level);
            return;
        }

        setQueue(prev => prev + 1);
    }

    const handleResetBlender = () => setBlenderCards([]);
    // useEffect(() => {
    //     //TODO: сделать пойнты
    //     setIsCollegue(true)
    // }, [commonAmount]);

    const handleShowFinding = () => {
        setIsFinishModal(true);
        setIsFinding(true);
    };

    const handleShowFinish = () => {
        setPassedLevel();
        setDoneDrinks([]);
        setBlenderCards([]);
        setIsFinishModal(true);
    };

    const handleClickCard = (card) => {
        if (blenderCards.length > 2 || blenderCards.find((({id}) => card.id === id))) return;

        setBlenderCards(prev => [...prev, card]);
    };

    const handleClickBlenderCard = (ind) => {
        setBlenderCards(prev => prev.filter((_, index) => index !== ind));
    };

    const handleRestart = () => {
        setRestartModal(false);
        setLevel(1);
        setQueue(1);
        setDoneDrinks([]);
        setPoints(0);
    }

    const handleBlenderStop = (drink) => {
        if (doneDrinks.length > 1) {
            if (lives === 1) {
                // endGame,
            }
            setLives(prev => prev - 1); 
            setRestartModal(true);
        } else {
            setDoneDrinks(prev => [...prev, drink]);
        }

        setBlenderCards([]);
    }

    const personLeave = (personId, tryPoints) => {
        setShownFriends(prev => prev.map((friend) => friend.person === personId ? ({...friend, isFinished: true, points: tryPoints}) : friend));
        setTimeout(() => {
            setShownFriends(prev => prev.filter((friend) => friend.person !== personId));
            shownAmount.current -= 1;

            if (shownAmount.current === 0) {
                handleChangePerson();
            }
        }, 1000);
    }

    const handleDropDrink = ({doneDrink, personId}) => {
        let tryPoints = 10;

        correctAmount.current += 1;
        setDoneDrinks(prev => prev.filter(drink => drink.id !== doneDrink.id));
        personLeave(personId, tryPoints)
        setPoints(prev => (prev + tryPoints) >= 0 ? (prev + tryPoints) : 0);
    }

    const handleEndTimer = (personId) => {
        personLeave(personId, 0);
        correctAmount.current = 0;
    }

    const handleCloseDrink = () => {
        setIsFinding(false);

        if (isNeverPlayed) {
            setIsLast(true);
        } else {
            next(lobbyScreen)
        }
    }

    const handleEndGame = () => {
        //записать прохождение
        next(lobbyScreen);
    }

    const modalFuncs = {
        handleCloseDrink,
        handleRestart,
        handleShowFinish,
        handleShowFinding,
        setIsRules,
        setIsFirstRules,
        setIsSkipping,
        handleNext,
        handleEndGame
    };

    const modalsState = {
        isRules,
        isFirstRules,
        isSkipping,
        isLast, 
        isFinishModal,
        isFinding,
        restartModal,
    }

    return {
        isPaused: isRules || isSkipping || passedLevel !== undefined || restartModal,
        handleEndTimer,
        handleDropDrink,
        handleBlenderStop,
        handleClickBlenderCard,
        handleClickCard,
        points,
        shownFriends,
        blenderCards,
        shownCards,
        modalFuncs,
        modalsState,
        lives,
        doneDrinks,
        handleBack,
        handleResetBlender,
        passedLevel
    }
}