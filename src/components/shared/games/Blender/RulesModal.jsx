import styled from "styled-components";
import { useState } from "react";
import { Block } from "../../Block";
import { Title } from "../../Title";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { Modal } from "../../modals";
import { Li } from "../../Li";
import { RedText } from "../../Spans";

const Content = styled(Block)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    flex-direction: row;
    justify-content: center;

    & li {
        font-size: var(--font_sm);
        text-align: left;
    }
`;

const TitleStyled = styled(Title)`
    margin-bottom: var(--spacing_x1);
`;

const Text = styled.p`
    font-size: var(--font_sm);
    font-weight: 300;
`;

const Bold = styled.span`
    font-weight: 500;
`;

const ProgressWrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    max-width: ${({ $ratio }) => $ratio * 106}px;
    margin: var(--spacing_x3) auto 0;
`;

const ProgressCircle = styled.div`
    width: var(--spacing_x2);
    height: var(--spacing_x2);
    border-radius: 50%;
    background-color: var(--color-${({ $isActive }) => $isActive ? 'red' : 'white'});
    transition: background-color 0.2s;

    & + & {
        margin-left: calc(var(--spacing_x3) - 1px);
    }
`;

const ArrowButton = styled.button`
    outline: none;
    border: none;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    & svg {
        width: var(--spacing_x4);
        height: var(--spacing_x4);
    }
`;

const ArrowButtonRight = styled(ArrowButton)`
    justify-content: flex-end;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--spacing_x2);
`;

export const RulesModal = ({ isOpen, initialPart, onClose }) => {
    const ratio = useSizeRatio();
    const [part, setPart] = useState(initialPart ?? 0);
    const amount = 2;
    const progress = Array.from({ length: amount }, (_, i) => i);

    const handleNext = () => {
        setPart(prev => prev + 1 >= amount ? 0 : prev + 1);
    }

    const handlePrev = () => {
        setPart(prev => prev - 1 >= 0 ? prev - 1 : amount - 1);
    }

    const getContent = () => {
        switch (part) {
            case 0:
                return (
                    <>
                        <Text>
                            Ты встречаешь друзей, каждому нужен свой напиток. <Bold>Успей помочь им найти баланс!</Bold>
                        </Text>
                        <ul>
                            <Li>В игре <Bold><RedText>1 </RedText>раунд  —</Bold> в него приходят несколько гостей</Li>
                            <Li>У каждого гостя над головой появляется рецепт и таймер на <Bold><RedText>15 </RedText>секунд</Bold></Li>
                            <Li>Напиток готовится в блендере за 2 секунды после нажатия на кнопку</Li>
                            <Li>За правильный заказ ты получаешь <Bold><RedText>+10 </RedText>баллов</Bold></Li>
                        </ul>
                    </>
                )
            case 1:
                return (
                    <ul>
                            <Li>Если напиток не подошёл гостю, его можно оставить на столе и отдать другому</Li>
                            <Li>На столе помещается не больше 3 напитков, если никакой из них не подойдет другу, ты теряешь попытку</Li>
                            <Li>Ошибка в рецепте сбрасывает ингредиенты</Li>
                            <Li>Если время ожидания истечёт, гость уйдёт, и баллы не начислятся</Li>
                            <Li>У тебя есть <Bold><RedText>3</RedText> попытки</Bold> на прохождение игры</Li>
                    </ul>
                );
            default:
                break;
        }
    }

    return (
        <Modal isOpen={isOpen} isDarken>
            <Content hasCloseIcon onClose={onClose}>
                <div style={{ height: '100%' }}>
                    <ArrowButton onClick={handlePrev}>
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 1.5L6 9.5L14 17.5" stroke="#263D8D" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </ArrowButton>
                </div>
                <ContentWrapper>
                    <TitleStyled>{part === 0 ? 'как играть?' : 'Важно'}</TitleStyled>
                    {getContent()}
                    <ProgressWrapper $ratio={ratio}>
                        {progress.map((p) => (
                            <ProgressCircle key={p} $isActive={p === part} />
                        ))}
                    </ProgressWrapper>
                </ContentWrapper>
                <ArrowButtonRight onClick={handleNext}>
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 17.5L14 9.5L6 1.5" stroke="#263D8D" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </ArrowButtonRight>
            </Content>
        </Modal>
    )
}