import styled from "styled-components";
import { Modal } from "./Modal";
import { Block } from "../Block";
import { Button } from "../Button";
import { CollegueMessage } from "../CollegueMessage";

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

const CollegueBlock = styled(CollegueMessage)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const ButtonStyled = styled(Button)`
    margin-top: auto;
    margin-bottom: var(--spacing_x6);
`;


export const CommonModal = ({ isOpen, onClose, children, isCollegue, isDisabledAnimation, isDarken = true, btnText = 'Далее', ...props }) => {
    const Content = isCollegue ? CollegueBlock : BlockStyled;

    return (
        <ModalStyled isDarken={isDarken} isDisabledAnimation={isDisabledAnimation} isOpen={isOpen} {...props}>
            <Content>
                {children}
            </Content>
            <ButtonStyled onClick={onClose}>{btnText}</ButtonStyled>
        </ModalStyled>
    )
}