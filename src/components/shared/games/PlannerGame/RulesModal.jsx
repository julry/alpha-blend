import styled from "styled-components";
import { Bold, RedText } from "../../Spans";
import { Block } from "../../Block";
import { Title } from "../../Title";
import { Modal } from "../../modals";

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
                    Перед тобой <Bold>12 карточек</Bold> с делами. Всего 3 блока — утро, день и вечер. Чтобы поставить карточку, нажми сначала на неё, потом на нужное поле.
                </Text>
                <p>
                    Обязательно добавь в планнер челлендж недели. В конце нажми кнопку «Запланировать», чтобы получить <Bold><RedText>+10</RedText> баллов.</Bold>
                </p>
            </Content>
        </Modal>
    )
}