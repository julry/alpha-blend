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
                    Перед тобой 15 карточек с делами. Перетаскивай их в каждый блок — утро, день и вечер. В каждую часть дня можно поставить до 3 карточек. Как только перетащишь карточку, она «закрепится» и переместить её будет нельзя.
                </Text>
                <Text>
                    За каждую <Bold>—</Bold> <RedText>+5</RedText> <Bold>баллов</Bold>
                </Text>
                 <Text>
                    Не забудь добавить челлендж недели <Bold>— он даёт</Bold> <RedText>+10</RedText>!
                </Text>
                 <Text>
                    Когда день будет готов — <RedText>+15</RedText> <Bold>бонусных баллов</Bold>
                </Text>
            </Content>
        </Modal>
    )
}