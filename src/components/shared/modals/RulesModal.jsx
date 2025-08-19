import { useState } from "react"
import styled from "styled-components";
import { Block } from "../Block";
import { Modal } from "./Modal";
import { Button } from "../Button";
import { InfoModal } from "./InfoModal";
import { Title } from "../Title";

const Content = styled(Block)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: ${({$isOpen}) => $isOpen ? 0 : 1};
    transition: opacity 150ms;
`;

const TitleStyled = styled(Title)`
    margin-bottom: var(--spacing_x3);
`;


export const RulesModal = ({ onClose, isOpen }) => {
    const [openedPart, setOpenedPart] = useState();

    return (
        <Modal isDarken isOpen={isOpen}>
            <Content hasCloseIcon onClose={onClose} $isOpen={openedPart !== undefined}>
                <TitleStyled>ПРАВИЛА</TitleStyled>
                <Button onClick={() => setOpenedPart(0)}>Общая информация</Button>
                <Button onClick={() => setOpenedPart(1)}>Баллы</Button>
                <Button onClick={() => setOpenedPart(2)}>Планнер</Button>
                <Button onClick={() => setOpenedPart(3)}>Челлендж недели</Button>
                <Button onClick={() => setOpenedPart(4)}>Блендер</Button>
            </Content>
            {
                openedPart !== undefined && (
                    <InfoModal initialPart={openedPart} onClose={() => setOpenedPart()}/>
                )
            }
        </Modal>
    )
}