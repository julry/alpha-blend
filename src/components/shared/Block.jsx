import styled from "styled-components";
import close from '../../assets/images/close.svg';
import { useSizeRatio } from "../../hooks/useSizeRatio";

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: var(--spacing_x3);
    gap: var(--spacing_x2);
    text-align: center;

    background: #EFF3FF;
    box-shadow: -12px -8px 40.7px -12px rgba(0, 0, 0, 0.35);
    /* box-shadow: -12px -8px 40.7px -12px rgba(0, 0, 0, 0.35), inset 6px 6px 8.6px rgba(255, 255, 255, 0.8), inset -6px -6px 8.6px rgba(255, 255, 255, 0.8); */
    border-radius: var(--border-radius-lg);
    padding: var(--spacing_x3);
    padding-top: ${({$hasCloseIcon}) => $hasCloseIcon ? 'var(--spacing_x6)' : 'var(--spacing_x3)'};
    color: var(--color-black);
    width: var(--content-width);
`;

const CloseIcon = styled.button`
    position: absolute;
    top: var(--spacing_x3);
    right: var(--spacing_x3);
    background: transparent;
    outline: none;
    border: none;
    width: ${({$ratio}) => $ratio * 15}px;
    height: ${({$ratio}) => $ratio * 15}px;
    background: url(${close}) no-repeat center center;
    background-size: cover;
    cursor: pointer;
`;

export const Block = ({hasCloseIcon, onClose, children, ...props}) => {
    const ratio = useSizeRatio();

    return (
        <Wrapper {...props} $hasCloseIcon={hasCloseIcon} $ratio={ratio}>
            {hasCloseIcon && <CloseIcon $ratio={ratio} onClick={onClose}/>}
            {children}
        </Wrapper>
    )
}