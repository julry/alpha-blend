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
                    Соединяй одинаковые плитки и зарабатывай очки.
                </Text>
                <Text>
                    Каждое соединение — это 
                </Text>
                 <Text>
                    Если соберёшь плитку 256, она исчезнет, а ты получишь <RedText>+15</RedText> <Bold>бонусных баллов</Bold>
                </Text>
                <Text>
                    Игра длится 1 минуту 30 секунд. Успеешь набрать 250 баллов — получишь ещё <RedText>+10</RedText> <Bold>в конце</Bold>!
                </Text>
                <Text>
                    Каждая игра тратит одно сердце. Когда попытки закончатся, возвращайся позже — будут новые задания и игры.
                </Text>
            </Content>
        </Modal>
    )
}