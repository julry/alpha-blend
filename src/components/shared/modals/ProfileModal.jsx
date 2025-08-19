import styled from "styled-components";
import { useProgress } from "../../../contexts/ProgressContext";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { Block } from "../Block";
import { Modal } from "./Modal";
import { PersonIcon } from "../svg/PersonIcon";
import { useState } from "react";

const Content = styled(Block)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    align-items: flex-start;
    text-align: left;
`;

const Subtitle = styled.h4`
    font-size: var(--font_sm);
    font-weight: 300;
`;

const Text = styled.p`
    font-size: var(--font_md);
    font-weight: 500;
`;

const InfoBlock = styled.div`
    margin-top: var(--spacing_x2);
`

const FlexBlock = styled.div`
    display: flex;
    align-items: center;
`;

const PointsWrapper = styled(FlexBlock)`
    margin: var(--spacing_x2) 0;
    justify-content: space-between;
    gap: var(--spacing_x7);
`;

const PointsInfo = styled.p`
    font-weight: 700;
    color: var(--color-red);
    font-size: ${({$ratio}) => $ratio * 30}px;
    margin-right: var(--spacing_x1);
`;

const ProfileWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({$ratio}) => $ratio * 31}px;
    height: ${({$ratio}) => $ratio * 31}px;
    margin-right: var(--spacing_x1);
    border-radius: var(--border-radius-sm);
    background-color: var(--color-red);

    & svg {
        width: ${({$ratio}) => $ratio * 20}px;
        height: ${({$ratio}) => $ratio * 20}px;
    }
`;

const RefSign = styled.div`
    text-align: center;
    background: var(--color-white);
    color: rgba(38, 61, 141, 0.3);
    font-size: var(--font_sm);
    border-radius: 50%;
    margin-left: var(--spacing_x2);
    cursor: pointer;
    padding-top: ${({$ratio}) => $ratio * 1}px;
    width: ${({$ratio}) => $ratio * 18}px;
    height: ${({$ratio}) => $ratio * 18}px;
`;

const InfoModalBlock = styled(Block)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const RefBlock = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing_x2);
    gap: var(--spacing_x2);

    background: #FFFFFF;
    border-radius: var(--border-radius-sm);

    & svg {
        width: var(--spacing_x4);
        height: var(--spacing_x4);
    }
`;

const CopyButton = styled.button`
    outline: none;
    border: none;
    background: none;

    display: flex;
    justify-content: center;
    align-items: center;
`;

const SmallText = styled.p`
    font-weight: 300;
    margin-right: var(--spacing_x1);
    font-size: var(--font_xs);
`;

export const ProfileModal = ({isOpen, ...props}) => {
    const [isRefInfoModal, setIsRefInfoModal] = useState(false);
    const [isSuccessCopy, setIsSuccessCopy] = useState(false);
    const ratio = useSizeRatio();
    const { user, currentWeek } = useProgress();

    const handleCopy = () => {
        const link = new URL(window.location.origin);
        link.searchParams.set('refId', `ref_${user.id}`);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(link.toString()).then(() => {
                setIsSuccessCopy(true);

                setTimeout(() => setIsSuccessCopy(false), 3000);
            });
        }
    };

    return (
        <Modal isDarken isOpen={isOpen}>
            <Content onClose={props.onClose} hasCloseIcon>
                <FlexBlock>
                    <ProfileWrapper $ratio={ratio}>
                        <PersonIcon />
                    </ProfileWrapper>
                    <Text>ID {user.id}</Text>
                </FlexBlock>
                <InfoBlock>
                    <Subtitle>Имя Фамилия</Subtitle>
                    <Text>{user.name}</Text>
                </InfoBlock>
                <InfoBlock>
                    <Subtitle>Почта</Subtitle>
                    <Text>{user.email}</Text>
                </InfoBlock>
                {user.university && (
                    <InfoBlock>
                        <Subtitle>Факультет</Subtitle>
                        <Text>{user.university}</Text>
                    </InfoBlock>
                )}
                <PointsWrapper>
                    {user.isVip && (
                        <FlexBlock>
                            <PointsInfo $ratio={ratio}>{user[`week${currentWeek}Points`]}</PointsInfo>
                            <Subtitle>Баллов{'\n'}за неделю</Subtitle>
                        </FlexBlock>
                    )}
                    <FlexBlock>
                        <PointsInfo $ratio={ratio}>{user.points}</PointsInfo>
                        <Subtitle>Баллов{'\n'}за все время</Subtitle>
                    </FlexBlock>
                </PointsWrapper>
                <FlexBlock>
                    <Subtitle>Реферальная ссылка</Subtitle>
                    <RefSign $ratio={ratio} onClick={() => setIsRefInfoModal(true)}>?</RefSign>
                </FlexBlock>
                <RefBlock $ratio={ratio}>
                    <p>ref_{user.id}</p>
                    {
                        isSuccessCopy ? 
                        <FlexBlock>
                            <SmallText>Скопировано</SmallText>
                            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 10L7.5 14.5L17 5" stroke="#2DE500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </FlexBlock>
                         : (
                            <CopyButton onClick={handleCopy}>
                                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.5 13H4V4H13V5.5" stroke="#263D8D" stroke-opacity="0.3"/>
                                    <rect x="8" y="7" width="9" height="9" stroke="#263D8D" stroke-opacity="0.3"/>
                                </svg>
                            </CopyButton>
                        )
                    }
                </RefBlock>
            </Content>
            {isRefInfoModal && (
                <Modal isDarken>
                    <InfoModalBlock onClose={() => setIsRefInfoModal(false)} hasCloseIcon>
                        <p>
                            Скопируй реферальную ссылку и отправляй друзьям, чтобы получить дополнительные баллы!
                        </p>
                    </InfoModalBlock>
                </Modal>
            )}
        </Modal>
    )
}