import { FTClient } from 'ft-client';
import { createContext, useEffect, useContext, useRef, useState } from 'react'
import { SCREENS, NEXT_SCREENS } from "../constants/screens";
import { screens } from "../constants/screensComponents";
import { getUrlParam } from "../utils/getUrlParam";
import { DAY_ARR, DAYS } from '../constants/days';
import WebApp from '@twa-dev/sdk';
import { uid } from 'uid';
import { WEEK_TO_CHALLENGE_NAME } from '../constants/weeksInfo';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { initialImages } from '../constants/preloadImages';

const INITIAL_DAY_ACTIVITY = {
    completedAt: null,
    isCompleted: false,
    points: 0,
}

const INITIAL_ACTIVITY_DATA = {
    [DAYS.Monday]: INITIAL_DAY_ACTIVITY,
    [DAYS.Wednesday]: INITIAL_DAY_ACTIVITY,
    [DAYS.Friday]: INITIAL_DAY_ACTIVITY,
};

const INITIAL_DAY_POINTS_DATA = {
    [DAYS.Monday]: 0,
    [DAYS.Wednesday]: 0,
    [DAYS.Friday]: 0,
}

const INITIALS_LETTERS = {
    week1: false,
    week2: false,
    week3: false,
    week4: false,
};

const INITIAL_USER = {
    id: '',
    name: '',
    email: '',
    university: '',
    faculty: '',
    isTargeted: true,
    seenStartInfo: false,
    week1Points: 0,
    week2Points: 0,
    week3Points: 0,
    week4Points: 0,
    achieves: [],
    week1EnterPoints: INITIAL_DAY_POINTS_DATA,
    week2EnterPoints: INITIAL_DAY_POINTS_DATA,
    week3EnterPoints: INITIAL_DAY_POINTS_DATA,
    week4EnterPoints: INITIAL_DAY_POINTS_DATA,
    blender1: INITIAL_ACTIVITY_DATA,
    blender2: INITIAL_ACTIVITY_DATA,
    blender3: INITIAL_ACTIVITY_DATA,
    blender4: INITIAL_ACTIVITY_DATA,
    planner1: INITIAL_ACTIVITY_DATA,
    planner2: INITIAL_ACTIVITY_DATA,
    planner3: INITIAL_ACTIVITY_DATA,
    planner4: INITIAL_ACTIVITY_DATA,
    game2048: INITIAL_ACTIVITY_DATA,
    gameBasket: INITIAL_ACTIVITY_DATA,
    gamePuzzle: INITIAL_ACTIVITY_DATA,
    gameMoles: INITIAL_ACTIVITY_DATA,
    readenLetters: INITIALS_LETTERS
};

const getMoscowTime = (date) => {
    const dateNow = date ?? new Date();
    const localOffset = dateNow.getTimezoneOffset();
    const utcPlus3Offset = -180;
    const totalOffset = utcPlus3Offset - localOffset;
    
    return new Date(dateNow.getTime() + totalOffset * 60 * 1000);
}

const getCurrentWeek = () => {
    return 1;

    const today = getMoscowTime();

    if (today < getMoscowTime(new Date(2025, 8, 15))) return 0;
    if (today < getMoscowTime(new Date(2025, 8, 22))) return 1;
    if (today < getMoscowTime(new Date(2025, 8, 29))) return 2;
    if (today < getMoscowTime(new Date(2025, 9, 6))) return 3;
    if (today < getMoscowTime(new Date(2025, 9, 13))) return 4;

    return 5;
}

const getCurrentDay = () => {
    return DAYS.Friday;

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
    planners: [INITIAL_ACTIVITY_DATA,  INITIAL_ACTIVITY_DATA,  INITIAL_ACTIVITY_DATA,  INITIAL_ACTIVITY_DATA],
    challenges: [INITIAL_ACTIVITY_DATA,  INITIAL_ACTIVITY_DATA,  INITIAL_ACTIVITY_DATA,  INITIAL_ACTIVITY_DATA],
    blenders: [INITIAL_ACTIVITY_DATA,  INITIAL_ACTIVITY_DATA,  INITIAL_ACTIVITY_DATA,  INITIAL_ACTIVITY_DATA],
    achievements: [],
    findings: [],
    drinks: [],
    lifehacks: [],
}

const ProgressContext = createContext(INITIAL_STATE);

const API_LINK = process.env.REACT_APP_API_URL;
const DEV_ID = process.env.REACT_APP_DEV_ID;

export function ProgressProvider(props) {
    const { children } = props
    const [isLoading, setIsLoading] = useState();
    const [currentScreen, setCurrentScreen] = useState();
    const [points, setPoints] = useState(INITIAL_STATE.points);
    const [totalPoints, setTotalPoints] = useState(INITIAL_STATE.points);
    const [weekPoints, setWeekPoints] = useState(INITIAL_STATE.weekPoints);
    const [user, setUser] = useState(INITIAL_STATE.user);
    const [passedWeeks, setPassedWeeks] = useState(INITIAL_STATE.passedWeeks);
    const [newAchieve, setNewAchieve] = useState([]);
    const [isJustEntered, setIsJustEntered] = useState(true);
    const [day, setDay] = useState(CURRENT_DAY);
    const [isShowWeekLobbyInfo, setIsShowWeekLobbyInfo] = useState(false);
    const [tgError, setTgError] = useState({isError: false, message: ''});
    const screen = screens[currentScreen];
  
    const client = useRef();
    const recordId = useRef();
    const isDesktop = useRef(false);
    const tgInfo = useRef();

    useImagePreloader(initialImages);

    const setUserBdData = (record) => {
        recordId.current = record?.id;
        const { data = {}, scriptData = {}} = record;
        const passedWeeksBd = data.passedWeeks ?? [];
        const week = (passedWeeksBd[passedWeeksBd.length - 1] >= CURRENT_WEEK - 1) ? CURRENT_WEEK : passedWeeksBd[passedWeeksBd.length - 1] ?? 1;

        let dayIndex = DAY_ARR.indexOf(CURRENT_DAY);
        
        const firstUncompletedCh = Object.keys(data[`game${WEEK_TO_CHALLENGE_NAME[week]}`] ?? {}).find((key) => !data[`game${WEEK_TO_CHALLENGE_NAME[week]}`][key]?.isCompleted);
        const firstUncompletedPlanner = Object.keys(data[`planner${week}`] ?? {}).find((key) => !data[`planner${week}`][key]?.isCompleted);

        const indexOfCh = DAY_ARR.indexOf(firstUncompletedCh) > -1 ? DAY_ARR.indexOf(firstUncompletedCh) : 2;
        const indexOfPlann = DAY_ARR.indexOf(firstUncompletedPlanner) > -1 ? DAY_ARR.indexOf(firstUncompletedPlanner) : 2;

        dayIndex = Math.min(indexOfCh, indexOfPlann);

        if (week >= CURRENT_WEEK) {
            const currentDay = DAY_ARR.indexOf(CURRENT_DAY);
            dayIndex = dayIndex < currentDay ? dayIndex : currentDay;
        }

        setDay(DAY_ARR[dayIndex]);
        setIsShowWeekLobbyInfo(!data.planner1?.[DAYS.Monday]?.isCompleted);
        setUserInfo(data);
        setTotalPoints(scriptData?.pointsTotal ?? data.points);
        setPoints(data.points);
        setPassedWeeks(passedWeeksBd);
        setWeekPoints(data[`week${CURRENT_WEEK}Points`]);
    }

    const initProject = async () => {
        setIsLoading(true);
        try {
            const info = await loadRecord();

            tgInfo.current = info.systemData;

            if (isDesktop.current) {
                setCurrentScreen(SCREENS.DESKTOP);

                return;
            }

            if (!info) {
                setTgError({isError: true, message: ''});
            }

            setUserBdData(info);

            const {data = {}} = info
            const checkDay = getMoscowTime().getDay();

            if (checkDay === 1 && !data[`week${CURRENT_WEEK}EnterPoints`]?.[DAYS.Monday]) {
                updateUser({
                    [`week${CURRENT_WEEK}EnterPoints`]: {
                        ...data[`week${CURRENT_WEEK}EnterPoints`], 
                        [DAYS.Monday]: 50,
                    }
                });
            }
            if (checkDay === 3 && !data[`week${CURRENT_WEEK}EnterPoints`]?.[DAYS.Wednesday]) {
                updateUser({
                    [`week${CURRENT_WEEK}EnterPoints`]: {
                        ...data[`week${CURRENT_WEEK}EnterPoints`], 
                        [DAYS.Wednesday]: 50,
                    }
                });
            }
            if (checkDay === 5 && !data[`week${CURRENT_WEEK}EnterPoints`]?.[DAYS.Friday]) {
                updateUser({
                    [`week${CURRENT_WEEK}EnterPoints`]: {
                        ...data[`week${CURRENT_WEEK}EnterPoints`], 
                        [DAYS.Friday]: 50,
                    }
                });
            }

            if (getUrlParam('screen')) {
                setCurrentScreen(getUrlParam('screen'));

                return;
            }

            if (!info.data.email) {
                setCurrentScreen(INITIAL_STATE.screen);
                return;
            } else if (!info.data.seenStartInfo) {
                setCurrentScreen(CURRENT_WEEK > 0 ? SCREENS.INTRO_RULES : SCREENS.WAITING);

                return;
            } else {
                setCurrentScreen(SCREENS.LOBBY);
            }
        } catch (e) {
            setTgError({isError: true, message: e.message});
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        client.current = new FTClient(
            API_LINK,
            'campus-alfa'
        );

        initProject().catch((e) => console.log(e));

        if (WebApp) {
            WebApp.ready();
            WebApp.expand();
            WebApp.lockOrientation();
        }
    }, []);

    const loadRecord = () => {
        const webApp = window?.Telegram?.WebApp;
        let webAppInitData = webApp?.initData;
        let initData = WebApp.initData;

        if (window?.location?.hostname === 'localhost' || !!getUrlParam('screen')) {
            return client.current.findRecord('id', DEV_ID);
        } else {
            console.log('webAppInitData', webAppInitData);
        } 

        if (
            WebApp?.platform?.toLowerCase()?.includes('web') || WebApp?.platform?.toLowerCase()?.includes('desktop')
            || webApp?.platform?.toLowerCase()?.includes('web') || webApp?.platform?.toLowerCase()?.includes('desktop')
        ) {
                isDesktop.current = true;

                return;
        }
    
        if (webAppInitData) {
            return client.current.getTgRecord(webAppInitData);
        } else if (initData) {
            return client.current.getTgRecord(initData);
        } else if (!window?.Telegram) {
            console.error('Telegram не определен')

            throw new Error('Telegram не определен')
        } else if (!window?.Telegram?.WebApp) {
            console.error('Webapp не определен')

            throw new Error('Webapp не определен')
        } else {
            console.error('В WebApp нет данных пользователя')

            throw new Error ('В WebApp нет данных пользователя');
        }
    }

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
        updateUser(({readenLetters: {...user.readenLetters, [`week${week}`]: true}})).catch(() => {});
    }

    const readLifehack = (week, day) => {
        updateUser(({lifehacks: [...user.lifehacks, `week${week}day${day}`]})).catch(() => {});
    }

    const addDayFinding = (id) => {
        updateUser(({findings: [...user.findings, id]})).catch(() => {});
    }

    const dropGame = async ({gameName, day, tries}) => {
        if (user[gameName][day].isCompleted) return;

        await updateUser(
            {
                [gameName]: { ...user[gameName], [day]: {
                    ...user[gameName][day],
                    tries,
                }},
            }
        );

    }
    
    const formatDate = (date) => new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date).replace(',', '');

    const endGame = async ({finishPoints, gameName, week, day, addictiveData}) => {
        if (user[gameName][day].isCompleted) return;

        if (week === CURRENT_WEEK) {
            setWeekPoints(prev => prev + finishPoints);
        }

        const endTimeMsc = getMoscowTime();

        if (!user.achieves.includes(4) && gameName.includes('blender')) {
            let times = 0;

            times += Object.values(user.blender1).filter(val => val.isCompleted).length;
            times += Object.values(user.blender2).filter(val => val.isCompleted).length;
            times += Object.values(user.blender3).filter(val => val.isCompleted).length;
            times += Object.values(user.blender4).filter(val => val.isCompleted).length;

            if (times > 2) registrateAchieve(4);
        }

        await updateUser(
            {
                [`week${week}Points`]: (user[`week${week}Points`] ?? 0) + finishPoints,
                [gameName]: { ...user[gameName], [day]: {
                    isCompleted: true,
                    completedAt: formatDate(endTimeMsc),
                    points: finishPoints
                }},
                points: (user.points ?? 0) + finishPoints,
                ...addictiveData,
            }
        );

        const data = await loadRecord();
        setTotalPoints(prev => data?.scriptData.totalPoints ?? prev + finishPoints);
    }

    const updateTotalPoints = async () => {
        const data = await loadRecord();

        if (data?.scriptData.totalPoints) {
            setTotalPoints(data?.scriptData.totalPoints);
        }
    };

    const updateUser = async (changed) => {
        setUserInfo(changed);

        return patchData(changed);
    }

    const patchData = async (changed) => {
        if (!recordId.current) return;
        
        try {
            const result = await client.current.patchRecord(recordId.current, changed);

            return result;
        } catch (e) {
            console.log(e);

            return { isError: true };
        }
    }

    const registrateAchieve = (id) => {
        setNewAchieve(prev => [...prev, id]);
        updateUser({achieves: [...user.achieves, id]});
    };

    const registrateUser = async (args) => {
        const data = {
            ...user,
            achieves: [],
            findings: [],
            drinks: [],
            lifehacks: [],
            points: 0,
            passedWeeks: [],
            id: uid(),
            ...args,
        }

        setUser(data);

        try {
            const record = await client?.current.patchRecord(recordId.current, data);

            return record; 
        } catch (e) {
            return {isError: true}
        }
    };

    const checkEmailRegistrated = async (email) =>{
        const record = await client?.current.findRecord('email', email);

        return !!record?.id;
    };

    const changeDay = () => {
        setDay(prev => {
            const index = DAY_ARR.indexOf(prev);
            if (index > 1) return DAY_ARR[0];

            return DAY_ARR[index + 1];
        })
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
        registrateUser,
        totalPoints,
        readWeekLetter,
        addDayFinding,
        isLoading,
        patchData,
        tgError,
        checkEmailRegistrated,
        registrateAchieve,
        setNewAchieve,
        newAchieve,
        dropGame,
        isJustEntered,
        setIsJustEntered,
        day,
        readLifehack,
        changeDay,
        isShowWeekLobbyInfo,
        setIsShowWeekLobbyInfo,
        updateTotalPoints,
        tgInfo
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
