import styled from "styled-components"
import { Title } from "../../../Title"
import { ContentBlock } from "./ContentBlock";
import { Achievement } from "./Achievement";
import { achievements } from "../../../../../constants/achievements";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";

const TitleStyled = styled(Title)`
    margin: var(--spacing_x6) 0;
    font-size: ${({ $ratio }) => $ratio * 33}px;
`;

const ContentBlockStyled = styled(ContentBlock)`
    gap: var(--spacing_x1);
`;

export const AchievementPart = ({ openedAchievements = [] }) => {
    const ratio = useSizeRatio();

    return (
        <>
            <TitleStyled $ratio={ratio}>
                достижения
            </TitleStyled>
            <ContentBlockStyled $ratio={ratio}>
                {achievements.map(({ id, ...achievement }) => (
                    <Achievement key={id} isActive={openedAchievements.includes(id)} {...achievement} />
                ))}
            </ContentBlockStyled>
        </>
    )
}