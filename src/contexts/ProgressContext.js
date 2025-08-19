// import { FTClient } from 'ft-client';
import { createContext, useEffect, useContext, useRef, useState } from 'react'
import { SCREENS, NEXT_SCREENS } from "../constants/screens";
import { screens } from "../constants/screensComponents";
import { getUrlParam } from "../utils/getUrlParam";
import { DAYS } from '../constants/days';

const INITIAL_CHALLENGES = [
    {
        [DAYS.Monday]: 3,
        [DAYS.Wednesday]: 3,
        [DAYS.Friday]: 3,
    },
    {
        [DAYS.Monday]: 3,
        [DAYS.Wednesday]: 3,
        [DAYS.Friday]: 3,
    },
    {
        [DAYS.Monday]: 3,
        [DAYS.Wednesday]: 3,
        [DAYS.Friday]: 3,
    },
    {
        [DAYS.Monday]: 3,
        [DAYS.Wednesday]: 3,
        [DAYS.Friday]: 3,
    },
];

const INITIAL_ACTIVITY_DATA = [
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
    id: '4242342',
    name: 'test',
    email: 'test@test.ru',
    university: '',
    isVip: true,
    seenStartInfo: false, //после реги до планнера
    seenActivityInfo: false, //плашки у кофе и ноута
    seenBlenderRules: false,
    isTgConnected: false,
    challenges: INITIAL_ACTIVITY_DATA, //сердечки в челленджах по дням
    blenders: INITIAL_ACTIVITY_DATA, //сердечки в блендере по дням
    readenLetter: INITIALS_LETTERS, //прочитанные сообщения по неделям
    achievements: [],
    findings: [], // находки
    drinks: [], //напитка
    blenderTimes: 0, //количество игр в блендер ??
    perfectBlenderTimes: 0, //количество идеальных комбо ??
    planners: INITIAL_ACTIVITY_DATA, //баллы в планнере по дням. прошел: undefined -> points
    points: 0, //общее количество баллов
    week1Points: 0, //баллы по неделям
    week2Points: 0,
    week3Points: 0,
    week4Points: 0,
};

const getMoscowTime = () => {
    const dateNow = new Date();
    const localOffset = dateNow.getTimezoneOffset();
    const utcPlus3Offset = -180;
    const totalOffset = utcPlus3Offset - localOffset;

    return new Date(dateNow.getTime() + totalOffset * 60 * 1000);
}

const getCurrentWeek = () => {
    const today = getMoscowTime();

    if (today < new Date(2025, 9, 7)) return 1;
    if (today < new Date(2025, 9, 14)) return 2;
    if (today < new Date(2025, 9, 21)) return 3;
    if (today < new Date(2025, 9, 28)) return 4;

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
    vipPoints: 0,
    weekPoints: 0,
    user: INITIAL_USER,
    passedWeeks: [],
    cardsSeen: [],
}

const ProgressContext = createContext(INITIAL_STATE);

const API_LINK = '';

export function ProgressProvider(props) {
    const { children } = props
    const [currentScreen, setCurrentScreen] = useState(getUrlParam('screen') || INITIAL_STATE.screen);
    const [points, setPoints] = useState(INITIAL_STATE.points);
    const [vipPoints, setVipPoints] = useState(INITIAL_STATE.vipPoints);
    const [modal, setModal] = useState({ visible: false });
    const [weekPoints, setWeekPoints] = useState(INITIAL_STATE.weekPoints);
    const [currentWeekPoints, setCurrentWeekPoints] = useState(INITIAL_STATE.weekPoints);
    const [gamePoints, setGamePoints] = useState(0);
    const [cardsSeen, setCardsSeen] = useState(INITIAL_STATE.cardsSeen);
    const [user, setUser] = useState(INITIAL_STATE.user);
    const [passedWeeks, setPassedWeeks] = useState(INITIAL_STATE.passedWeeks);
    const [hasPassedThisTry, setHasPassedThisTry] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(CURRENT_WEEK);
    const screen = screens[currentScreen];
    const $whiteStarRef = useRef();
    const $redStarRef = useRef();
    const client = useRef();

    const getDbCurrentWeek = async () => {
        const { week } = await client.current.loadProjectState();
        if (week && !isNaN(+week)) {
            setCurrentWeek(+week);
        }
    }

    useEffect(() => {
        // client.current = new FTClient(
        //     API_LINK,
        //     ''
        // )
        try {
            // getDbCurrentWeek();
        } catch (e) {
            console.log(e);
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
        setUser((prev) => ({...prev, readenLetter: ({...prev.readenLetter, [`week${week}`]: true})}));
        //TODO: add updateuser here
    }

    const addDayFinding = (id) => {
        setUser((prev) => ({...prev, findings: [...prev.findings, id]}));
        //TODO: add updateuser here
    }
    

    const addGamePoint = () => setGamePoints(prev => prev + 1);

    const endGame = (level, additionalPoints) => {
        const data = {
            passedWeeks: [...passedWeeks, level].join(',')
        };

        const isAddWeek = level === currentWeek;

        if (user.isVip) {
            if (isAddWeek) {
                data[`week${currentWeek}Points`] = weekPoints + 10;
                setCurrentWeekPoints(prev => prev + 10);
            }

            setWeekPoints(prev => prev + 10);
            data.targetPoints = vipPoints + additionalPoints;
            setVipPoints(prev => prev = prev + additionalPoints);
        } else {
            data.points = points + 10;
            setPoints(prev => prev + 10);
        }

        setGamePoints(0);
        updateUser(data);
    };

    const updateUser = async (changed) => {
        const {
            isVip, recordId, id, name, email, registerWeek, refId,
            university, isTgConnected, seenRules, week1Points, week2Points, week3Points, week4Points,
        } = user;

        const data = {
            id,
            name,
            email,
            university,
            isTarget: isVip,
            isTgConnected: isTgConnected,
            points,
            targetPoints: vipPoints,
            week1Points,
            week2Points,
            week3Points,
            week4Points,
            [`week${currentWeek > 4 ? 4 : currentWeek}Points`]: currentWeekPoints,
            seenRules,
            registerWeek,
            refId,
            ...changed,
        };

        setUser(prev => ({...prev, changed}));

        if (!recordId) return { ...data, isEror: true };

        // try {
        //     const result = await client.current.updateRecord(recordId, data);

        //     return result;
        // } catch (e) {
        //     console.log(e);

        //     return {...data, isEror: true};
        // }
    }

    const registrateUser = async ({ id, name, email }) => {
        // const data = {
        //     id: user.id,
        //     name,
        //     email,
        //     university: user.university,
        //     isTarget: user.isVip,
        //     points: 0,
        //     [`week${currentWeek}Points`]: 0,
        //     targetPoints: 0,
        //     isTgConnected: false,
        //     seenRules: false,
        //     registerWeek: currentWeek,
        //     weekStars: '',
        //     passedWeeks: '',
        //     cardsSeen: '',
        //     refId: user.refId,
        // };

        // const userInfo = {
        //     id,
        //     name,
        //     email,
        //     university: user.university,
        //     isVip: user.isVip,
        //     isTgConnected: false,
        //     seenRules: false,
        //     registerWeek: currentWeek,
        //     weekStars: [],
        //     week1Points: 0,
        //     week2Points: 0,
        //     week3Points: 0,
        //     week4Points: 0,
        //     refId,
        // };

        //    try {
        //         // const record = await client?.current.createRecord(data);
        //         setUser({...userInfo, recordId: record.id});
        //         setPoints(INITIAL_STATE.points);
        //         setVipPoints(INITIAL_STATE.vipPoints);
        //         setWeekPoints(INITIAL_STATE.weekPoints);
        //         setCurrentWeekPoints(INITIAL_STATE.weekPoints);
        //         setCardsSeen(INITIAL_STATE.cardsSeen);
        //         setPassedWeeks(INITIAL_STATE.passedWeeks);

        //         return record; 
        //    } catch (e) {
        //         return {isError: true}
        //    }
    };

    const getUserInfo = async (email, isAfterTg) => {
        //    try {
        //         // const record = await client?.current.findRecord('email', email);
        //         // if (!record) return {isError: true}; 
        //         // const {data, id} = record;
        //         let userInfo = {};

        //         userInfo = {
        //             recordId: id,
        //             id: data.id,
        //             name: data.name,
        //             email,
        //             university: data.university,
        //             fac: data.fac,
        //             isVip: data.isTarget,
        //             seenRules: data.seenRules,
        //             seenInfo: data.seenInfo,
        //             isTgConnected: data.isTgConnected,
        //             weekStars: data.weekStars.length > 0 ? data.weekStars.replace(' ', '').split(',').map((l) => +l.trim()) : [],
        //             registerWeek: data.registerWeek,
        //             week1Points: data.week1Points, 
        //             week2Points: data.week2Points,  
        //             week3Points: data.week3Points, 
        //             week4Points: data.week4Points, 
        //             refId: data.refId,
        //         };

        //         if (isAfterTg) {
        //             setUser(prev=> ({...prev, isTgConnected: data.isTgConnected}));
        //             setPoints(data?.points ?? 0);
        //             setVipPoints(data?.targetPoints ?? 0);

        //             return;
        //         }

        //         setUser(userInfo);
        //         const passed = data?.passedWeeks?.length > 0 ? data.passedWeeks.replace(' ', '').split(',').map((l) => +l.trim()) : [];
        //         const cardsSeen = data?.cardsSeen?.length > 0 ? data.cardsSeen.replace(' ', '').split(',').map((l) => +l.trim()) : [];
        //         setPassedWeeks(passed);
        //         setCardsSeen(cardsSeen);
        //         setPoints(data?.points ?? 0);
        //         setVipPoints(data?.targetPoints ?? 0);
        //         setWeekPoints(data?.[`week${currentWeek > 4 ? 4 : currentWeek}Points`] ?? 0);
        //         setCurrentWeekPoints(data?.[`week${currentWeek > 4 ? 4 : currentWeek}Points`] ?? 0);

        //         return {userInfo, passed};
        //    } catch (e) {
        //         console.log(e);
        //         return {isError: true}
        //    }
    }

    const state = {
        screen,
        currentScreen,
        points,
        next,
        setUserInfo,
        user,
        weekPoints,
        addGamePoint,
        setGamePoints,
        gamePoints,
        vipPoints,
        setModal,
        setVipPoints,
        setWeekPoints,
        setPoints,
        modal,
        passedWeeks,
        setPassedWeeks,
        endGame,
        updateUser,
        getUserInfo,
        registrateUser,
        currentWeek,
        currentWeekPoints,
        setCurrentWeekPoints,
        readWeekLetter,
        addDayFinding
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
