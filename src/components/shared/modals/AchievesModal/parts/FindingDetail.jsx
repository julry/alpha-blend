import styled from "styled-components";

const Wrapper = styled.div`
    padding: var(--spacing_x4) var(--spacing_x3);
    width: 100%;

    background: var(--color-red);
    box-shadow: 0px 0px 46.4px -3px rgba(0, 0, 0, 0.15);
    /* box-shadow: 0px 0px 46.4px -3px rgba(0, 0, 0, 0.15), inset 2px 2px 8.6px rgba(255, 255, 255, 0.15), inset 1.06858px 1px 4.3px rgba(255, 255, 255, 0.15); */
    border-radius: var(--border-radius-lg);

    font-size: var(--font_sm);
    text-transform: uppercase;
    color: white;
    font-weight: 900;
`;

export const Finding = (props) => <Wrapper {...props} />