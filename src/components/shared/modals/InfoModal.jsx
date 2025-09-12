import styled from "styled-components";
import { useState } from "react";
import { useSizeRatio } from "../../../hooks/useSizeRatio";
import { Block } from "../Block";
import { Modal } from "./Modal";
import { Title } from "../Title";
import { Bold } from "../Spans";
import { useProgress } from "../../../contexts/ProgressContext";
import { Li } from "../Li";

const Content = styled(Block)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    flex-direction: row;
    justify-content: center;
`;

const TitleStyled = styled(Title)`
    margin-bottom: var(--spacing_x2);
    margin-top: var(--spacing_x2);
`;

const Text = styled.p`
    font-size: var(--font_xs);
    font-weight: 300;
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

const BackButton = styled.button`
    position: absolute;
    top: var(--spacing_x3);
    left: var(--spacing_x3);
    margin-right: auto;
    background-color: transparent;


    & svg {
        width: ${({$ratio}) => $ratio * 18}px;
        height: ${({$ratio}) => $ratio * 12}px;
    }
`;

const PointsWrapper = styled.div`
    overflow: auto;
    max-height: ${({$ratio}) => $ratio * 450}px;
    text-align: left;
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

const UlStyled = styled.ul`
    text-align: left;
    margin: var(--spacing_x2) 0;

    li {
        font-size: var(--font_xs);
        margin-left: var(--spacing_x4);
    }
`;

const PointsSubtitle = styled.p`
    text-align: center;
    font-weight: 500;
    font-size: var(--font_xs);
`;

const BrStyled = styled.div`
    height: var(--spacing_x3);
`;

export const InfoModal = ({ isOpen, initialPart, onClose }) => {
    const ratio = useSizeRatio();
    const {user} = useProgress();
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
                            В течение <Bold>четырёх недель</Bold> тебя ждут игры, задания, полезные лайфхаки и идеи для перезагрузки. От бодрящих рецептов до ежедневных мини-челленджей — всё, чтобы прокачать баланс работы и жизни.
                            <br />
                            <br />
                            Выполняй активности и зарабатывай баллы, чтобы принять участие <Bold>в розыгрыше крутых призов!</Bold>
                            <br />
                            <br />
                            Новые задания выходят по <Bold>понедельникам, средам и пятницам</Bold> — проходи их в день выхода и получай больше баллов.
                        </Text>
                    </>
                )
            case 1:
                return (
                    <>
                        <TitleStyled>
                            Баллы
                        </TitleStyled>
                        {
                           user.isTargeted ? (
                                <PointsWrapper $ratio={ratio}>
                                    <Text><Bold>Играя, ты зарабатываешь баллы</Bold> для участия в розыгрышах.{'\n'}Всего за игру мы проведём 5 розыгрышей — по одному в конце каждой недели и финальный розыгрыш супер-приза в конце. </Text>
                                    <BrStyled/>
                                    <PointsSubtitle>Еженедельный розыгрыш</PointsSubtitle>
                                    <BrStyled/>
                                    <Text>Минимальное количество для участия — 450 баллов. Считаются только баллы, заработанные в рамках текущей недели. Баллы дублируются в счётчик общих баллов.</Text>
                                    <BrStyled />
                                    <Text><Bold>Среди призов:</Bold> плёночный фотоаппарат Kodak, сертификаты Ozon, Литрес, VK Музыка и многое другое.</Text>
                                    <BrStyled />
                                    <Text>Баллы можно получить за игры «Планнер», «Блендер», «Челлендж недели».</Text>
                                    <BrStyled />
                                    <PointsSubtitle>Розыгрыш супер-приза</PointsSubtitle>
                                    <BrStyled />
                                    <Text><Bold>Главный приз в игре</Bold> — Apple iPhone 16 Pro Max. Для участия в розыгрыше супер-приза нужны шансы.</Text>
                                    <BrStyled />
                                    <Text> В конце игры заработанные за всё время баллы конвертируются в шансы:</Text>
                                    <BrStyled />
                                    <Text>от 2800 до 3000 баллов — 1 шанс</Text>
                                    <Text>от 3000 до 3250 баллов — 2 шанса</Text>
                                    <Text>от 3250 до 3500 баллов — 3 шанса</Text>
                                    <BrStyled />
                                    <PointsSubtitle>Также шансы даются за действия:</PointsSubtitle>
                                    <UlStyled>
                                        <Li>+2 шанса за открытие 12 коллекционных напитков</Li>
                                        <Li>+3 шанса за 10 достижений</Li>
                                        <Li>+1 шанс за каждого приглашённого друга со своего факультета по реферальной ссылке</Li>
                                        <Li>+1 шанс за подписку на ТГ-канал FutureToday</Li>
                                    </UlStyled>
                                    <Text>Чем больше шансов, тем выше вероятность выигрыша. Результаты розыгрышей придут в ТГ-боте.</Text>
                                </PointsWrapper>
                            ) : (
                                <>
                                    <Text> <Bold>Играя, ты зарабатываешь баллы</Bold> для участия в розыгрыше. Минимальное количество для участия — 2800 баллов.</Text>
                                    <BrStyled/>
                                    <Text><Bold>Среди призов:</Bold> мерч от Альфа-Банка, подарочные сертификаты Ozon и Литрес, настольные игры, мерч и другие призы.</Text>
                                    <BrStyled />
                                    <Text><Bold>Как получить баллы:</Bold></Text>
                                    <UlStyled>
                                        <Li>
                                        Проходить игры «Планнер», «Блендер», «Челлендж недели»
                                        </Li>
                                        <Li>
                                        +100 баллов за 12 собранных коллекционных напитков
                                        </Li>
                                        <Li>
                                        +100 баллов за каждого друга, приглашённого по реферальной ссылке (максимум 10 друзей)
                                        </Li>
                                        <Li>
                                        +50 баллов за подписку на ТГ-канал FutureToday
                                        </Li>
                                        <Li>
                                        +5 баллов за каждое достижение
                                        </Li>
                                    </UlStyled>
                                    <Text>Розыгрыш проводится в конце 4-й недели. Результаты придут в ТГ-боте.</Text>
                                </>
                            )
                        }
                    </>
                );
            case 2:
                return (
                    <>
                        <TitleStyled>
                            Планнер
                        </TitleStyled>
                        <Text>
                            <Bold>Распредели 12 карточек</Bold> с делами по утру, дню и вечеру — в каждый блок можно положить до 3. Не забудь про <Bold>челлендж недели</Bold> — зафиксировать результат можно только с ней!
                            <br />
                            <br />
                            Баллы начисляются <Bold>за полностью собранный день</Bold>. После планирования открывается доступ к другим играм.
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
                            <Bold>В игре 4 недели.</Bold> Каждая из них посвящена отдельной теме — мы раскрываем баланс работы и жизни и показываем разные стороны работы в Альфа-Банке. Вместе с новой темой появляется новая мини-игра.
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
                            <Bold>К тебе приходят гости, и каждому нужен свой напиток.</Bold> Состав напитка и время ожидания показаны в баблах над их головами. У тебя всего 15 секунд на каждого гостя, а сам напиток готовится 2 секунды. В игре всего 1 раунд.
                        </Text>
                        <br />
                        <Text>
                            <Bold>За правильный заказ ты получаешь баллы.</Bold> Если напиток не подошёл одному гостю, его можно оставить на столе и отдать другому. На столе может быть не больше 3 напитков.
                        </Text>
                        <br />
                        <Text>
                            Ошибка в рецепте сбрасывает ингредиенты, а если время ожидания вышло — гость уходит и ты не получишь баллы. <Bold>У тебя есть три попытки пройти игру,</Bold> после чего она заканчивается.
                        </Text>
                    </> 
                )
            default: break;
        }
    }

    return (
        <Modal isDisabledAnimation isOpen={isOpen}>
            <Content>
                <div>
                    <ArrowButton onClick={ handlePrev }>
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 1.5L6 9.5L14 17.5" stroke="#263D8D" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </ArrowButton>
                </div>
                <div>
                    <BackButton $ratio={ratio} onClick={onClose}>
                        <svg viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 11L3 6M3 6L8 1M3 6L15 6" stroke="#263D8D" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </BackButton>
                    { getContent() }
                    <ProgressWrapper $ratio={ ratio }>
                        { progress.map((p) => (
                            <ProgressCircle key={ p } $isActive={ p === part } />
                        )) }
                    </ProgressWrapper>
                </div>
                <ArrowButtonRight onClick={ handleNext }>
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 17.5L14 9.5L6 1.5" stroke="#263D8D" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                </ArrowButtonRight>
            </Content>
        </Modal>
    )
}