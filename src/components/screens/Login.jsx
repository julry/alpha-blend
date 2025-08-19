// import styled from "styled-components";
// import { SCREENS } from "../../constants/screens";
// import { Button } from "../shared/Button";
// import { Input } from "../shared/Input";
// import { IntroHeader } from "../shared/IntroHeader";
// import { useProgress } from "../../contexts/ProgressContext";
// import picture from "../../assets/images/login-pic.png";
// import { useState } from "react";
// import { useSizeRatio } from "../../hooks/useSizeRatio";
// import { emailRegExp } from "../../constants/regexp";
// import { reachMetrikaGoal } from "../../utils/reachMetrikaGoal";

// const Wrapper = styled.div`
//     width: 100%;
//     height: 100%;
//     display: flex;
//     flex-direction: column;
// `;

// const Content = styled.div`
//     padding: var(--spacing_x4);
//     position: relative;
//     z-index: 2;
// `;

// const Text = styled.p`
//     margin-top: var(--spacing_x5);
//     margin-bottom: var(--spacing_x2);
//     font-size: var(--font_sm);
// `;

// const ButtonStyled = styled(Button)`
//     transition: opacity 0.2s, margin 0.2s;
//     margin-top: ${({$isWrongEmail}) => $isWrongEmail ? 'calc(var(--spacing_x3) + 2px)' : 'var(--spacing_x5)'};
//     opacity: ${({$isHidden}) => $isHidden ? 0 : 1};

//     & + & {
//         margin-top: var(--spacing_x2);
//     }
// `;

// const Picture = styled.div`
//     position: absolute;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     z-index: 1;
//     width: 100%;
//     background: url(${picture}) no-repeat center 100% / contain;
//     height: ${({$ratio}) => $ratio * 418}px;
// `;

// const WrongText = styled.p`
//     margin-top: var(--spacing_x2);
//     color: var(--color-green);
//     font-size: var(--font_xs);
// `;

// const weekToMetrikaName = {
//     2: 'second',
//     3: 'third',
//     4: 'fourth',
// }
// export const Login = () => {
//     const [isWrongEmail, setWrongEmail] = useState(false);
//     const [isSending, setIsSending] = useState(false);
//     const [email, setEmail] = useState('');

//     const ratio = useSizeRatio();
//     const { next, getUserInfo, currentWeek } = useProgress();

//     const handleClick = async () => {
//         if (isSending) return;
//         if (!!email && !email.trim().match(emailRegExp)) {
//             setWrongEmail(true);
//             return;
//         }

//         setIsSending(true);

//         const info = await getUserInfo(email.trim());

//         if (info.isError) {
//             setWrongEmail(true);
//             return;
//         }

//         setIsSending(false);
        
//         if (currentWeek === 1) {
//             reachMetrikaGoal(`${info?.userInfo?.isVip ? '' : 'non'}target_lobby`);
//         } else if (currentWeek < 5) {
//             reachMetrikaGoal(`${info?.userInfo?.isVip ? '' : 'non'}target_${weekToMetrikaName[currentWeek]}_week_start`);
//         }

//         next();
//     }
//     return (
//         <Wrapper>
//             <Content>
//                 <IntroHeader 
//                     onBack={() => next(SCREENS.INTRO)}
//                     text={'Привет! Рады,\nчто ты волнуешься\nза Алекса.'}
//                 />
//                 <Text>
//                     Введи свою почту,{'\n'}чтобы продолжить играть.
//                 </Text>
//                 <Input placeholder="user@mail.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
//                 {isWrongEmail && (
//                     <WrongText>Ой! Такой почты нет. Попробуй ввести снова{currentWeek < 5 ? ' или зарегистрируйся, чтобы начать играть.' : ''}</WrongText>
//                 )}
//                 <ButtonStyled $isWrongEmail={isWrongEmail} color="red" onClick={handleClick}>Далее</ButtonStyled>
//                 {currentWeek < 5 && (
//                     <ButtonStyled disabled={!isWrongEmail} $isHidden={!isWrongEmail} color="pink" onClick={() => next(SCREENS.REG_1)}>Регистрация</ButtonStyled>
//                 )}
//             </Content>
//             <Picture $ratio={ratio} />
//         </Wrapper>
//     )
// }