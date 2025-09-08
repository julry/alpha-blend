import { useEffect, useRef, useState } from "react";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import ballPic from './images/ball.png';
import hoopPic from './images/hoop.png';
import frontRimPic from './images/front_rim2.png';
import sideRimPic from './images/side_rim.png';
import { MIN_MOCKUP_WIDTH } from "../../../ScreenTemplate";

export const useGame = () => {
    const ratio = useSizeRatio();
    const gameContainerRef = useRef(null);
    const [currentScore, setCurrentScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [showCurrentBest, setShowCurrentBest] = useState(false);
    const gameRef = useRef(null);

    // Функция для предзагрузки изображений
    const preloadImages = () => {
        const images = {
            'ball': ballPic,
            // 'hoop': './images/hoop.png',
            'side_rim': sideRimPic,
            'front_rim': frontRimPic,
        };

        const promises = Object.entries(images).map(([name, dataUrl]) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ name, img });
            img.src = dataUrl;
        });
        });
        
        return Promise.all(promises);
    };

    useEffect(() => {
        // Инициализация игры после монтирования компонента
        const initGame = async () => {
            console.log('initing');
            console.log('!gameContainerRef.current', !gameContainerRef.current);
            console.log('gameRef.current', gameRef.current);
        if (!gameContainerRef.current || gameRef.current) return;
        
        try {
            // Предзагрузка изображений
            const loadedImages = await preloadImages();
            
            // Создаем простую реализацию физики для демонстрации
            const game = {
            images: {},
            physics: {
                gravity: { x: 0, y: 0 },
                restitution: 0.63 // Коэффициент упругости как в оригинале
            },
            elements: {},
            width: window?.outerWidth <= MIN_MOCKUP_WIDTH ? window.outerWidth * ratio : 375 * ratio,
            height: window?.outerWidth <= MIN_MOCKUP_WIDTH ? window.outerHeight * ratio : 375 * ratio,
            isRunning: true,
            init() {
                // Сохраняем загруженные изображения
                loadedImages.forEach(({ name, img }) => {
                    this.images[name] = img;
                });
                
                // Создаем холст для игры
                const canvas = document.createElement('canvas');
                canvas.width = this.width ?? window?.outerWidth <= MIN_MOCKUP_WIDTH ? window.outerWidth * ratio : 375 * ratio;
                canvas.height = this.height ?? window?.outerWidth <= MIN_MOCKUP_WIDTH ? window.outerHeight * ratio : 677 * ratio;
                canvas.style.margin = '0 auto';
                canvas.style.display = 'block';
                canvas.style.backgroundColor = '#ffffff';
                
                gameContainerRef.current.innerHTML = '';
                console.log(canvas);
                gameContainerRef.current.appendChild(canvas);
                
                const ctx = canvas.getContext('2d');
                this.ctx = ctx;
                
                // Создаем элементы игры
                this.createGameElements();
                
                // Запускаем игровой цикл
                this.lastTime = 0;
                this.gameLoop();
            },
            createGameElements() {
                // Создаем мяч со случайной позицией по X
                const randomX = 60 + Math.random() * 280;
                this.elements.ball = {
                x: currentScore === 0 ? 175 : randomX,
                y: 547,
                radius: 30,
                velocity: { x: 0, y: 0 },
                launched: false,
                isBelowHoop: false,
                rotation: 0
                };
                
                // Создаем кольцо
                this.elements.hoop = {
                x: 88,
                y: 62,
                width: 224,
                height: 122
                };
                
                // Создаем обод (как в оригинале)
                this.elements.rim = {
                    left: { x: 150, y: 184, radius: 2.5 },
                    right: { x: 249, y: 184, radius: 2.5 }
                };
                
                // Границы корзины для столкновений
                this.elements.basketBounds = {
                    left: 148,
                    right: 252,
                    top: 180,
                    bottom: 190
                };
                
                // Настраиваем обработчики событий
                const canvas = this.ctx.canvas;
                canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
                canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
                canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
                canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
            },
            handleMouseDown(e) {
                const rect = this.ctx.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Проверяем, кликнули ли по мячу
                const ball = this.elements.ball;
                const distance = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2);
                
                if (distance <= ball.radius) {
                this.isDragging = true;
                this.dragStart = { x, y, time: Date.now() };
                }
            },
            handleMouseUp(e) {
                if (this.isDragging) {
                const rect = this.ctx.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const timeElapsed = Date.now() - this.dragStart.time;
                
                this.handleRelease(x, y, timeElapsed);
                this.isDragging = false;
                }
            },
            handleTouchStart(e) {
                e.preventDefault();
                if (e.touches.length === 1) {
                const rect = this.ctx.canvas.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const y = e.touches[0].clientY - rect.top;
                
                // Проверяем, коснулись ли мяча
                const ball = this.elements.ball;
                const distance = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2);
                
                if (distance <= ball.radius) {
                    this.isDragging = true;
                    this.dragStart = { x, y, time: Date.now() };
                }
                }
            },
            handleTouchEnd(e) {
                if (this.isDragging && e.changedTouches.length === 1) {
                const rect = this.ctx.canvas.getBoundingClientRect();
                const x = e.changedTouches[0].clientX - rect.left;
                const y = e.changedTouches[0].clientY - rect.top;
                const timeElapsed = Date.now() - this.dragStart.time;
                
                this.handleRelease(x, y, timeElapsed);
                this.isDragging = false;
                }
            },
            handleRelease(x, y, timeElapsed) {
                if (this.elements.ball.launched) return;
                
                // Рассчитываем силу броска на основе расстояния и времени
                const distanceX = x - this.dragStart.x;
                const distanceY = y - this.dragStart.y;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                
                // Минимальная дистанция и время для броска
                if (distance > 10 && timeElapsed < 1000 && y < this.dragStart.y) {
                const speedFactor = Math.min(1, distance / 100) * Math.min(1, 500 / timeElapsed);
                const xTraj = -2300 * distanceX / distanceY * speedFactor;
                this.launchBall(xTraj);
                }
            },
            launchBall(xTraj) {
                const ball = this.elements.ball;
                ball.launched = true;
                ball.velocity.x = xTraj;
                ball.velocity.y = -1750;
                // Добавляем вращение как в оригинале
                ball.rotationSpeed = xTraj / 3;
                this.physics.gravity.y = 3000;
                setShowCurrentBest(false);
            },
            checkBasketCollision() {
                const ball = this.elements.ball;
                const bounds = this.elements.basketBounds;
                const rim = this.elements.rim;
                
                // Проверяем столкновение с левым ободом
                const leftDistance = Math.sqrt((ball.x - rim.left.x) ** 2 + (ball.y - rim.left.y) ** 2);
                if (ball.velocity.y > 0 && leftDistance < ball.radius + rim.left.radius) {
                // Расчет нормали столкновения
                const nx = (ball.x - rim.left.x) / leftDistance;
                const ny = (ball.y - rim.left.y) / leftDistance;
                
                // Отскок с учетом коэффициента упругости
                const dotProduct = ball.velocity.x * nx + ball.velocity.y * ny;
                ball.velocity.x = (ball.velocity.x - 2 * dotProduct * nx) * this.physics.restitution;
                ball.velocity.y = (ball.velocity.y - 2 * dotProduct * ny) * this.physics.restitution;
                
                // Немного смещаем мяч чтобы избежать залипания
                ball.x = rim.left.x + (ball.radius + rim.left.radius) * nx;
                ball.y = rim.left.y + (ball.radius + rim.left.radius) * ny;
                
                return true;
                }
                
                // Проверяем столкновение с правым ободом
                const rightDistance = Math.sqrt((ball.x - rim.right.x) ** 2 + (ball.y - rim.right.y) ** 2);
                if (ball.velocity.y > 0 && rightDistance < ball.radius + rim.right.radius) {
                // Расчет нормали столкновения
                const nx = (ball.x - rim.right.x) / rightDistance;
                const ny = (ball.y - rim.right.y) / rightDistance;
                
                // Отскок с учетом коэффициента упругости
                const dotProduct = ball.velocity.x * nx + ball.velocity.y * ny;
                ball.velocity.x = (ball.velocity.x - 2 * dotProduct * nx) * this.physics.restitution;
                ball.velocity.y = (ball.velocity.y - 2 * dotProduct * ny) * this.physics.restitution;
                
                // Немного смещаем мяч чтобы избежать залипания
                ball.x = rim.right.x + (ball.radius + rim.right.radius) * nx;
                ball.y = rim.right.y + (ball.radius + rim.right.radius) * ny;
                
                return true;
                }
                
                // Проверяем столкновение с границами корзины
                if (ball.velocity.y > 0 && (ball.y + ball.radius > bounds.top && ball.y - ball.radius < bounds.bottom)) {
                if (ball.x - ball.radius < bounds.left && ball.x + ball.radius / 2 > bounds.left) {
                    // Столкновение с левой границей
                    ball.velocity.x = Math.abs(ball.velocity.x) * this.physics.restitution;
                    ball.x = bounds.left + ball.radius;
                    return true;
                }
                
                if (ball.x + ball.radius > bounds.right && ball.x + ball.radius / 2 < bounds.right) {
                    // Столкновение с правой границей
                    ball.velocity.x = -Math.abs(ball.velocity.x) * this.physics.restitution;
                    ball.x = bounds.right - ball.radius;
                    return true;
                }
                }
                
                return false;
            },
            update(deltaTime) {
                const ball = this.elements.ball;
                const delta = deltaTime / 1000; // Преобразуем в секунды
                
                if (ball.launched) {
                // Применяем гравитацию
                ball.velocity.y += this.physics.gravity.y * delta;
                
                // Применяем вращение
                ball.rotation += ball.rotationSpeed * delta;
                
                // Сохраняем предыдущую позицию для обнаружения прохождения через кольцо
                const prevY = ball.y;
                
                // Обновляем позицию
                ball.x += ball.velocity.x * delta;
                ball.y += ball.velocity.y * delta;
                
                // Проверяем столкновения с корзиной
                this.checkBasketCollision();
                
                // Проверяем, прошёл ли мяч через кольцо (движется вниз и пересек уровень обода)
                const rimBottom = this.elements.rim.left.y + this.elements.rim.left.radius * 2;
                if (ball.velocity.y > 0 && prevY <= rimBottom && ball.y > rimBottom && !ball.isBelowHoop) {
                    ball.isBelowHoop = true;
                    
                    // Проверяем, попал ли мяч в корзину (по горизонтали между ободами)
                    if (ball.x > this.elements.rim.left.x && ball.x < this.elements.rim.right.x + this.elements.rim.right.radius) {
                    // Засчитываем очко
                    setCurrentScore(prev => prev + 1);
                    } else {
                    // Сбрасываем счет, если промах
                    if (currentScore > highScore) {
                        setHighScore(currentScore);
                    }
                    setCurrentScore(0);
                    setShowCurrentBest(true);
                    }
                }
                
                // Проверяем, улетел ли мяч за пределы
                if (ball.y > 1200) {
                    this.resetBall();
                }
                
                // Ограничиваем мяч границами canvas по горизонтали
                if (ball.x - ball.radius < 0) {
                    ball.x = ball.radius;
                    ball.velocity.x = Math.abs(ball.velocity.x) * this.physics.restitution;
                } else if (ball.x + ball.radius > this.ctx.canvas.width) {
                    ball.x = this.ctx.canvas.width - ball.radius;
                    ball.velocity.x = -Math.abs(ball.velocity.x) * this.physics.restitution;
                }
                }
            },
            resetBall() {
                this.physics.gravity.y = 0;
                
                // Случайная позиция по X в пределах canvas (с отступами от краев)
                const canvasWidth = this.ctx.canvas.width;
                const minX = 60;
                const maxX = canvasWidth - 60;
                const randomX = minX + Math.random() * (maxX - minX);
                
                this.elements.ball = {
                x: currentScore === 0 ? 200 : randomX,
                y: 547,
                radius: 30,
                velocity: { x: 0, y: 0 },
                launched: false,
                isBelowHoop: false,
                rotation: 0
                };
            },
            render() {
                const ctx = this.ctx;
                const canvas = ctx.canvas;
                
                // Очищаем холст
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Рисуем кольцо
                const hoopImg = this.images.hoop;
                if (hoopImg) {
                ctx.drawImage(hoopImg, this.elements.hoop.x, this.elements.hoop.y, 
                            this.elements.hoop.width, this.elements.hoop.height);
                }
                
                // Рисуем обод
                const rimImg = this.images.side_rim;
                if (rimImg) {
                ctx.drawImage(rimImg, this.elements.rim.left.x - 5, this.elements.rim.left.y - 2.5);
                ctx.drawImage(rimImg, this.elements.rim.right.x - 5, this.elements.rim.right.y - 2.5);
                }
                
                // Рисуем мяч с вращением
                const ball = this.elements.ball;
                const ballImg = this.images.ball;
                if (ballImg) {
                ctx.save();
                ctx.translate(ball.x, ball.y);
                ctx.rotate(ball.rotation);
                ctx.drawImage(ballImg, -ball.radius, -ball.radius, ball.radius * 2, ball.radius * 2);
                ctx.restore();
                }
                
                // Рисуем переднюю часть обода, если мяч летит вниз
                if (this.elements.ball.velocity.y > 0) {
                const frontRimImg = this.images.front_rim;
                if (frontRimImg) {
                    ctx.drawImage(frontRimImg, 148, 182);
                }
                }
            },
            gameLoop(timestamp) {
                if (!this.isRunning) return;
                
                const deltaTime = timestamp - (this.lastTime || timestamp);
                this.lastTime = timestamp;
                
                this.update(deltaTime);
                this.render();
                
                requestAnimationFrame(this.gameLoop.bind(this));
            },
            destroy() {
                this.isRunning = false;
                if (this.ctx && this.ctx.canvas) {
                this.ctx.canvas.remove();
                }
            }
            };
            
            gameRef.current = game;
            game.init();
            
        } catch (error) {
            console.error('Error initializing game:', error);
        }
        };
        
        initGame();
        
        // Очистка при размонтировании компонента
        return () => {
        if (gameRef.current) {
            gameRef.current.destroy();
            gameRef.current = null;
        }
        };
    }, [currentScore, highScore, ratio]);

    return {gameContainerRef, showCurrentBest, currentScore};
}