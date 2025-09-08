import { useEffect, useRef, useState } from "react";
import { useProgress } from "../../../../contexts/ProgressContext";
import { getPersonsArray } from "./utils";
import { LEVEL_TO_PEOPLE_AMOUNT, LEVEL_TO_INGREDIENTS_PROBABILITY, LEVEL_TO_PEOPLE_PROBABILITY } from "./constants";
import { ingridients } from "../../../../constants/ingridients";
import { uid } from "uid";
import { drinks } from "../../../../constants/drinks";

const POSITIONS = ['center', 'right', 'left'];

export const useGame = ({lobbyScreen, isNeverPlayed, isNeverPlayed2, week, isDelayed}) => {
    const { next } = useProgress();
    const [isRules, setIsRules] = useState(false);
    const [isFirstRules, setIsFirstRules] = useState(isNeverPlayed);
    const [isFirstRules2, setIsFirstRules2] = useState(isNeverPlayed2);
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
    const [lives, setLives] = useState(3);
    const [restartModal, setRestartModal] = useState(false);
    const [blenderDrop, setBlenderDrop] = useState(false);
    const [peopleAmount, setPeopleAmount] = useState(0);
    const [isEndModal, setIsEndModal] = useState({isShown: false});

    const correctAmount = useRef(0);
    const shownAmount = useRef(0);

    const shownCards = week > 2 ? ingridients : ingridients.filter(({isBased}) => isBased);

    const handleBack = () => {
        next(lobbyScreen);
    };

    const getFriends = () => {
        if ((isFirstRules || isFirstRules2)) {
            const friend = {
                queue: 1,
                drink: drinks[0].id,
                person: 'girl0',
                ingridients: ['mint', 'orange'],
            };
            setMaxQueue(1);
            setComingFriends([friend]);
            
            return friend;
        } 
        const {friends, maxQueue} = getPersonsArray({isBased: week < 3, peopleAmount: LEVEL_TO_PEOPLE_AMOUNT[week], maxSize: LEVEL_TO_PEOPLE_PROBABILITY[week], ingridientsProbability: LEVEL_TO_INGREDIENTS_PROBABILITY[week]});
        setMaxQueue(maxQueue);
        setComingFriends(friends);

        return friends[0];
    }

    useEffect(() => {
        if ((isFirstRules || isFirstRules2)) return;
        
        getFriends();
    }, [lives]);

    useEffect(() => {
        const shown = comingFriends.filter((friend) => friend.queue === queue);
        const friends = shown.map((friend, index) => ({...friend, id: `${friend.person}_${uid()}`, position: POSITIONS[index], queueAmount: shown.length}));
        if (queue > 1 && isDelayed) {
            for (let i = 0; i < friends.length; i++) {
                setTimeout(() => {
                    setShownFriends(prev => [...prev, friends[i]]);
                }, (i + 1) * 1500);
            }
        } else {
            setShownFriends(friends);
        }

        shownAmount.current = friends.length;
    }, [queue, comingFriends, isDelayed])

    const handleChangePerson = () => {
        if (maxQueue === queue) {
            return;
        }

        setQueue(prev => prev + 1);
    }

    const handleResetBlender = () => setBlenderCards([]);

    const handleShowFinding = () => {
        setIsFinishModal(true);
        setIsFinding(true);
    };

    const handleShowFinish = () => {
        setDoneDrinks([]);
        setBlenderCards([]);
        setIsFinishModal(true);
    };

    const handleClickCard = (card) => {
        //TODO: можно докидывать напитки пока крутится
        if (blenderCards.length > 2 || blenderCards.find((({id}) => card.id === id))) return;

        setBlenderCards(prev => [...prev, card]);
    };

    const handleClickBlenderCard = (ind) => {
        setBlenderCards(prev => prev.filter((_, index) => index !== ind));
    };

    const handleRestart = () => {
        setRestartModal(false);
        setQueue(1);
        setDoneDrinks([]);
        setPoints(0);
        setPeopleAmount(0);
    }

    const handleBlenderStop = (drink) => {
        if (doneDrinks.length > 2) return;
        if (!shownFriends.some((pers) => pers.drink === drink.id) && doneDrinks.length === 2) {
            //TODO: сохранить на сервер количество сердечек
            //TODO: продумать ситуацию, когда поменялись люди, а 3 дринка осталось
            setLives(prev => prev - 1);
            if (lives < 2) {
                setIsEndModal({shown: true, isWin: false})
            }
            setRestartModal(true);
        }
        
        setDoneDrinks(prev => [...prev, drink]);
        setBlenderCards([]);
    }

    const personLeave = (personId, tryPoints, timer) => {
        setBlenderDrop();
        setShownFriends(prev => prev.map((friend) => friend.id === personId ? ({...friend, isFinished: true, points: tryPoints}) : friend));
        
        setTimeout(() => {
            setShownFriends(prev => prev.filter((friend) => friend.id !== personId));
            setPeopleAmount(prev => prev + 1);

            if (peopleAmount + 1 >= LEVEL_TO_PEOPLE_AMOUNT[week]) {
                setIsEndModal({shown: true, isWin: true});
            }
            shownAmount.current -= 1;
            if (shownAmount.current === 0) {
                handleChangePerson();
            }
        }, timer ?? 500);
    }

    const handleFinishTraining = () => {
        setShownFriends([]);
    };

    const handleDropDrink = ({doneDrink, personId, isFinished}) => {
        if (isFinished) return;

        let tryPoints = 10;

        correctAmount.current += 1;
        setDoneDrinks(prev => prev.filter(drink => drink.id !== doneDrink.id));
        personLeave(personId, tryPoints);
        
        setPoints(prev => (prev + tryPoints) >= 0 ? (prev + tryPoints) : 0);
    }

    const handleEndTimer = (personId) => {
        personLeave(personId, 0, 0);
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
        handleEndGame,
        getFriends,
        handleClickCard,
        setIsFirstRules2,
        handleFinishTraining
    };

    const modalsState = {
        isRules,
        isFirstRules,
        isSkipping,
        isLast, 
        isFinishModal,
        isFinding,
        restartModal,
        shownCards,
        isFirstRules2,
        isEndModal
    }

    // const isPausedTraining = (isTraining && blenderCards < 1);
    // const isFirstRulesModals = (isFirstRules && !isTraining);

    // const isFirstPause = isPausedTraining || isFirstRulesModals;

    return {
        // isPaused: true,
        isPaused: isRules || isSkipping || restartModal || isFirstRules,
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
        blenderDrop, 
        setBlenderDrop,
        peopleAmount,
    }
}