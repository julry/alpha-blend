import styled from "styled-components";
import { Block } from "./Block";
import avatar from '../../assets/images/collegue.png';
import { Bold } from "./Spans";

const BlockStyled = styled(Block)`
    align-items: flex-start;
    text-align: left;
`;

const InfoBlock = styled.div`
    display: flex;
    align-items: center;
    gap: var(--spacing_x2);
    margin-bottom: var(--spacing_x2);
`;

const Avatar = styled.div`
    width: var(--spacing_x6);
    height: var(--spacing_x6);
    border-radius: 50%;
    background: url(${avatar}) center center no-repeat;
    background-size: contain;
`;

const SubTitle = styled.p`
    font-size: var(--font_sm);
`;

export const CollegueMessage = (props) => (
    <BlockStyled {...props}>
        <InfoBlock>
            <Avatar />
            <div>
                <SubTitle>От кого:</SubTitle>
                <p><Bold>Коллега</Bold></p>
            </div>
        </InfoBlock>
        {props.children}
    </BlockStyled>
)