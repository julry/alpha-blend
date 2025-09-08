import styled from "styled-components";
import { PlanCard } from "./PlanCard";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { motion } from "framer-motion";

const Wrapper = styled(motion.div)`
    position: absolute;
    bottom: calc(100% + var(--spacing_x3));
    left: 50%;
    background-color: white;
    padding: ${({ $ratio }) => $ratio * 4}px;
    padding-right: ${({ $ratio }) => $ratio * 12}px;
    border-radius: var(--border-radius-sm);
`;

const TimeLine = styled(motion.div)`
    position: absolute;
    bottom: ${({ $ratio }) => $ratio * 4}px;
    right: ${({ $ratio }) => $ratio * 4}px;
    width: ${({ $ratio }) => $ratio * 4}px;
    background: ${({ $color }) => $color};
    border-radius: 100px;
    transition-property: height, background-color;
    transition-duration: 100ms, 300ms;
`;

const CardStyled = styled(PlanCard)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({ $ratio }) => $ratio * 34}px;
    height: ${({ $ratio }) => $ratio * 34}px;
    padding: ${({ $ratio }) => $ratio * 1}px;

    & + & {
        margin-top: ${({ $ratio }) => $ratio * 4}px;
    }

    & img {
        object-fit: cover;

        width: ${({ $ratio }) => $ratio * 46}px;
        height: ${({ $ratio }) => $ratio * 46}px;
    }
`;


export const Info = ({ingridients, controlsInfo, controls, className}) => {
    const ratio = useSizeRatio();
    return (
        <Wrapper className={className} initial={{ translateX: '-50%', rotate: 0 }} $ratio={ratio} animate={controlsInfo}>
            <div>
                {ingridients.map((card) => (
                    <CardStyled key={`key_${card}`} $ratio={ratio} card={{id: card}} />
                ))}
            </div>
            <TimeLine
                $ratio={ratio}
                initial={{ height: `calc(100% - ${ratio * 8}px)` }}
                animate={controls}
                transition={{ duration: 0.1 }}
            />
        </Wrapper>
    )
}