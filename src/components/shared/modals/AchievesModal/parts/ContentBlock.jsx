import styled from "styled-components";

export const ContentBlock = styled.div`
    padding: var(--spacing_x2);
    gap: var(--spacing_x2);
    background: #898FA5;
    /* box-shadow: inset 0px -8px 24.8px rgba(93, 101, 129, 0.25); */
    /* box-shadow: inset 0px -8px 24.8px rgba(93, 101, 129, 0.25); */
    border-radius: var(--border-radius-lg);
    overflow: scroll;
    scrollbar-width: thin;
    scrollbar-color: #EBF0FF transparent;
    width: 100%;
    display: flex;
    flex-direction: column;
    overscroll-behavior: contain;

    &::-webkit-scrollbar {
        width: 3px;
    }

    ::-webkit-scrollbar-thumb {
        background: #EBF0FF;
        border-radius: 6px;
    }

    ::-webkit-scrollbar-track {
        border-radius: 6px;
    }
`;
