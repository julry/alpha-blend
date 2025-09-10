import styled from "styled-components";
import { CURRENT_WEEK, useProgress } from "../../../contexts/ProgressContext";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { Block } from "../Block";
import { Modal } from "./Modal";
import { memo, useCallback, useState } from "react";

const Content = styled(Block)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    align-items: flex-start;
    text-align: left;
`;

const Subtitle = styled.h4`
    font-size: var(--font_md);
    font-weight: 500;
    margin-bottom: var(--spacing_x1);
`;

const Text = styled.p`
    font-size: var(--font_sm);
    line-height: 100%;

    & + & {
        margin-top: var(--spacing_x1);
    }
`;

const InfoBlock = styled.div`
    margin-top: var(--spacing_x2);
`

const FlexBlock = styled.div`
    display: flex;
    align-items: center;
`;

const PointsWrapper = styled(FlexBlock)`
    margin: var(--spacing_x1) 0;
    justify-content: space-between;
    gap: var(--spacing_x7);
`;

const PointsInfo = styled.p`
    font-weight: 700;
    font-size: ${({$ratio}) => $ratio * 30}px;
    margin-right: var(--spacing_x1);
    line-height: 90%;
    margin-top: calc(1.5 * var(--spacing_x1));
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

    & > p:first-child {
        font-weight: 500;
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
    font-size: var(--font_xxs);
`;


const RefDesc = styled.div`
    margin-bottom: var(--spacing_x1);
`;

export const ProfileModal = memo(({isOpen, ...props}) => {
    const [isSuccessCopy, setIsSuccessCopy] = useState(false);
    const ratio = useSizeRatio();
    const { user, totalPoints, tgInfo } = useProgress();

    const handleCopy = useCallback(() => {
        if (!tgInfo.current.tgInitBotName || !tgInfo.current.tgUserId) return;
        const link = `https://t.me/${tgInfo.current.tgInitBotName}?start=ref${tgInfo.current.tgUserId}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(link.toString()).then(() => {
                setIsSuccessCopy(true);

                setTimeout(() => setIsSuccessCopy(false), 3000);
            });
        }
    }, []);

    return (
        <Modal isDarken isOpen={isOpen}>
            <Content onClose={props.onClose} hasCloseIcon>
                <FlexBlock>
                    <ProfileWrapper $ratio={ratio}>
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5 11.3333C12.8012 11.3333 14.6666 9.46785 14.6666 7.16667C14.6666 4.86548 12.8012 3 10.5 3C8.19879 3 6.33331 4.86548 6.33331 7.16667C6.33331 9.46785 8.19879 11.3333 10.5 11.3333ZM10.5 11.3333C12.2681 11.3333 13.9638 12.0357 15.214 13.286C16.4643 14.5362 17.1666 16.2319 17.1666 18M10.5 11.3333C8.73187 11.3333 7.03618 12.0357 5.78593 13.286C4.53569 14.5362 3.83331 16.2319 3.83331 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </ProfileWrapper>
                    <Subtitle>ID {user.id}</Subtitle>
                </FlexBlock>
                <InfoBlock>
                    <Subtitle>Имя Фамилия</Subtitle>
                    <Text>{user.name}</Text>
                </InfoBlock>
                <InfoBlock>
                    <Subtitle>Почта</Subtitle>
                    <Text>{user.email}</Text>
                </InfoBlock>
                {user.isTargeted && (
                    <InfoBlock>
                        <Subtitle>Вуз и факультет</Subtitle>
                        <Text>{user.university}</Text>
                        {user.faculty && (<Text>{user.faculty}</Text>)}
                    </InfoBlock>
                )}
                <PointsWrapper>
                    {user.isTargeted && (
                        <FlexBlock>
                            <PointsInfo $ratio={ratio}>{user[`week${CURRENT_WEEK}Points`] ?? 0}</PointsInfo>
                            <Text>Баллы{'\n'}за неделю</Text>
                        </FlexBlock>
                    )}
                    <FlexBlock>
                        <PointsInfo $ratio={ratio}>{totalPoints ?? 0}</PointsInfo>
                        <Text>Баллы{'\n'}за все время</Text>
                    </FlexBlock>
                </PointsWrapper>
                <RefDesc>
                    <Subtitle>Реферальная ссылка</Subtitle>
                    <SmallText>Скопируй и отправляй друзьям,{'\n'}чтобы получить дополнительные баллы!</SmallText>
                </RefDesc>
                <RefBlock $ratio={ratio}>
                    <p>ref_link_{tgInfo.current.tgUserId}</p>
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
                                    <path d="M6.5 13H4V4H13V5.5" stroke="#263D8D" strokeOpacity="0.3"/>
                                    <rect x="8" y="7" width="9" height="9" stroke="#263D8D" strokeOpacity="0.3"/>
                                </svg>
                            </CopyButton>
                        )
                    }
                </RefBlock>
            </Content>
        </Modal>
    )
});
