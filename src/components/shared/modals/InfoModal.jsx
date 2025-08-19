import styled from "styled-components";
import { useState } from "react";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { Block } from "../Block";
import { Modal } from "./Modal";
import { Title } from "../Title";

const Content = styled(Block)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    flex-direction: row;
    justify-content: center;
`;

const TitleStyled = styled(Title)`
    margin-bottom: var(--spacing_x3);
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
    margin: var(--spacing_x5) auto 0;
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

export const InfoModal = ({ isOpen, initialPart, onClose }) => {
    const ratio = useSizeRatio();
    const [part, setPart] = useState(initialPart ?? 0);
    const amount = 5;
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
                        <TitleStyled>
                            Общая{ '\n' }информация
                        </TitleStyled>
                        <Text>
                            В течение <Bold>четырёх недель</Bold> тебя ждут игры, задания, полезные лайфхаки и идеи для перезагрузки. От бодрящих рецептов до ежедневных мини-челленджей — всё, чтобы прокачать work-life баланс.
                            <br />
                            <br />
                            Выполняй активности, зарабатывай баллы и повышай шанс <Bold>выиграть крутые призы!</Bold>
                            <br />
                            <br />
                            Новые задания выходят по <Bold>понедельникам, средам и пятницам</Bold> — проходи их в день выхода и получай больше баллов.
                        </Text>
                    </>
                )
            case 1:
                return (
                    <>
                        <TitleStyled>
                            Баллы
                        </TitleStyled>
                        <Text>
                            <Bold>Зарабатывай баллы</Bold> разными способами: выполняй задания, проходи игры, приглашай друзей.
                            <br />
                            <br />
                            Чем их больше — тем <Bold>выше твои шансы на приз!</Bold>
                        </Text>
                    </>
                );
            case 2:
                return (
                    <>
                        <TitleStyled>
                            Планнер
                        </TitleStyled>
                        <Text>
                            <Bold>Распредели 15 карточек</Bold> с делами по утру, дню и вечеру — в каждый блок можно положить до 3. Не забудь про <Bold>челлендж недели</Bold> — он даёт дополнительные баллы!
                            <br />
                            <br />
                            После размещения карточки закрепятся. Баллы начисляются <Bold>за каждую карточку</Bold> и <Bold>за полностью собранный день</Bold>. После планирования переходи к другим играм.
                        </Text>
                    </>
                );
            case 3:
                return (
                    <>
                        <TitleStyled>
                            Челлендж недели
                        </TitleStyled>
                        <Text>
                            Каждую неделю появляется челлендж недели — особая игра, связанная с темой этих дней. Следи за обновлениями — каждую неделю формат челленджа будет меняться!
                        </Text>
                    </>
                )
            case 4:
                return (
                    <>
                        <TitleStyled>
                            Блендер
                        </TitleStyled>
                        <Text>
                            В игре три раунда. Тебе нужно быстро готовить напитки для гостей, собирая нужные ингредиенты в блендер.
                            <br />
                            <br />
                            Напитки отображаются в пузырьках над гостями — внутри указаны ингредиенты и таймер ожидания. Чем быстрее соберёшь и подашь напиток, тем больше баллов получишь.
                            <br />
                            <br />
                            Ошибся — убери лишний ингредиент и замени его. После трёх раундов игра закончится.
                        </Text>
                    </>
                )
            default: break;
        }
    }

    return (
        <Modal isDisabledAnimation isOpen={isOpen}>
            <Content hasCloseIcon onClose={onClose}>
                <div style={{height: '100%'}}>
                    <ArrowButton onClick={ handlePrev }>
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 1.5L6 9.5L14 17.5" stroke="#263D8D" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </ArrowButton>
                </div>
                <div>
                    { getContent() }
                    <ProgressWrapper $ratio={ ratio }>
                        { progress.map((p) => (
                            <ProgressCircle key={ p } $isActive={ p === part } />
                        )) }
                    </ProgressWrapper>
                </div>
                <ArrowButtonRight onClick={ handleNext }>
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 17.5L14 9.5L6 1.5" stroke="#263D8D" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </ArrowButtonRight>
            </Content>
        </Modal>
    )
}