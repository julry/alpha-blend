import styled from "styled-components";
import { Modal } from "./Modal";
import { Block } from "../Block";
import { Button } from "../Button";
import { Title } from "../Title";

const ModalStyled = styled(Modal)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BlockStyled = styled(Block)`
    position: absolute;
    top: calc(50% - 2 * var(--spacing_x7));
    left: 50%;
    transform: translate(-50%, -50%);
`;

const ButtonWrapper= styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing_x4);
    width: 100%;
    margin-top: auto;
    padding-bottom: var(--spacing_x6);
`;


export const SkipModal = ({ isOpen, onClose, onExit }) => {
    return (
        <ModalStyled isDarken isOpen={isOpen}>
            <BlockStyled>
                <Title>
                    Уходишь?
                </Title>
                <p>Если ты сейчас выйдешь, ты потеряешь весь прогресс</p>
            </BlockStyled>
            <ButtonWrapper>
                <Button onClick={onClose}>Остаться</Button>
                <Button type="secondary" onClick={onExit}>В комнату</Button>
            </ButtonWrapper>
        </ModalStyled>
    );
};
