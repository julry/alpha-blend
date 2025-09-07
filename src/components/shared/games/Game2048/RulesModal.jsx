import styled from "styled-components";
import { Bold, RedText } from "../../Spans";
import { Block } from "../../Block";
import { Title } from "../../Title";
import { Modal } from "../../modals/Modal";

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
                    Сдвигай плитки в любую сторону, чтобы соединять одинаковые числа.{'\n'}При соединении числа складываются, и ты получаешь баллы.
                </Text>
                <Text>
                    Каждое соединение даёт <Bold><RedText>+10</RedText> баллов</Bold>. Максимальное число на поле — 256.
                </Text>
                 <Text>
                    Продолжай собирать числа, пока на поле остаются свободные ходы. Игра длится <Bold>30 секунд</Bold>, твоя цель — набрать как можно больше баллов за это время!
                </Text>
            </Content>
        </Modal>
    )
}