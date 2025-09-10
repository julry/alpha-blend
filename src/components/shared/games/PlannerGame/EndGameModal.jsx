import styled from "styled-components";
import { Modal } from "../../modals/Modal";
import { Title } from "../../Title";
import { Bold, RedText } from "../../Spans";
import { Block } from "../../Block";
import { Button } from "../../Button";

const ModalStyled = styled(Modal)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BlockStyled = styled(Block)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const ButtonStyled= styled(Button)`
    margin-top: auto;
    margin-bottom: var(--spacing_x6);
`;

export const EndGameModal = ({ children, isOpen, onClick, isWin }) => {
    return (
        <ModalStyled isDarken isOpen={isOpen}>
            <BlockStyled>
                <Title>
                   {isWin ? 'ОТЛИЧНО' : 'чТО-ТО НЕ ТАК!'}
                </Title>
                {children}
                {isWin ? (
                    <>
                        <p>День спланирован, и ты получаешь <RedText><Bold>10</Bold></RedText> <Bold>баллов</Bold>.</p>
                        <p><Bold>Теперь доступны другие игры —</Bold> обязательно поиграй в них, чтобы заработать больше баллов!</p>
                    </>
                ) : (
                    <>
                        <p>Кажется, ты не добавил в планнер челлендж недели.</p>
                        <p><Bold>Попробуем заново?</Bold></p>
                    </>
                )}
                
            </BlockStyled>
            <ButtonStyled onClick={onClick}>{isWin ? 'Далее' : 'Ещё раз'}</ButtonStyled>
        </ModalStyled>
    );
};
