import styled from "styled-components"
import { FlexWrapper } from "../shared/ContentWrapper";
import lobbyBg from '../../assets/images/lobbyBg.png';
import { IconButton } from "../shared/Button";
import { useState } from "react";
import { PersonIcon } from "../shared/svg/PersonIcon";
import { AchievesModal, CommonModal, ProfileModal } from "../shared/modals";
import { useProgress } from "../../contexts/ProgressContext";
import { Bold, RedText } from "../shared/Spans";
import { getUrlParam } from "../../utils/getUrlParam";
import {reachMetrikaGoal} from '../../utils/reachMetrikaGoal';

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

const IconButtonStyled = styled(IconButton)`
    margin-top: var(--spacing_x3);
    align-self: flex-start;
`;

export const PlayerLockSсreen = ({ isLaptopHighlightened, hideTips, isLaptopLetter, onLaptopClick, ...props }) => {
    const { user } = useProgress();
    const [isCommonModal, setIsCommonModal] = useState(true);
    const [isUserModal, setIsUserModal] = useState(false);
    const [isAchieveModal, setIsAchieveModal] = useState(false);

    const isTargeted = getUrlParam('targeted') ?? user.isTargeted;
 
    const handleOpenLink = () => {
        reachMetrikaGoal('start career');
        window.open('https://fut.ru/s/alfa0910', '_blank');
    }

    return (
        <Wrapper>
            <Content>
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
            <AchievesModal isOpen={isAchieveModal} onClose={() => setIsAchieveModal(false)} />
            <CommonModal isOpen={isCommonModal} btnText="Узнать о стажировке" onClose={handleOpenLink} onIconClose={() => setIsCommonModal(false)}>
                    <p>Игра от Альфа-Банка подошла к концу. Спасибо, что был с нами!</p>
                    <p><Bold>Твой ID:</Bold> {user.id}</p>
                    {isTargeted ? (
                        <p><Bold>Ты заработал <RedText>{user.week4Points}</RedText> баллов за 4 неделю и <RedText>{user.chances ?? 0}</RedText> шансов.</Bold></p>
                    ): (
                        <p><Bold>Ты заработал <RedText>{user.points}</RedText> баллов.</Bold></p>
                    )}
                    <p>
                        Приходи за классными <Bold>стажировками в Альфа-Банке!</Bold>
                    </p>
            </CommonModal>
            <Background />
        </Wrapper>
    );
};
