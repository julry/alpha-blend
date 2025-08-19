import styled from "styled-components";
import { useState } from "react";
import windowPic from '../../assets/images/window.png';
import { FlexWrapper } from "../shared/ContentWrapper";
import { Input } from "../shared/Input";
import { useProgress } from "../../contexts/ProgressContext";
import { emailRegExp } from "../../constants/regexp";
import { Block } from "../shared/Block";
import { Button } from "../shared/Button";
import { Title } from "../shared/Title";

const Wrapper = styled(FlexWrapper)`
    padding-top: var(--spacing_x10);
    background: url(${windowPic}) no-repeat 0 0 / cover;
`;

const Content = styled(FlexWrapper)`
    z-index: 2;
    padding: 0;
`;

const FormWrapper = styled.div`
    margin: var(--spacing_x2) 0;
    width: 100%;
`;

const InputWrapper = styled.div`
    position: relative;

    & + & {
        margin-top: var(--spacing_x2);
    }
`;

const InputStyled = styled(Input)`
    ${({ $isError }) => $isError ? 'box-shadow: 0 0 0 1px var(--color-red); color: var(--color-red)' : ''};
`;

const WrongText = styled.p`
    margin-top: var(--spacing_x2);
    color: var(--color-green);
    font-size: var(--font_xs);
`;

const InfoIconWrapper = styled.div`
    position: absolute;
    right: var(--spacing_x2);
    top: var(--spacing_x2);
`;

const InputRadioButton = styled.input`
    display: none;
`;

const RadioIconStyled = styled.div`
    position: relative;
    flex-shrink: 0;
    width: var(--spacing_x2);
    height: var(--spacing_x2);
    background-color: var(--color-white);
    box-shadow: inset 0 0 0 2px var(--color-white);
    border-radius: var(--border-radius-xs);
    margin-right: var(--spacing_x1);
    margin-top: calc(var(--spacing_x1) / 2);
    border-radius: 50%;
`;

const RadioButtonLabel = styled.label`
    display: flex;
    align-items: flex-start;
    cursor: pointer;
    font-size: var(--font_xxs);
    color: var(--color-black);
    width: 100%;
    text-align: left;
    max-width: 300px;

    & ${InputRadioButton}:checked + ${RadioIconStyled} {
        background: var(--color-green);
    }
`;

const Link = styled.a`
    font-weight: 500;
`;

const Blur = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(36, 38, 50, 0.4);
    backdrop-filter: blur(4px);
`;

export const Registration2 = () => {
    const { next, setUserInfo, currentWeek, registrateUser, getUserInfo } = useProgress();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isNetworkError, setIsNetworkError] = useState(false);
    const [isAgreed, setIsAgreed] = useState('');
    const [isMailsAgreed, setIsMailsAgreed] = useState('');
    const [isCorrect, setIsCorrect] = useState(true);
    const [isNameCorrect, setIsNameCorrect] = useState();
    const [isSurnameCorrect, setIsSurnameCorrect] = useState();
    const [isEmailFieldCorrect, setIsEmailFieldCorrect] = useState();
    const [isAlreadyHas, setIsAlreadyHas] = useState(false);

    const handleBlur = () => {
        setIsEmailFieldCorrect(!!email.match(emailRegExp));

        if (email.match(emailRegExp) || !email) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    const handleNameBlur = () => setIsNameCorrect(name.length > 1);
    const handleSurnameBlur = () => setIsSurnameCorrect(surname.length > 1);

    const handleChange = (e) => {
        if (isSending) return;
        setIsCorrect(true);
        setIsAlreadyHas(false);
        setEmail(e.target.value);
    };

    const handleClick = async () => {
        setIsNetworkError(false);

        if (isSending) return;
        setIsSending(true);

        const res = await getUserInfo(email);

        if (!res?.isError) {
            setIsAlreadyHas(true);
            setIsSending(false);

            return;
        }

        setUserInfo({ name: `${name} ${surname}`, email, registerWeek: currentWeek });
        const regRes = await registrateUser({ name, email });
        setIsSending(false);

        if (regRes?.isError) {
            setIsNetworkError(true);
            return;
        }

        next();
    }

    const btnDisabled = !name || !email || !isAgreed;

    const getIcon = (isCorrect) => {
        if (typeof isCorrect !== "boolean") return;

        if (isCorrect) return (
            <InfoIconWrapper>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 10L7.5 14.5L17 5" stroke="#2DE500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </InfoIconWrapper>

        )

        return (
            <InfoIconWrapper>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 5L15.5 15.5M15.5 5L5 15.5" stroke="#ED3125" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </InfoIconWrapper>

        )
    }

    return (
        <Wrapper>
            <Blur />
            <Content>
                <Block>
                    <Title>РЕГИСТРАЦИЯ</Title>
                    <FormWrapper>
                        <InputWrapper>
                            <Input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={handleNameBlur}
                                placeholder="Имя"
                            />
                            {getIcon(isNameCorrect)}
                        </InputWrapper>
                        <InputWrapper>
                            <Input
                                type="text"
                                id="surname"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                onBlur={handleSurnameBlur}
                                placeholder="Фамилия"
                            />
                            {getIcon(isSurnameCorrect)}
                        </InputWrapper>
                        <InputWrapper>
                            <InputStyled
                                $isError={!isCorrect || isAlreadyHas}
                                type="email"
                                id="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {getIcon(isEmailFieldCorrect)}
                        </InputWrapper>

                        {isAlreadyHas && (
                            <WrongText>Ой! Эта почта уже зарегистрирована. Попробуй ввести снова.</WrongText>
                        )}
                    </FormWrapper>
                    <RadioButtonLabel>
                        <InputRadioButton
                            type="checkbox"
                            value={isAgreed}
                            checked={isAgreed}
                            onChange={() => setIsAgreed((prevAgreed) => !prevAgreed)}
                        />
                        <RadioIconStyled />
                        <span>
                            Я даю согласие на{"\u00A0"}
                            <Link
                                href={"https://fut.ru/personal_data_agreement"}
                                target="_blank"
                                rel="noreferrer"
                            >
                                обработку
                            </Link>{" "}
                            и{"\u00A0"}
                            <Link
                                href={"https://fut.ru/personal_data_transfer_agreement"}
                                target="_blank"
                                rel="noreferrer"
                            >
                                передачу
                            </Link>{" "}
                            моих персональных данных и соглашаюсь с {"\u00A0"}
                            <Link
                                href={'https://fut.ru/personal-data'}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Политикой обработки персональных данных
                            </Link>, а также с правилами проведения акции.
                        </span>
                    </RadioButtonLabel>
                    <RadioButtonLabel>
                        <InputRadioButton
                            type="checkbox"
                            value={isMailsAgreed}
                            checked={isMailsAgreed}
                            onChange={() => setIsMailsAgreed((prevAgreed) => !prevAgreed)}
                        />
                        <RadioIconStyled />
                        <span>
                            Хочу ловить{"\u00A0"}
                            <Link
                                href={"https://fut.ru/adv_messages_agreement"}
                                target="_blank"
                                rel="noreferrer"
                            >
                                персональные стажировки от топ‑компаний в рекламной рассылке
                            </Link>.
                        </span>
                    </RadioButtonLabel>
                    {isNetworkError && (
                        <WrongText>Ой! Что-то пошло не так, попробуй позже.</WrongText>
                    )}
                </Block>

                <Button onClick={handleClick} disabled={btnDisabled}>Готово</Button>
            </Content>

        </Wrapper>
    )
}