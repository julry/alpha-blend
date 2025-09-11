import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion";
import { Achievement } from "../Achievement";
import { achievements } from "../../../constants/achievements";
import { useEffect, useRef } from "react";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { Block } from "../Block";

const ModalStyled = styled(motion.div)`
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 23123;
    height: auto;
    padding-top: var(--spacing_x8);
    transform-origin: 50% 50%;
`;

const Achieve = styled(Achievement)`
    background: transparent;
    padding: 0;
    width: 100%;
`;

const CloseIcon = styled.button`
    margin-left: auto;
    background-color: transparent;
    width: ${({ $ratio }) => $ratio * 12}px;
    height: ${({ $ratio }) => $ratio * 12}px;
    min-height: ${({ $ratio }) => $ratio * 12}px;
    flex-shrink: 0;

    & svg {
        width: ${({ $ratio }) => $ratio * 12}px;
        height: ${({ $ratio }) => $ratio * 12}px;
    }
`;

const BlockStyled = styled(Block)`
    margin: 0 auto;
    padding: var(--spacing_x2) var(--spacing_x4);
    gap: 0;
    text-align: left;
`;

export const NewAchieveModal = ({ onClose, isOpen, achieveId }) => {
    const timeoutRef = useRef();
    const ratio = useSizeRatio();

    useEffect(() => {
        timeoutRef.current = setTimeout(() => onClose(), 8000);

        return (() => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = undefined;
            }
        })
    }, []);

    const achieve = achievements.find(({ id }) => achieveId === id);

    return (
        <AnimatePresence>
            {isOpen && (
                <ModalStyled
                    initial={{ scale: 0, translateX: '-50%' }}
                    animate={{ scale: 1, translateX: '-50%' }}
                    exit={{ scale: 0, translateX: '-50%' }}
                >
                    <BlockStyled>
                        <CloseIcon $ratio={ratio} onClick={onClose}>
                            <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_1368_5218)">
                                    <path d="M1.47089 1.471L10.5291 10.5292M10.5291 1.471L1.47089 10.5292" stroke="#263D8D" strokeOpacity="0.3" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1368_5218">
                                        <rect width="12" height="12" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </CloseIcon>
                        <Achieve {...achieve} onClose={onClose} isActive />
                    </BlockStyled>
                </ModalStyled>
            )}
        </AnimatePresence>
    )
}