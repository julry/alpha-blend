import styled from "styled-components"
import { Block } from "./Block"
import { Button } from "./Button";

const BlockStyled = styled(Block)`
    position: absolute;
    bottom: calc(3 * var(--spacing_x6) + var(--font_md));
    left: 50%;
    z-index: 10000;
    transform: translateX(-50%);
    flex-direction: row;
    gap: var(--spacing_x2);
    padding: var(--spacing_x1);
    padding-left: var(--spacing_x3);
`;

const ButtonStyled = styled(Button)`
    margin-left: auto;
    width: auto;
    width: var(--spacing_x10);
    height: var(--spacing_x6);
    padding-bottom: var(--spacing_x1);
    padding-top: calc(var(--spacing_x1) * 1.5);
    font-size: var(--font_sm);
    box-shadow: 0px 0px 46.4px -3px rgba(0, 0, 0, 0.15);
`;

export const CookieInfo = ({onClose}) => (
    <BlockStyled>
        <p>Мы используем <a href="https://fut.ru/cookie" target="_blank" rel="noreferrer">куки</a></p>
        <ButtonStyled onClick={onClose}>ОК</ButtonStyled>
    </BlockStyled>
);
