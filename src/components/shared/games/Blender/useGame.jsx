import { useEffect, useRef, useState } from "react";
import { useProgress } from "../../../../contexts/ProgressContext";
import { getPersonsArray } from "./utils";
import { LEVEL_TO_PEOPLE_AMOUNT, LEVEL_TO_INGREDIENTS_PROBABILITY, LEVEL_TO_PEOPLE_PROBABILITY } from "./constants";
import { ingridients } from "../../../../constants/ingridients";
import { uid } from "uid";
import { drinks } from "../../../../constants/drinks";

const POSITIONS = ['center', 'right', 'left'];

export const useGame = ({lobbyScreen, isNeverPlayed, gameName, week, drinkInfo, day, isDelayed}) => {
    const { next, registrateAchieve, user, dropGame, endGame } = useProgress();
    const [isRules, setIsRules] = useState(false);
    const [isFirstRules, setIsFirstRules] = useState(isNeverPlayed);
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
    const [lives, setLives] = useState(user[gameName]?.[day]?.tries ?? 3);
    const [restartModal, setRestartModal] = useState(false);
    const [blenderDrop, setBlenderDrop] = useState(false);
    const [peopleAmount, setPeopleAmount] = useState(0);
    const [isEndModal, setIsEndModal] = useState({isShown: false});
    const [isCollegueModal, setIsCollegueModal] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isDisabledCardClick, setIsDisabledCardClick] = useState(false);
    const [isStartGameModal, setIsStartGameModal] = useState(!isNeverPlayed);

    const correctAmount = useRef(0);
    const shownAmount = useRef(0);

    const shownCards = week > 2 ? ingridients : ingridients.filter(({isBased}) => isBased);

    const handleBack = () => {
        if (lives !== 3 && day !== undefined && gameName !== undefined) {
            dropGame({gameName, tries: lives, day})
        }
        next(lobbyScreen);
    };

    const handleBlenderStart = () => {
        setIsDisabledCardClick(true);
    }

    const getEducationFriend = () => {
        const friend = {
            queue: 1,
            drink: drinks[0].id,
            person: 'girl0',
            ingridients: ['mint', 'orange'],
        };
        setMaxQueue(1);
        setComingFriends([friend]);
        
        return friend;
    };
    
    const getFriends = () => {
        const {friends, maxQueue} = getPersonsArray({isBased: week < 3, peopleAmount: LEVEL_TO_PEOPLE_AMOUNT[week], maxSize: LEVEL_TO_PEOPLE_PROBABILITY[week], ingridientsProbability: LEVEL_TO_INGREDIENTS_PROBABILITY[week]});
        setMaxQueue(maxQueue);
        setComingFriends(friends);

        return friends[0];
    }

    useEffect(() => {
        if (isFirstRules || isStartGameModal) return;
        
        getFriends();
    }, [isStartGameModal]);

    useEffect(() => {
        const shown = comingFriends.filter((friend) => friend.queue === queue);
        const friends = shown.map((friend, index) => ({...friend, id: `${friend.person}_${uid()}`, position: POSITIONS[index], queueAmount: shown.length}));

        if (doneDrinks.length > 2) {
            loseLive();
        };

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
        if (isDisabledCardClick) return;
        if (blenderCards.length > 2 || blenderCards.find((({id}) => card.id === id))) return;

        setBlenderCards(prev => [...prev, card]);
    };

    const handleClickBlenderCard = (ind) => {
        setBlenderCards(prev => prev.filter((_, index) => index !== ind));
    };

    const replay = () => {
        getFriends();
        setQueue(1);
        setDoneDrinks([]);
        setPoints(0);
        setPeopleAmount(0);
    };

    const handleStartGame = () => {
        setIsFirstRules(false);
        setTimeout(replay);
    };

    const handleRestart = () => {
        setRestartModal(false);
        replay();
    }

    const finishGame = ({isWin, finishPoints}) => {
        if (isFinished) return;

        const drinks = user?.drinks ?? [];
        endGame({finishPoints: finishPoints ?? points, gameName, week, day, addictiveData: {drinks: [...drinks, drinkInfo.id]}});
        setIsEndModal({shown: true, isWin,  points: finishPoints ?? points});
        setIsFinished(true);
    };

    const closeEndModal = () => {
        setIsCollegueModal(true);
        setIsEndModal({show: false});
    }

     const closeCollegueModal = () => {
        setIsCollegueModal(false);
        setIsFinding(true);
    }

    const loseLive = (drinkId) => {
        if (restartModal || isEndModal.isShown) return;
        if (shownFriends.some((pers) => pers.drink === drinkId) || doneDrinks.length < 2) return;

        setLives(prev => prev - 1);

        if (lives < 2) {
            finishGame({isWin: false});

            return;
        };
        setRestartModal(true);
    }
    const handleBlenderStop = (drink) => {
        if (doneDrinks.length > 2) return;
        setIsDisabledCardClick(false);
        loseLive(drink.id);
        
        setDoneDrinks(prev => [...prev, {...drink, doneDrinkId: uid()}]);
        setBlenderCards([]);
    }

    const personLeave = (personId, tryPoints, timer) => {
        setBlenderDrop();
        const newPoints = points + tryPoints;
        setShownFriends(prev => prev.map((friend) => friend.id === personId ? ({...friend, isFinished: true, points: tryPoints}) : friend));
        
        setTimeout(() => {
            if (correctAmount.current >= 3 && !user.achieves.includes(5)) {
                registrateAchieve(5);
            }

            setShownFriends(prev => prev.filter((friend) => friend.id !== personId));
            setPeopleAmount(prev => prev + 1);

            if (peopleAmount + 1 >= LEVEL_TO_PEOPLE_AMOUNT[week]) {
                finishGame({isWin: true, finishPoints: newPoints});

                return;
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

        setIsDisabledCardClick(false);

        correctAmount.current += 1;

        setDoneDrinks(prev => prev.filter((drink) => drink.doneDrinkId !== doneDrink.doneDrinkId));
        personLeave(personId, tryPoints);
        
        setPoints(prev => prev + tryPoints);
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
            next(lobbyScreen);
        }
    }

    const handleEndGame = () => {
        //записать прохождение
        next(lobbyScreen);
    }

    useEffect(() => {
        if (!isFinished && peopleAmount >= LEVEL_TO_PEOPLE_AMOUNT[week]) {
            finishGame({isWin: true});
        }
    }, [peopleAmount, isFinished])

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
        handleFinishTraining,
        handleStartGame,
        getEducationFriend,
        closeEndModal,
        closeCollegueModal,
        setIsStartGameModal
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
        isEndModal,
        isCollegueModal,
        isStartGameModal,
    }

    return {
        isPaused: isRules || isSkipping || restartModal || isFirstRules || isFinished || isStartGameModal,
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
        handleBlenderStart,
    }
}