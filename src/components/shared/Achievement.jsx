import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";
import { Bold } from "./Spans";
import { FlexWrapper } from "./ContentWrapper";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    padding: var(--spacing_x2);
    gap: var(--spacing_x3);
    width: 100%;
    border-radius: var(--border-radius-lg);
    background-color: white;
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${({$ratio}) => $ratio * 37}px;
    width: ${({$ratio}) => $ratio * 37}px;
    flex-shrink: 0;
    border-radius: var(--border-radius-sm);
    background-color: ${({$isActive}) => $isActive ? 'var(--color-red)' : '#B4B4B4'};
`;

const Text = styled.p`
    font-size: var(--font_xs);
    margin-top: var(--spacing_x1);
`;


export const Achievement = ({icon, title, text, isActive, ...props}) => {
    const ratio = useSizeRatio();
    return (
        <Wrapper {...props}>
            <IconWrapper $ratio={ratio} $isActive={isActive}>{icon?.()}</IconWrapper>
            <div>
                <p><Bold>{title}</Bold></p>
                <Text>{text}</Text>
            </div>
        </Wrapper>
    )   
}