import styled from "styled-components"
import { Title } from "../../../Title"
import { ContentBlock } from "./ContentBlock";
import { useState } from "react";
import { findings } from "../../../../../constants/findings";
import { FindingModal } from "../../FindingModal";
import { Finding } from "./FindingDetail";
import { useSizeRatio } from "../../../../../hooks/useSizeRatio";
import { Block } from "../../../Block";

const TitleStyled = styled(Title)`
    margin: var(--spacing_x4) 0;
    font-size: ${({ $ratio }) => $ratio * 33}px;
`;

const ContentBlockStyled = styled(ContentBlock)`
    gap: var(--spacing_x1);
`;

const FindingBlock = styled(Block)`
    background-color: white;
    box-shadow: none;
    max-width: 100%;
    text-align: left;
    font-size: var(--font_sm);
`;

const FindingTitle = styled(Title)`
    font-size: var(--font_sm);
    text-align: left;
    width: 100%;
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
                    id === openedFinding ? (
                        <FindingBlock>
                            <FindingTitle>
                                {findings.find((hack) => hack.id === openedFinding)?.title}
                            </FindingTitle>
                            { findings.find((hack) => hack.id === openedFinding)?.text()}
                        </FindingBlock>
                    ) : (
                        <Finding key={id} onClick={() => setOpenedFinding(id)}>
                            {findings.find((hack) => hack.id === id)?.title}
                        </Finding>
                    )
                ))}
            </ContentBlockStyled>

            {openedFinding !== undefined && (
                <FindingModal onClose={() => setOpenedFinding()} id={openedFinding} />
            )}
        </>
    )
}