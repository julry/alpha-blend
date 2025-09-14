import styled from "styled-components"
import { HighlightedItems } from "../shared/HighligthedItems"
import { FlexWrapper } from "../shared/ContentWrapper";
import lobbyBg from '../../assets/images/lobbyBg.png';
import { IconButton } from "../shared/Button";
import { useEffect, useRef, useState } from "react";
import { PersonIcon } from "../shared/svg/PersonIcon";
import { AchievesModal, ProfileModal, RulesModal } from "../shared/modals";
import { CURRENT_DAY, CURRENT_WEEK, useProgress } from "../../contexts/ProgressContext";
import { LetterModal, LifehackModal, NewAchieveModal } from "../shared/modals";
import { WEEK_TO_CHALLENGE_NAME, weekInfo } from "../../constants/weeksInfo";
import { Block } from "../shared/Block";
import { SCREENS } from "../../constants/screens";
import { AnimatePresence } from "framer-motion";
import { LobbyMenu } from "../shared/LobbyMenu";
import { DAY_ARR, DAYS } from "../../constants/days";
import { FinishContinuesModal } from "./FinishContinuesModal";
import { Bold } from "../shared/Spans";

const Wrapper = styled(FlexWrapper)`
    padding-top: var(--spacing_x8);
`;

const Background = styled(FlexWrapper)`
    position: absolute;
    inset: 0;
    z-index: 1; 
    background: url(${lobbyBg}) no-repeat center 100% / cover;
`;

const Content = styled(FlexWrapper)`
    z-index: 3;
    height: auto;
    padding: 0 var(--spacing_x4);
    min-height: unset;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const IconButtonStyled = styled(IconButton)`
    margin-top: var(--spacing_x3);
    align-self: flex-start;
`;

const ItemsStyled = styled(HighlightedItems)`
    position: absolute;
    inset: 0;
    z-index: 2;

    & .active {
        cursor: pointer;
    }
`;

const TabletInfo = styled(Block)`
    position: absolute;
    z-index: 4;
    top: var(--spacing_x8);
    left: 50%;
    transform: translateX(-50%);
`;

const Tip = styled(Block)`
    position: absolute;
    z-index: 4;
    ${({$isRigth}) => $isRigth ? 'right: var(--spacing_x5)': 'left: var(--spacing_x7)'};
    max-width: 57%;
    bottom: calc(var(--spacing_x6) * 10 + var(--spacing_x1)/2);
`;

export const Lobby = ({ isLaptopHighlightened, hideTips, isLaptopLetter, onLaptopClick, ...props }) => {
    const { 
        next, user, day, newAchieve, setNewAchieve, 
        isJustEntered, setIsJustEntered, readLifehack, 
        readWeekLetter, updateTotalPoints, updateUser,
        setPassedWeeks,
     } = useProgress();
    const [isUserModal, setIsUserModal] = useState(false);
    const [isRulesModal, setIsRulesModal] = useState(false);
    const [isAchieveModal, setIsAchieveModal] = useState(false);
    const [isLetterModal, setIsLetterModal] = useState(false);
    const [isFindingModal, setIsFindingModal] = useState(false);
    const [finishModal, setFinishModal] = useState({shown: false});
    const [isGameTip, setIsGameTip] = useState(false);
    const [isCupTip, setIsCupTip] = useState(false);
    const [hasClosed, setHasClosed] = useState(false);

    const [menuType, setMenuType] = useState();

    const tipsClosed = useRef({cup: false, game: false});

    const week = props.week ?? CURRENT_WEEK;

    const weekName = `week${week}`;
    const weekMessages = weekInfo.find((info) => info.week === week);

    const getBlenderShow= () => {
        const dayIndex = DAY_ARR.indexOf(day) + +(user?.[`planner${week}`][day]?.isCompleted);
        const days = Object.keys(DAYS).slice(0, dayIndex);

        return days.some((key) => !user?.[`blender${week}`][key]?.isCompleted);
    }

    const isLetterShown = isLaptopLetter || !user.readenLetters?.[weekName];
    const isPlanerUndone = !user?.[`planner${week}`]?.[day]?.isCompleted;
    const isChallengeUndone = !user?.[`game${WEEK_TO_CHALLENGE_NAME[week]}`]?.[day]?.isCompleted;
    const isBlenderUndone = !user?.[`blender${week}`]?.[day]?.isCompleted;

    const isAllDone = !(isPlanerUndone || isChallengeUndone || isBlenderUndone);
    const isBulbShown = !isChallengeUndone && !user?.lifehacks.includes(`week${week}day${day}`);

    const isLaptop = isLaptopHighlightened || isBulbShown || isLetterShown;
    const isCup = getBlenderShow();
    const isPlanner = !isLetterShown && isPlanerUndone;
    const isGame = !isPlanerUndone && isChallengeUndone;
    
    const plannerMessage = weekMessages?.plannersMessage?.[day];
    const letterMessage = weekMessages?.letterMessage;
    let endMessage = weekMessages?.dayEndMessages?.[day];
    endMessage = endMessage ?? (user.isTargeted ? weekMessages?.weekEndMessageVip : weekMessages.weekEndMessage);

    useEffect(() => {
        updateTotalPoints().catch(() => {});
    }, []);

    useEffect(() => {
        if (tipsClosed.current.cup) return;
        const isTipC = !user?.blender1[DAYS.Monday].isCompleted && user?.planner1[DAYS.Monday].isCompleted 
        && !menuType && !isLetterShown && !isPlanner;

        setIsCupTip(isTipC);
    }, [menuType]);

    useEffect(() => {
        if (tipsClosed.current.game) return;
        const isTipG = !user?.game2048[DAYS.Monday].isCompleted && user?.planner1[DAYS.Monday].isCompleted &&
         !isCupTip && !menuType && !isLetterShown && !isPlanner;

        setIsGameTip(isTipG);
    }, [isCupTip, menuType]);

    const handleCloseTip = (type) => {
        tipsClosed.current[type] = true;

        if (type === 'cup') {
            setIsCupTip(false);

            return;
        }

        setIsGameTip(false);
    };

    useEffect(() => {
        if (isPlanerUndone || isChallengeUndone || hasClosed) return;
        const isPrevWeek = week < CURRENT_WEEK;
        const isPrevDay = !isPrevWeek && (DAY_ARR.indexOf(day) < DAY_ARR.indexOf(CURRENT_DAY));
        const hasMoreToPass = isPrevWeek || isPrevDay;

        if (!hasMoreToPass && !isAllDone) return;

        setFinishModal({shown: true, hasMoreToPass, isAllDone});
    }, [isPlanerUndone, isChallengeUndone, isAllDone, day, week, hasClosed]);

    const handleClickItem = (item) => {
        if (['game', 'planner', 'blender'].includes(item) && !hideTips) {
            setMenuType(item);
            setIsJustEntered(false);
        };

        if (item === 'laptop') {
            if (!isLaptop) return;

            if (typeof onLaptopClick === 'function') {
                onLaptopClick?.();

                return;
            }

            if (isLetterShown) {
                setIsLetterModal(true);
                readWeekLetter(week);
                return;
            }

            if (isBulbShown) {
                setIsFindingModal(true);
                readLifehack(week, day);

                if (day === DAYS.Friday && !user?.passedWeeks.includes(week)) {
                    updateUser({passedWeeks: [...(user.passedWeeks ?? []), week]});
                    setPassedWeeks(prev => prev.includes(week) ? prev : [...prev, week]);
                }
                return;
            }
        }
    };

    const handleCloseFinding = () => {
        setIsFindingModal(false);
    };

    const handleCloseFinish = () => {
        if (day === DAYS.Friday && !user?.passedWeeks.includes(week)) {
            updateUser({passedWeeks: [...(user.passedWeeks ?? []), week]});
            setPassedWeeks(prev => prev.includes(week) ? prev : [...prev, week]);
        }
        setHasClosed(true);
        setFinishModal({shown: false});
    };

    return (
        <Wrapper>
            <Content>
                <Header>
                    <IconButton onClick={() => next(SCREENS.LOBBY)}>
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.73132 12.8708C4.35912 12.8708 4.03055 12.8634 3.70255 12.8737C3.5054 12.88 3.41306 12.8265 3.41476 12.6015C3.42326 11.5464 3.42326 10.4913 3.4125 9.43618C3.41023 9.2232 3.53033 9.13226 3.67196 9.03095C6.21215 7.21605 8.75121 5.40001 11.2903 3.58338C12.4476 2.75508 13.6078 1.93023 14.759 1.0933C14.9363 0.964361 15.0575 0.97242 15.2314 1.09675C18.9205 3.73534 22.6118 6.37106 26.3099 8.99641C26.5728 9.18291 26.6731 9.38034 26.6657 9.70326C26.6447 10.6427 26.6481 11.5832 26.6629 12.5226C26.6674 12.8058 26.5717 12.8944 26.3043 12.8754C26.0318 12.8559 25.757 12.876 25.4834 12.8697C25.339 12.8662 25.2727 12.9238 25.2795 13.0706C25.2823 13.1281 25.2783 13.1857 25.2783 13.2433C25.2783 17.166 25.2783 21.0888 25.2783 25.0116C25.2783 25.2791 25.4122 25.413 25.68 25.4134C26.0295 25.4139 26.3785 25.4208 26.7275 25.4122C26.9172 25.4076 27.0005 25.4703 26.9988 25.6753C26.9926 26.6918 26.9886 27.7089 26.9999 28.7254C27.0033 29.0075 26.8425 29 26.6521 29C24.5379 28.9988 22.4232 29 20.309 29C14.6927 29 9.07582 29 3.45952 29C3.00575 29 3.00065 28.9988 3.00008 28.5274C2.99895 27.5874 3.00972 26.6475 3.00122 25.7075C2.99895 25.4778 3.07713 25.403 3.2958 25.4116C3.61644 25.4243 3.93765 25.4168 4.25829 25.4128C4.79136 25.4053 4.73075 25.4859 4.73132 24.9454C4.73301 22.2406 4.73132 19.5358 4.73132 16.831C4.73132 15.632 4.73018 14.433 4.73018 13.2346C4.73018 13.1304 4.73018 13.0263 4.73018 12.8708H4.73132ZM16.7043 25.4134C16.7213 25.3351 16.7327 25.3074 16.7327 25.2798C16.7344 23.2848 16.7327 21.2891 16.7383 19.2941C16.7383 19.0972 16.6375 19.0805 16.4885 19.0811C15.5254 19.084 14.5624 19.0886 13.5993 19.0794C13.3858 19.0776 13.3229 19.1536 13.3235 19.3631C13.3291 21.2914 13.3303 23.2197 13.3235 25.1474C13.3229 25.3713 13.4124 25.4191 13.6112 25.4162C14.2151 25.4065 14.8196 25.4134 15.424 25.4134C15.8472 25.4134 16.2698 25.4134 16.7038 25.4134H16.7043ZM16.7185 12.9025C16.6675 12.891 16.6318 12.876 16.5961 12.876C15.577 12.8737 14.5573 12.8772 13.5382 12.8697C13.3184 12.868 13.3274 13.0055 13.3274 13.1546C13.328 14.1711 13.3331 15.1877 13.3246 16.2042C13.3229 16.4298 13.3954 16.4995 13.618 16.4972C14.5715 16.4862 15.5249 16.4937 16.4777 16.4926C16.5582 16.4926 16.6381 16.4759 16.7185 16.4667V12.9025ZM21.9009 23.4638C21.9286 23.4068 21.9433 23.3901 21.9439 23.3734C21.9479 22.0029 21.953 20.6324 21.9456 19.2618C21.9456 19.2014 21.8278 19.0909 21.7638 19.0903C21.0279 19.0782 20.292 19.0851 19.5567 19.0811C19.4094 19.0805 19.359 19.1421 19.359 19.2872C19.3618 20.6099 19.3612 21.9327 19.3584 23.2554C19.3584 23.3982 19.4043 23.4655 19.5533 23.4649C20.3356 23.4615 21.118 23.4632 21.9014 23.4632L21.9009 23.4638ZM10.6847 21.2707H10.683C10.683 20.6387 10.6756 20.0067 10.687 19.3752C10.6909 19.1553 10.6314 19.0724 10.402 19.0776C9.74259 19.092 9.08262 19.0909 8.42321 19.0788C8.20454 19.0748 8.12863 19.1392 8.13033 19.3689C8.13939 20.6421 8.13769 21.916 8.12976 23.1892C8.12863 23.3999 8.18868 23.4741 8.40168 23.4701C9.07072 23.458 9.73976 23.4557 10.4088 23.4707C10.6462 23.4759 10.6909 23.378 10.6881 23.1668C10.6785 22.5347 10.6847 21.9027 10.6847 21.2713V21.2707ZM19.4066 12.8898C19.3884 12.9249 19.372 12.9411 19.372 12.9578C19.3663 14.0779 19.3629 15.198 19.3561 16.3176C19.355 16.4874 19.4575 16.4937 19.5799 16.4931C20.0796 16.4914 20.5786 16.4931 21.0783 16.4931C21.3582 16.4931 21.638 16.4931 21.9286 16.4931V12.8898H19.4066ZM8.13486 14.6754C8.13486 15.1928 8.14052 15.7103 8.13203 16.2272C8.12863 16.4183 8.17905 16.5006 8.38469 16.4972C9.06336 16.4862 9.74259 16.4845 10.4213 16.4972C10.6439 16.5018 10.6881 16.4131 10.687 16.2105C10.6796 15.1854 10.6802 14.1602 10.6875 13.1356C10.6887 12.9428 10.6399 12.8645 10.4354 12.8674C9.75676 12.8783 9.07752 12.88 8.39885 12.8674C8.17961 12.8634 8.12636 12.9457 8.13089 13.1523C8.14222 13.66 8.13486 14.1677 8.13486 14.6754Z" fill="white"/>
                        </svg>
                    </IconButton>
                    <IconButton icon={{ width: 16, height: 22 }} onClick={() => setIsRulesModal(true)}>
                        <svg viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.568 14.3213V14.6565H3.36V13.1634C3.36 11.1219 3.84 10.3601 6.144 9.14127L8.256 8.07479C9.184 7.61773 9.728 7.13019 9.728 6.30748C9.728 5.33241 9.056 4.81441 7.936 4.81441C6.752 4.81441 6.112 5.48476 6.112 6.61219V7.31302H0V6.15512C0 2.49862 2.848 0 7.936 0C13.184 0 16 2.28532 16 6.33795C16 9.41551 14.592 10.9391 11.52 12.4931L10.272 13.133C9.728 13.4072 9.568 13.7119 9.568 14.3213ZM2.912 22V16.1496H10.016V22H2.912Z" fill="white" />
                        </svg>
                    </IconButton>
                </Header>
                <IconButtonStyled onClick={() => setIsUserModal(true)}>
                    <PersonIcon />
                </IconButtonStyled>
                <IconButtonStyled icon={{ width: 30, height: 30 }} onClick={() => setIsAchieveModal(true)}>
                    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_3001_1852)">
                        <path d="M15 2L17.6325 3.368L20.5631 3.8145L21.8912 6.4745L24 8.5645L23.5173 11.5L24 14.4355L21.8912 16.5255L20.5631 19.1855L17.6325 19.632L15 21L12.3675 19.632L9.43691 19.1855L8.10883 16.5255L6 14.4355L6.48265 11.5L6 8.5645L8.10883 6.4745L9.43691 3.8145L12.3675 3.368L15 2Z" fill="white"/>
                        <path d="M9 21V29L15 27.098L21 29V21L17.973 21.582L15 23.5335L12.027 21.582L9 21Z" fill="white"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_3001_1852">
                        <rect width="30" height="30" fill="white"/>
                        </clipPath>
                        </defs>
                    </svg>
                </IconButtonStyled>
            </Content>
            <ProfileModal isOpen={isUserModal} onClose={() => setIsUserModal(false)} />
            <RulesModal isOpen={isRulesModal} onClose={() => setIsRulesModal(false)} />
            <AchievesModal isOpen={isAchieveModal} onClose={() => setIsAchieveModal(false)} />
            
            <LetterModal isOpen={isLetterModal} onClose={() => setIsLetterModal(false)} checkedWeek={week}/>
            <LifehackModal isOpen={isFindingModal} onClose={handleCloseFinding} lifehack={weekMessages?.lifehacks?.[day]}/>
            
            <NewAchieveModal isOpen={newAchieve.length > 0} achieveId={newAchieve[0]} onClose={() => {setNewAchieve(prev => prev.slice(1))}}/>
            
            {isPlanner && isJustEntered && !hideTips && !isLetterModal && (
                <TabletInfo>
                    {typeof plannerMessage === 'function' ? plannerMessage() : plannerMessage}
                </TabletInfo>
            )}
            {
                isLetterShown && letterMessage !== undefined && (
                    <TabletInfo>
                        {typeof letterMessage === 'function' ? letterMessage() : letterMessage}
                    </TabletInfo>
                )
            }

            {isGameTip && (<Tip key="game" $isRigth hasCloseIcon onClose={() => handleCloseTip('game')}><p><Bold>Нажми на приставку,</Bold> чтобы перейти к челленджу недели.</p></Tip>)}
            {isCupTip && <Tip key="cup" hasCloseIcon onClose={() => handleCloseTip('cup')}><p><Bold>Нажми на кружку,</Bold> если хочешь поиграть в «Блендер».</p></Tip>}

            <FinishContinuesModal 
                isOpen={finishModal.shown} 
                onClose={handleCloseFinish} 
                hasMore={finishModal.hasMoreToPass} 
                endMessage={endMessage}
                isAllDone={finishModal.isAllDone}
            />
            <AnimatePresence>
                {menuType !== undefined && <LobbyMenu week={week} type={menuType} onClose={()=> setMenuType()}/>}
            </AnimatePresence>
            <ItemsStyled
                onClick={handleClickItem}
                isLaptopLetter={isLetterShown}
                isLaptop={isLaptop}
                isGame={isGame}
                isPlanner={isPlanner}
                isLaptopBulb={isBulbShown}
                isCup={isCup}
            />
            <Background />
        </Wrapper>
    )
}