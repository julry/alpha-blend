import { FTClient } from 'ft-client';
import { createContext, useEffect, useContext, useRef, useState } from 'react'
import { SCREENS, NEXT_SCREENS } from "../constants/screens";
import { screens } from "../constants/screensComponents";
import { getUrlParam } from "../utils/getUrlParam";
import { DAYS } from '../constants/days';

const INITIAL_ACTIVITY_DATA = [
    {
        [DAYS.Monday]: 'test',
        [DAYS.Wednesday]: undefined,
        [DAYS.Friday]: undefined,
    },
    {
        [DAYS.Monday]: undefined,
        [DAYS.Wednesday]: undefined,
        [DAYS.Friday]: undefined,
    },
    {
        [DAYS.Monday]: undefined,
        [DAYS.Wednesday]: undefined,
        [DAYS.Friday]: undefined,
    },
    {
        [DAYS.Monday]: undefined,
        [DAYS.Wednesday]: undefined,
        [DAYS.Friday]: undefined,
    },
];

const INITIALS_LETTERS = {
    week1: false,
    week2: false,
    week3: false,
    week4: false,
};

const INITIAL_USER = {
    id: '4242342', //saved
    name: 'test', //saved
    email: 'test@test.ru', //saved
    university: 'hehehe', //saved
    faculty: 'gell', //saved
    isTarget: true, // saved
    seenStartInfo: false, // saved после реги до планнера
    blenderTimes: 0, //количество игр в блендер ??
    perfectBlenderTimes: 0, //количество идеальных комбо ??
    week1Points: 0, //баллы по неделям
    week2Points: 0,
    week3Points: 0,
    week4Points: 0,
};

const getMoscowTime = (date) => {
    const dateNow = date ?? new Date();
    const localOffset = dateNow.getTimezoneOffset();
    const utcPlus3Offset = -180;
    const totalOffset = utcPlus3Offset - localOffset;

    return new Date(dateNow.getTime() + totalOffset * 60 * 1000);
}

const getCurrentWeek = () => {
    const today = getMoscowTime();

    if (today < getMoscowTime(new Date(2025, 8, 15))) return 0;
    if (today < getMoscowTime(new Date(2025, 8, 22))) return 1;
    if (today < getMoscowTime(new Date(2025, 8, 29))) return 2;
    if (today < getMoscowTime(new Date(2025, 9, 6))) return 3;
    if (today < getMoscowTime(new Date(2025, 9, 13))) return 4;

    return 5;
}

const getCurrentDay = () => {
    const day = getMoscowTime().getDay();

    switch (day) {
        case 1:
        case 2:
            return DAYS.Monday;
        case 3:
        case 4:
            return DAYS.Wednesday;
        case 5:
        case 6:
        case 0:
        default:
            return DAYS.Friday;
    }
}

export const CURRENT_WEEK = getCurrentWeek();

export const CURRENT_DAY = getCurrentDay();

const INITIAL_STATE = {
    screen: SCREENS.INTRO_REG,
    points: 0,
    weekPoints: 0,
    user: INITIAL_USER,
    passedWeeks: [],
    planners: INITIAL_ACTIVITY_DATA, //баллы в планнере по дням. прошел: undefined -> points
    challenges: INITIAL_ACTIVITY_DATA, //сердечки в челленджах по дням
    blenders: INITIAL_ACTIVITY_DATA, //сердечки в блендере по дням
    readenLetter: INITIALS_LETTERS, //прочитанные сообщения по неделям
    achievements: [],
    findings: [], // находки
    drinks: [], //напитка
    lifehacks: [], // лайфхаки
}

const ProgressContext = createContext(INITIAL_STATE);

const API_LINK = 'https://ft-admin-api.sjuksin.ru/';

export function ProgressProvider(props) {
    const { children } = props
    const [isLoading, setIsLoading] = useState();
    const [currentScreen, setCurrentScreen] = useState();
    const [points, setPoints] = useState(INITIAL_STATE.points);
    const [weekPoints, setWeekPoints] = useState(INITIAL_STATE.weekPoints);
    const [user, setUser] = useState(INITIAL_STATE.user);
    const [passedWeeks, setPassedWeeks] = useState(INITIAL_STATE.passedWeeks);
    const [planners, setPlanners] = useState(INITIAL_STATE.planners);
    const [challenges, setChallenges] = useState(INITIAL_STATE.challenges);
    const [blenders, setBlenders] = useState(INITIAL_STATE.blenders);
    const [readenLetter, setReadenLetter] = useState(INITIAL_STATE.readenLetter);
    const [achievements, setAchievements] = useState(INITIAL_STATE.achievements);
    const [findings, setFindings] = useState(INITIAL_STATE.findings);
    const [drinks, setDrinks] = useState(INITIAL_STATE.drinks);
    const [lifehacks, setLifehacks] = useState(INITIAL_STATE.lifehacks);
    const [currentWeek, setCurrentWeek] = useState(CURRENT_WEEK);
    const screen = screens[currentScreen];
  
    const client = useRef();

    const getDbCurrentWeek = async () => {
        const { week } = await client.current.loadProjectState();
        if (week && !isNaN(+week)) {
            setCurrentWeek(+week);
        }
    }

    useEffect(() => {
        client.current = new FTClient(
            API_LINK,
            'campus-alfa'
        )

        if (getUrlParam('screen')) {
            setCurrentScreen(getUrlParam('screen'));

            return;
        }
        setCurrentScreen(INITIAL_STATE.screen);

        setIsLoading(true);
        try {
            // getUserInfo('test@test.ru').then((dbUser) => {
            //     if (dbUser?.isError) {
            //         setCurrentScreen(INITIAL_STATE.screen);

            //         return;
            //     }
            //     if (!dbUser?.seenStartInfo) {
            //         setCurrentScreen(currentWeek > 0 ? SCREENS.START : SCREENS.WAITING);

            //         return;
            //     } else {
            //         setCurrentScreen(SCREENS.LOBBY);

            //         return
            //     }
            // });
            // getDbCurrentWeek();
        } catch (e) {
            setCurrentScreen(INITIAL_STATE.screen);

            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const next = (customScreen) => {
        const nextScreen = customScreen ?? NEXT_SCREENS[currentScreen]

        if (!nextScreen) {
            return
        }

        setCurrentScreen(nextScreen)
    }

    const setUserInfo = (user) => {
        setUser(prev => ({ ...prev, ...user }));
    }

    const readWeekLetter = (week) => {
        setReadenLetter(prev => ({...prev,[`week${week}`]: true}));

        updateUser()
    }

    const addDayFinding = (id) => {
        updateUser(({findings: [...user.findings, id]}))
    }
    
    const endGame = ({finishPoints, gameName, week, day}) => {
        setPoints(prev => prev + finishPoints);

        if (week === currentWeek) {
            setWeekPoints(prev => prev + finishPoints);
        }

        // const gameData = user[gameName] ?? INITIAL_ACTIVITY_DATA;

        // const result = gameData.map((planner, index) => week - 1 === index ? ({...planner, [day]: finishPoints}) : planner);

        const userResult = {
            points: points + finishPoints, 
            [`week${week}Points`]: (user[`week${week}Points`] ?? 0) + finishPoints,
            [`week${week}GamePoints`]: {
                ...user[`week${week}GamePoints`],
                [gameName]: finishPoints,
            }
        };
        setUserInfo(userResult);

        return userResult;
    }

    const updateUser = async (changed) => {
        setUserInfo(changed);

        return patchData(changed);
    }

    const patchData = async ({changedUser, changedData}) => {
        if (!user.recordId) return;
        
         const gameData = {
            passedWeeks,
            seenStartInfo: user.seenStartInfo,
            blenderTimes: user.blenderTimes,
            perfectBlenderTimes: user.perfectBlenderTimes,
            planners,
            challenges,
            blenders,
            readenLetter,
            achievements,
            findings,
            drinks,
            lifehacks,
            ...changedData
        };

        const changed = {...changedUser, gameData};

        try {
            const result = await client.current.patchRecord(user.recordId, changed);

            return result;
        } catch (e) {
            console.log(e);

            return { isEror: true };
        }
    }

    const registrateUser = async ({  name, email, university, faculty, isTarget}) => {
        const { isTarget: userVip, seenStartInfo, blenderTimes, perfectBlenderTimes, ...userData } = user;

        const gameData = {
            passedWeeks,
            seenStartInfo,
            blenderTimes,
            perfectBlenderTimes,
            planners,
            challenges,
            blenders,
            readenLetter,
            achievements,
            findings,
            drinks,
            lifehacks
        };

        const data = {
            ...userData,
            name,
            email,
            university, 
            faculty,
            isTarget,
            gameData: JSON.stringify(gameData),
            points: 0
        }

        return data;
        //    try {
        //         const record = await client?.current.createRecord(data);
        //         setUserInfo({isTarget, name, email, university, faculty, recordId: record.id});

        //         return record; 
        //    } catch (e) {
        //         return {isError: true}
        //    }
    };

    const getUserInfo = async (email) => {
        try {
            const {data = {}, id } = await client?.current.findRecord('email', email);
            const {gameData, ...recordData} = data;

            const { 
                planners,
                challenges,
                blenders,
                readenLetter,
                achievements,
                findings,
                drinks,
                lifehacks, 
                passedWeeks, 
                ...gameDataParsed
            } = JSON.parse(gameData);

            setPlanners(planners);
            setChallenges(challenges);
            setBlenders(blenders);
            setReadenLetter(readenLetter);
            setAchievements(achievements);
            setFindings(findings);
            setDrinks(drinks);
            setLifehacks(lifehacks);
            setPassedWeeks(passedWeeks);

            setUserInfo({...recordData, ...gameDataParsed, recordId: id});
        } catch (e) {
            console.log(e);
            return {isError: true};
        }
    }

    const state = {
        screen,
        currentScreen,
        points,
        next,
        setUserInfo,
        user,
        weekPoints,
        setWeekPoints,
        setPoints,
        passedWeeks,
        setPassedWeeks,
        endGame,
        updateUser,
        getUserInfo,
        registrateUser,
        currentWeek,
        readWeekLetter,
        addDayFinding,
        isLoading,
        patchData
    }

    return (
        <ProgressContext.Provider value={state}>
            {children}
        </ProgressContext.Provider>
    )
}

export function useProgress() {
    return useContext(ProgressContext)
}
