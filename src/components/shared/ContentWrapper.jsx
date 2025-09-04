import styled from "styled-components";

export const ContentWrapper = styled.div`
    position: relative;
    width: 100%;
    min-width: 100%;
    height: 100%;
    min-height: 100%;
    padding: var(--spacing_x4) var(--spacing_x2) var(--spacing_x6);
`;

export const FlexWrapper = styled(ContentWrapper)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;