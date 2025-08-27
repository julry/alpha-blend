import styled from "styled-components"
import { HighlightedItems } from "../shared/HighligthedItems"
import { FlexWrapper } from "../shared/ContentWrapper";
import lobbyBg from '../../assets/images/lobbyBg.png';
import { IconButton } from "../shared/Button";
import { useEffect, useState } from "react";
import { PersonIcon } from "../shared/svg/PersonIcon";
import { AchievesModal, ProfileModal, RulesModal } from "../shared/modals";
import { CURRENT_DAY, useProgress } from "../../contexts/ProgressContext";
import { LetterModal } from "../shared/modals/LetterModal";
import { weekInfo } from "../../constants/weeksInfo";
import { Block } from "../shared/Block";
import { LifehackModal } from "../shared/modals/LifehackModal";
import { CommonModal } from "../shared/modals/CommonModal";

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
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing_x3);
    width: 100%;
`;

const IconButtonStyled = styled(IconButton)`
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

export const Lobby = ({ isLaptopHighlightened, isLaptopLetter, onLaptopClick, ...props }) => {
    const { user, next, currentWeek } = useProgress();
    const [isUserModal, setIsUserModal] = useState(false);
    const [isRulesModal, setIsRulesModal] = useState(false);
    const [isAchieveModal, setIsAchieveModal] = useState(false);
    const [isLetterModal, setIsLetterModal] = useState(false);
    const [isFindingModal, setIsFindingModal] = useState(false);
    const [isFinishShown, setIsFinishShown] = useState(false);
    
    const week = props.week ?? currentWeek;
    const day = props.day ?? CURRENT_DAY;
    const weekName = `week${week}`;
    const weekMessages = weekInfo.find((info) => info.week === week);

    const isLetterShown = isLaptopLetter || !user.readenLetter?.[weekName];
    const isPlanerUndone = user.planners?.[week - 1]?.[day] === undefined;
    const isChallengeUndone = user.challenges?.[week - 1]?.[day] === undefined;
    const isBlenderUndone = user.blenders?.[week - 1]?.[day] === undefined;

    const isAllDone = !(isPlanerUndone || isChallengeUndone || isBlenderUndone);
    const isBulbShown = isAllDone && !user.lifehacks.includes(`week${week}day${day}`);

    const isLaptop = isLaptopHighlightened || isBulbShown || isLetterShown || (!isPlanerUndone && isChallengeUndone);
    const isCup = !isPlanerUndone && isBlenderUndone;
    const isTablet = !isLetterShown && isPlanerUndone;

    useEffect(() => {
        if (!isAllDone || isBulbShown) return;

        setIsFinishShown(true);
    }, [isAllDone, isBulbShown])

    const handleClickItem = (item) => {
        switch (item) {
            case 'laptop':
                if (!isLaptop) return;

                if (typeof onLaptopClick === 'function') {
                    onLaptopClick?.();

                    return;
                }

                if (isLetterShown) {
                    setIsLetterModal(true);
                    // setUserInfo({readenLetter: ({...user.readenLetter, [weekName]: true})});
                    return;
                }

                if (isBulbShown) {
                    setIsFindingModal(true);

                    return;
                }

                // Челлендж недели
                next(props.challengeScreen);
                break;
            case 'tablet':
                if (!isTablet) return;

                // Планнер-игра
                next(props.plannerScreen);
                break;
            case 'cup':
                if (!isCup) return;

                // Блендер-игра
                next(props.blenderScreen);
                break;
            default:
                break;
        };
    };

    return (
        <Wrapper>
            <Content>
                <Header>
                    <IconButton onClick={() => setIsUserModal(true)}>
                        <PersonIcon />
                    </IconButton>
                    <IconButton icon={{ width: 16, height: 22 }} onClick={() => setIsRulesModal(true)}>
                        <svg viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.568 14.3213V14.6565H3.36V13.1634C3.36 11.1219 3.84 10.3601 6.144 9.14127L8.256 8.07479C9.184 7.61773 9.728 7.13019 9.728 6.30748C9.728 5.33241 9.056 4.81441 7.936 4.81441C6.752 4.81441 6.112 5.48476 6.112 6.61219V7.31302H0V6.15512C0 2.49862 2.848 0 7.936 0C13.184 0 16 2.28532 16 6.33795C16 9.41551 14.592 10.9391 11.52 12.4931L10.272 13.133C9.728 13.4072 9.568 13.7119 9.568 14.3213ZM2.912 22V16.1496H10.016V22H2.912Z" fill="white" />
                        </svg>
                    </IconButton>
                </Header>
                <IconButtonStyled icon={{ width: 30, height: 30 }} onClick={() => setIsAchieveModal(true)}>
                    <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_3001_1852)">
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
            <LifehackModal isOpen={isFindingModal} onClose={() => setIsFindingModal(false)} lifehack={weekMessages?.lifehacks?.[day]}/>
            
            {isTablet && (
                <TabletInfo>
                    <p>{weekMessages?.plannersMessage?.[day]}</p>
                </TabletInfo>
            )}

            <CommonModal isOpen={isFinishShown} onClose={() => setIsFinishShown(false)} btnText="Понятно">
                {props.endMessage}
            </CommonModal>

            <ItemsStyled
                onClick={handleClickItem}
                isLaptopLetter={isLetterShown}
                isLaptop={isLaptop}
                isTablet={isTablet}
                isLaptopBulb={isBulbShown}
                isCup={isCup}
            />
            <Background />
        </Wrapper>
    )
}