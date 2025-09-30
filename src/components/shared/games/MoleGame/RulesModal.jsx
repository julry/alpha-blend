import styled from "styled-components";
import { Bold } from "../../Spans";
import { Block } from "../../Block";
import { Title } from "../../Title";
import { Modal } from "../../modals";
import { Li } from "../../Li";

const Content = styled(Block)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding-left: var(--spacing_x3);
    padding-right: var(--spacing_x3);
    font-size: var(--font_sm);
`;

const TitleStyled = styled(Title)`
    font-size: var(--font_lg);
`;


const Text = styled.p`
    font-weight: 300;
`;

export const RulesModal = ({ onClose, isOpen }) => {
    return (
        <Modal isDarken isOpen={isOpen}>
            <Content hasCloseIcon onClose={onClose}>
                <TitleStyled>как играть</TitleStyled>
                   
                <Text>
                    Твоя задача — набрать как можно больше баллов за <Bold>30 секунд.</Bold>
                </Text>
                <ul>
                    <Li>
                        Лови только «заряжающие» объекты — каждый даёт <Bold>+5 очков</Bold>.
                    </Li>
                    <Li>
                        Избегай «разряжающих» — за них снимается <Bold>–5 очков</Bold>.
                    </Li>
                    <Li>
                        Время ограничено таймером. Когда он обнулится — игра заканчивается.
                    </Li>
                </ul>
                 <Text>
                    <Bold>Будь внимателен:</Bold> скорость растёт, и реакция решает всё!
                </Text>
            </Content>
        </Modal>
    )
}