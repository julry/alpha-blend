import styled from "styled-components";
import { useSizeRatio } from "../../hooks/useSizeRatio";

const Wrapper = styled.input`
    padding: var(--spacing_x2) var(--spacing_x4);
    font-size: var(--font_md);
    font-weight: 500;
    outline: none;
    border: none;
    border-radius: var(--border-radius-sm);
    background: var(--color-white);
    width: 100%;

    &::placeholder {
        color: var(--color-gray);
    }
`;

export const Input = (props) => {
    const ratio = useSizeRatio();

    return <Wrapper {...props} $ratio={ratio} />
}