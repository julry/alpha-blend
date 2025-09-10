import styled from "styled-components"
import { Title } from "../../../Title"
import { ContentBlock } from "./ContentBlock";
import { Achievement } from "../../../Achievement";
import { achievements } from "../../../../../constants/achievements";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";
import { useProgress } from "../../../../../contexts/ProgressContext";

const TitleStyled = styled(Title)`
    margin: var(--spacing_x4) 0;
    font-size: ${({ $ratio }) => $ratio * 33}px;
`;

const ContentBlockStyled = styled(ContentBlock)`
    gap: var(--spacing_x1);
`;

export const AchievementPart = () => {
    const { user } = useProgress();
    const ratio = useSizeRatio();

    return (
        <>
            <TitleStyled $ratio={ratio}>
                достижения
            </TitleStyled>
            <ContentBlockStyled $ratio={ratio}>
                {achievements.map(({ id, ...achievement }) => (
                    <Achievement key={id} isActive={user.achieves?.includes(id)} {...achievement} />
                ))}
            </ContentBlockStyled>
        </>
    )
}