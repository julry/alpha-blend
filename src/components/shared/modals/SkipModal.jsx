import styled from "styled-components";
import { Modal } from "./Modal";
import { Block } from "../Block";
import { Button } from "../Button";
import { Bold } from "../Spans";

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


export const SkipModal = ({ isOpen, onClose, onExit }) => (
    <ModalStyled isDarken isOpen={isOpen}>
        <BlockStyled>
            <p><Bold>Ты точно хочешь выйти?</Bold></p>
        </BlockStyled>
        <ButtonWrapper>
            <Button onClick={onClose}>Продолжить</Button>
            <Button type="secondary" onClick={onExit}>Выйти</Button>
        </ButtonWrapper>
    </ModalStyled>
);
