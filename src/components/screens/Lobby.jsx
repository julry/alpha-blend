import styled from "styled-components"
import { HighlightedItems } from "../shared/HighligthedItems"
import { FlexWrapper } from "../shared/ContentWrapper";
import lobbyBg from '../../assets/images/lobbyBg.png';
import { IconButton } from "../shared/Button";
import { useState } from "react";
import { PersonIcon } from "../shared/svg/PersonIcon";
import { AchievesModal, FindingModal, ProfileModal, RulesModal } from "../shared/modals";
import { CURRENT_DAY, useProgress } from "../../contexts/ProgressContext";
import { findings } from "../../constants/findings";
import { LetterModal } from "../shared/modals/LetterModal";
import { weekInfo } from "../../constants/weeksInfo";
import { Block } from "../shared/Block";

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

export const Lobby = ({ isLaptopHighlightened, isLaptopLetter, onLaptopClick, week, day }) => {
    const { user, setUserInfo, currentWeek } = useProgress();
    const [isUserModal, setIsUserModal] = useState(false);
    const [isRulesModal, setIsRulesModal] = useState(false);
    const [isAchieveModal, setIsAchieveModal] = useState(false);
    const [isLetterModal, setIsLetterModal] = useState(false);
    const [isFindingModal, setIsFindingModal] = useState(false);

    const weekName = `week${week ?? currentWeek}`;
    const weekMessages = weekInfo.find(({ week }) => week === currentWeek);

    const isLetterShown = isLaptopLetter || !user.readenLetter?.[weekName];
    const isPlanerUndone = user.planners?.[currentWeek - 1][CURRENT_DAY] === undefined;
    const isChallengeUndone = user.challenges?.[currentWeek - 1][CURRENT_DAY] === undefined;
    const isBlenderUndone = user.blenders?.[currentWeek - 1][CURRENT_DAY] === undefined;

    const isAllDone = !(isPlanerUndone || isChallengeUndone || isBlenderUndone);
    const isBulbShown = isAllDone && !user.findings.includes(findings.find(({ week, day }) => week === currentWeek && day === CURRENT_DAY).id);

    const isLaptop = isLaptopHighlightened || isBulbShown || isLetterShown || (!isPlanerUndone && isChallengeUndone);
    const isCup = !isPlanerUndone && isBlenderUndone;
    const isTablet = !isLetterShown && isPlanerUndone;

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

                if (isLetterShown) {
                    setIsFindingModal(true);

                    return;
                }

                // Челлендж недели
                // next()
                break;
            case 'tablet':
                if (!isTablet) return;

                // Планнер-игра
                // next()
                break;
            case 'cup':
                if (!isTablet) return;

                // Блендер-игра
                // next()
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
                <IconButtonStyled onClick={() => setIsAchieveModal(true)} />
            </Content>
            <ProfileModal isOpen={isUserModal} onClose={() => setIsUserModal(false)} />
            <RulesModal isOpen={isRulesModal} onClose={() => setIsRulesModal(false)} />
            <AchievesModal isOpen={isAchieveModal} onClose={() => setIsAchieveModal(false)} />
            <LetterModal isOpen={isLetterModal} onClose={() => setIsLetterModal(false)} />
            <FindingModal isOpen={isFindingModal} onClose={() => setIsFindingModal(false)} />
            {isTablet && (
                <TabletInfo>
                    <p>{weekMessages.plannersMessage?.[day ?? CURRENT_DAY]}</p>
                </TabletInfo>
            )}
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