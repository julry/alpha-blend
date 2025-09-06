import { FTClient } from 'ft-client';
import { createContext, useEffect, useContext, useRef, useState } from 'react'
import { SCREENS, NEXT_SCREENS } from "../constants/screens";
import { screens } from "../constants/screensComponents";
import { getUrlParam } from "../utils/getUrlParam";
import { DAYS } from '../constants/days';
import WebApp from '@twa-dev/sdk';
import { uid } from 'uid';

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

export const CURRENT_WEEK = 1;

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
    const [tgError, setTgError] = useState({isError: false, message: ''});
    const screen = screens[currentScreen];
  
    const client = useRef();
    const recordId = useRef();
    const isDesktop = useRef(false);

    const setUserBdData = (record) => {
        recordId.current = record?.id;
        const { data = {}} = record;

        setUserInfo(data);

        if (!data.email) return;

        // const {
        //     planner1, planner2, planner3, planner4, 
        //     blender1, blender2, blender3, blender4,
        //     game2048, gameBasket, gamePuzzle, gameMoles,
        //     achieves, drinks: dataDrinks, findings: dataFindings, lifehacks: dataLifehacks
        // } = record.data;

        // setPlanners([planner1, planner2, planner3, planner4]);
        // setBlenders([blender1, blender2, blender3, blender4]);
        // setChallenges([game2048, gameBasket, gamePuzzle, gameMoles]);
        // setAchievements(achieves);
        // setDrinks(dataDrinks);
        // setFindings(dataFindings);
        // setLifehacks(dataLifehacks);
    }

    const initProject = async () => {
        setIsLoading(true);
        try {
            const info = await loadRecord();

            if (isDesktop.current) {
                setCurrentScreen(SCREENS.DESKTOP);

                return;
            }

            // if (!info) {
            //     setTgError({isError: true, message: ''});
            // }

            // setUserBdData(info);

            if (getUrlParam('screen')) {
                setCurrentScreen(getUrlParam('screen'));

                return;
            }

            if (!info.data.email) {
                setCurrentScreen(INITIAL_STATE.screen);
            } else if (!info.data.seenStartInfo) {
                setCurrentScreen(CURRENT_WEEK > 0 ? SCREENS.START : SCREENS.WAITING);
            } else {
                //TODO: Доработать перед запуском
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
    
      // Для локалхоста задаём initData вручную
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
        setReadenLetter(prev => ({...prev,[`week${week}`]: true}));

        updateUser()
    }

    const addDayFinding = (id) => {
        updateUser(({findings: [...user.findings, id]}))
    }
    
    const endPlanner = ({finishPoints, week, day}) => {

    };

    const endGame = ({finishPoints, gameName, week, day}) => {
        // setPoints(prev => prev + finishPoints);

        // if (week === currentWeek) {
        //     setWeekPoints(prev => prev + finishPoints);
        // }

        // const gameData = user[gameName] ?? INITIAL_ACTIVITY_DATA;

        // const result = gameData.map((planner, index) => week - 1 === index ? ({...planner, [day]: finishPoints}) : planner);

        // const userResult = {
        //     points: points + finishPoints, 
        //     [`week${week}Points`]: (user[`week${week}Points`] ?? 0) + finishPoints,
        //     [`week${week}GamePoints`]: {
        //         ...user[`week${week}GamePoints`],
        //         [gameName]: finishPoints,
        //     }
        // };
        // setUserInfo(userResult);

        // return userResult;
    }

    const updateUser = async (changed) => {
        setUserInfo(changed);

        return patchData(changed);
    }

    const patchData = async ({changedUser, changedData}) => {
        if (!recordId.current) return;
        
        // const changed = {...changedUser, gameData};

        try {
            // const result = await client.current.patchRecord(user.recordId, changed);

            // return result;
        } catch (e) {
            console.log(e);

            return { isEror: true };
        }
    }

    const registrateUser = async (regData) => {
        const data = {
            ...user,
            achieves: [],
            findings: [],
            drinks: [],
            lifehacks: [],
            points: 0,
            passedWeeks: [],
            id: uid(),
            ...regData
        }

        setUser(data)

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
        // currentWeek,
        readWeekLetter,
        addDayFinding,
        isLoading,
        patchData,
        tgError,
        checkEmailRegistrated
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
