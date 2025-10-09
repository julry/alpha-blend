import styled from "styled-components"
import { FlexWrapper } from "../shared/ContentWrapper";
import lobbyBg from '../../assets/images/lobbyBg.png';
import { CommonModal } from "../shared/modals";
import { Bold } from "../shared/Spans";
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

export const LockSсreen = () => {
    const handleOpenLink = () => {
        reachMetrikaGoal('start career');
        window.open('https://fut.ru/s/alfa0910', '_blank');
    }

    return (
        <Wrapper>
            <CommonModal isOpen btnText="Узнать о стажировке" onClose={handleOpenLink}>
                    <p>
                        Привет! Раньше здесь была крутая игра от Альфа-Банка, а сейчас ты можешь выбрать свою <Bold>стажировку в топовой компании.</Bold>
                    </p>
            </CommonModal>
            <Background />
        </Wrapper>
    );
};
