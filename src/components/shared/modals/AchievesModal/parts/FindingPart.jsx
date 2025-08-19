import styled from "styled-components"
import { Title } from "../../../Title"
import { ContentBlock } from "./ContentBlock";
import { useState } from "react";
import { findings } from "../../../../../constants/findings";
import { FindingModal } from "../../FindingModal";
import { Finding } from "./FindingDetail";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";

const TitleStyled = styled(Title)`
    margin: var(--spacing_x6) 0;
    font-size: ${({ $ratio }) => $ratio * 33}px;
`;

const ContentBlockStyled = styled(ContentBlock)`
    gap: var(--spacing_x1);
`;

export const FindingPart = ({openedFindings}) => {
    const ratio = useSizeRatio();
    const [openedFinding, setOpenedFinding] = useState();
    return (
        <>
            <TitleStyled $ratio={ratio}>
                Находки
            </TitleStyled>
            <ContentBlockStyled>
                {openedFindings.map((id) => (
                    <Finding key={id} onClick={() => setOpenedFinding(id)}>
                        {findings.find((hack) => hack.id === id)?.title}
                    </Finding>
                ))}
            </ContentBlockStyled>

            {openedFinding !== undefined && (
                <FindingModal onClose={() => setOpenedFinding()} id={openedFinding} />
            )}
        </>
    )
}