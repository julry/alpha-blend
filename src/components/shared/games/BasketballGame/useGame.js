import { useEffect, useRef, useState } from 'react';
import { 
        BOTTOM_HOOP_X, SCREEN_HEIGHT, BOTTOM_HOOP_Y, SCREEN_WIDTH, 
        MIN_HOOP_DISTANCE, FRICTION, GRAVITY, BALL_RADIUS, BOUNCE, 
        HOOP_WIDTH, HOOP_HEIGHT,
} from './constants';

export const useGame = ({gameAreaRef}) => {
    //TODO: применить ratio
    const [ballPosition, setBallPosition] = useState({ x: BOTTOM_HOOP_X, y: SCREEN_HEIGHT - BOTTOM_HOOP_Y });
    const [ballVelocity, setBallVelocity] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [trajectory, setTrajectory] = useState([]);
    const [hoops, setHoops] = useState([
        { x: BOTTOM_HOOP_X, y: SCREEN_HEIGHT - BOTTOM_HOOP_Y, angle: 45, hasBall: true },
        { x: SCREEN_WIDTH - BOTTOM_HOOP_X, y: SCREEN_HEIGHT - BOTTOM_HOOP_Y - MIN_HOOP_DISTANCE, angle: -45, hasBall: false }
    ]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isBallMoving, setIsBallMoving] = useState(false);

    // 
    const animationFrameRef = useRef(null);

    // Очистка анимации при размонтировании
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    // Обновление позиции мяча
    useEffect(() => {
        if (!isBallMoving) return;

        const moveBall = () => {
            setBallPosition(prev => {
                let newX = prev.x + ballVelocity.x;
                let newY = prev.y + ballVelocity.y;
                let newVx = ballVelocity.x * FRICTION;
                let newVy = ballVelocity.y + GRAVITY;

                // Проверка столкновений с границами экрана
                if (newX - BALL_RADIUS < 0) {
                    newX = BALL_RADIUS;
                    newVx = -ballVelocity.x * BOUNCE;
                } else if (newX + BALL_RADIUS > SCREEN_WIDTH) {
                    newX = SCREEN_WIDTH - BALL_RADIUS;
                    newVx = -ballVelocity.x * BOUNCE;
                }

                if (newY - BALL_RADIUS < 0) {
                    newY = BALL_RADIUS;
                    newVy = -ballVelocity.y * BOUNCE;
                } else if (newY + BALL_RADIUS > SCREEN_HEIGHT) {
                    // Мяч упал за пределы экрана - игра окончена
                    setGameOver(true);
                    setIsBallMoving(false);
                    return prev;
                }

                // Проверка попадания в корзины
                hoops.forEach(hoop => {
                    if (!hoop.hasBall) {
                        const hoopCenterX = hoop.x;
                        const hoopCenterY = hoop.y;

                        // Проверка попадания в корзину
                        if (
                            newX > hoopCenterX - HOOP_WIDTH / 2 &&
                            newX < hoopCenterX + HOOP_WIDTH / 2 &&
                            newY > hoopCenterY - HOOP_HEIGHT / 2 &&
                            newY < hoopCenterY + HOOP_HEIGHT / 2
                        ) {
                            // Попадание в корзину
                            setScore(prev => prev + 1);

                            // Создаем новую корзину выше на противоположной стороне
                            const newHoopY = Math.max(
                                BOTTOM_HOOP_Y + MIN_HOOP_DISTANCE,
                                hoop.y - Math.random() * 50
                            );

                            const newHoop = {
                                x: hoop.x > SCREEN_WIDTH / 2 ? BOTTOM_HOOP_X : SCREEN_WIDTH - BOTTOM_HOOP_X,
                                y: newHoopY,
                                angle: hoop.angle > 0 ? -45 : 45,
                                hasBall: false
                            };

                            // Обновляем корзины
                            setHoops(prev => [
                                { ...hoop, y: hoop.y + MIN_HOOP_DISTANCE, hasBall: true },
                                newHoop
                            ]);

                            // Останавливаем мяч
                            setIsBallMoving(false);
                            setBallPosition({
                                x: hoopCenterX,
                                y: hoopCenterY + MIN_HOOP_DISTANCE
                            });
                            setBallVelocity({ x: 0, y: 0 });
                        }
                    }
                });

                setBallVelocity({ x: newVx, y: newVy });
                return { x: newX, y: newY };
            });

            if (isBallMoving) {
                animationFrameRef.current = requestAnimationFrame(moveBall);
            }
        };

        animationFrameRef.current = requestAnimationFrame(moveBall);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isBallMoving, ballVelocity, hoops]);

    const handleTouchStart = (e) => {
        if (isBallMoving || gameOver) return;

        const touchX = e.touches[0].clientX - gameAreaRef.current.getBoundingClientRect().left;
        const touchY = e.touches[0].clientY - gameAreaRef.current.getBoundingClientRect().top;

        // Проверяем, что касание началось на мяче
        const distance = Math.sqrt(
            Math.pow(touchX - ballPosition.x, 2) +
            Math.pow(touchY - ballPosition.y, 2)
        );

        if (distance <= BALL_RADIUS) {
            setIsDragging(true);
            setDragStart({ x: touchX, y: touchY });
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging || isBallMoving || gameOver) return;

        const touchX = e.touches[0].clientX - gameAreaRef.current.getBoundingClientRect().left;
        const touchY = e.touches[0].clientY - gameAreaRef.current.getBoundingClientRect().top;

        // Рассчитываем силу броска (расстояние от начальной точки касания)
        const distance = Math.sqrt(
            Math.pow(touchX - dragStart.x, 2) +
            Math.pow(touchY - dragStart.y, 2)
        );

        // Фиксированный угол 45 градусов (вверх или вниз в зависимости от направления)
        const angle = Math.atan2(dragStart.y - touchY, touchX - dragStart.x);
        // const isRight = ballPosition.x > BOTTOM_HOOP_X;
        // const fixedAngle = (isRight ? 3 * Math.PI / 4 : Math.PI / 4); // 45 градусов

        // Рассчитываем скорость с фиксированным углом
        const power = distance / 15;
        const powerX = Math.cos(angle) * power;
        const powerY = -Math.sin(angle) * power;

        // Генерируем точки траектории
        const points = [];
        let x = ballPosition.x;
        let y = ballPosition.y;
        let vx = powerX;
        let vy = powerY;

        for (let i = 0; i < 4; i++) {
            x += vx;
            y += vy;
            vy += GRAVITY;
            vx *= FRICTION;

            // Обработка столкновений со стенами
            if (x - BALL_RADIUS < 0 || x + BALL_RADIUS > SCREEN_WIDTH) {
                vx = -vx * BOUNCE;
            }
            if (y - BALL_RADIUS < 0) {
                vy = -vy * BOUNCE;
            }

            points.push({ x, y });

            if (y > SCREEN_HEIGHT) break;
        }

        setTrajectory(points);
    };

    const handleTouchEnd = (e) => {
        if (!isDragging || isBallMoving || gameOver) return;

        setIsDragging(false);

        const touchX = e.changedTouches[0].clientX - gameAreaRef.current.getBoundingClientRect().left;
        const touchY = e.changedTouches[0].clientY - gameAreaRef.current.getBoundingClientRect().top;

        // Рассчитываем силу броска
        const distance = Math.sqrt(
            Math.pow(touchX - dragStart.x, 2) +
            Math.pow(touchY - dragStart.y, 2)
        );

        // Фиксированный угол 45 градусов
        // const fixedAngle = Math.PI/4;
        const angle = Math.atan2(dragStart.y - touchY, touchX - dragStart.x);

        // const isRight = ballPosition.x > BOTTOM_HOOP_X;
        // const fixedAngle = (isRight ? 3 * Math.PI / 4 : Math.PI / 4); // 45 градусов
        const power = distance / 15;

        setBallVelocity({
            x: Math.cos(angle) * power,
            y: -Math.sin(angle) * power
        });
        setIsBallMoving(true);
        setTrajectory([]);

        // Убираем мяч из текущей корзины
        setHoops(prev => prev.map(hoop =>
            hoop.hasBall ? { ...hoop, hasBall: false } : hoop
        ));
    };

    const resetGame = () => {
        setBallPosition({ x: BOTTOM_HOOP_X, y: SCREEN_HEIGHT - BOTTOM_HOOP_Y });
        setBallVelocity({ x: 0, y: 0 });
        setHoops([
            { x: BOTTOM_HOOP_X, y: SCREEN_HEIGHT - BOTTOM_HOOP_Y, angle: 45, hasBall: true },
            { x: SCREEN_WIDTH - BOTTOM_HOOP_X, y: SCREEN_HEIGHT - BOTTOM_HOOP_Y - MIN_HOOP_DISTANCE, angle: -45, hasBall: false }
        ]);
        setScore(0);
        setGameOver(false);
        setIsBallMoving(false);
        setTrajectory([]);
    };

    return {
        handleTouchEnd,
        handleTouchMove,
        handleTouchStart,
        resetGame,
        gameOver,
        trajectory,
        score,
        hoops,
        ballPosition
    }
}