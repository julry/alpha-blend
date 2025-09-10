import styled from "styled-components";
import { Modal } from "./Modal";
import { Button } from "../Button";

const ModalStyled = styled(Modal)`
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: var(--spacing_x6);
`;

export const StartGameModal = ({isOpen, onClose}) => (
    <ModalStyled isDarken isOpen={isOpen}>
        <Button onClick={onClose}>Играть</Button>
    </ModalStyled>
)