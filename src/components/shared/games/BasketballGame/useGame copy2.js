import { useRef, useEffect } from 'react';
import ballPic from './images/ball.png';
import hoopPic from './images/hoop.png';
import frontRimPic from './images/front_rim.png';
import backRimPic from './images/back_rim.png';
import {DEFAULT_HOOP_HEIGHT, DEFAULT_HOOP_WIDTH, DEFAULT_HOOP_BACK_HEIGHT, DEFAULT_HOOP_BACK_WIDTH, DEFAULT_HOOP_FRONT_HEIGHT, DEFAULT_HOOP_FRONT_WIDTH, BORDER_WIDTH} from './constants'
import { useSizeRatio } from '../../../../hooks/useSizeRatio';
import { TARGET_HEIGHT, TARGET_WIDTH } from '../../../ScreenTemplate';

const MAX_HOOP_HEIGHT = 81;

function interpolate(pointA, pointB, progress) {
    return {
        x: pointA.x + (pointB.x - pointA.x) * progress,
        y: pointA.y + (pointB.y - pointA.y) * progress
    };
}

export const useGame = () => {
    const ratio = useSizeRatio();
    const gameContainerRef = useRef(null);
    const gameRef = useRef(null);

    const preloadImages = () => {
        const images = {
            'ball': ballPic,
            'hoop': hoopPic,
            'frontRim': frontRimPic,
            'backRim': backRimPic,
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
            if (!gameContainerRef.current || gameRef.current) return;

            try {
                // Предзагрузка изображений
                const loadedImages = await preloadImages();

                // Создаем простую реализацию физики для демонстрации
                const game = {
                    images: {},
                    points: [],
                    shownPoints: [],
                    pointIndex: 0,
                    speed: 0,
                    physics: {
                        gravity: { x: 0, y: 0.93 },
                        friction: 1.3,
                        restitution: 0.63 // Коэффициент упругости как в оригинале
                    },
                    elements: {},
                    width: window.outerWidth <= TARGET_WIDTH ? window.outerWidth ?? 375 * ratio : 375 * ratio,
                    height: window.outerWidth <= TARGET_HEIGHT ? window.outerHeight ?? 677 * ratio : 677 * ratio,
                    isRunning: true,
                    init() {
                        // Сохраняем загруженные изображения
                        loadedImages.forEach(({ name, img }) => {
                            this.images[name] = img;
                        });

                        // Создаем холст для игры
                        const canvas = document.createElement('canvas');
                        canvas.width = this.width;
                        canvas.height = this.height;
                        canvas.style.margin = '0 auto';
                        canvas.style.display = 'block';
                        canvas.style.backgroundColor = '#ffffff';

                        gameContainerRef.current.innerHTML = '';
                        gameContainerRef.current.appendChild(canvas);

                        const ctx = canvas.getContext('2d');
                        this.ctx = ctx;

                        // Создаем элементы игры
                        this.createGameElements();

                        // Запускаем игровой цикл
                        this.lastTime = 0;
                        this.gameLoop();
                    },
                    rotatePoint(x, y, centerX, centerY, angleRad) {
                        // Переводим градусы в радианы
                        // const angleRad = angleDegrees * Math.PI / 180;
                        
                        // Смещаем точку относительно центра поворота
                        const dx = x - centerX;
                        const dy = y - centerY;
                        
                        // Применяем матрицу поворота
                        const cos = Math.cos(angleRad);
                        const sin = Math.sin(angleRad);
                        
                        const newX = centerX + dx * cos - dy * sin;
                        const newY = centerY + dx * sin + dy * cos;
                        
                        return { x: newX, y: newY };
                    },
                    createGameElements() {
                        // Создаем корзину 1
                        this.elements.hoop = {
                            x: 40,
                            y: 477,
                            width: DEFAULT_HOOP_WIDTH,
                            height: DEFAULT_HOOP_HEIGHT,
                            targetRotation: 0,
                        };

                        this.elements.hoopRimFront = {
                            x: this.elements.hoop.x - 13,
                            y: this.elements.hoop.y - 30,
                            width: DEFAULT_HOOP_FRONT_WIDTH,
                            height: DEFAULT_HOOP_FRONT_HEIGHT,
                            // height: 36,
                            targetRotation: 0,
                        };

                        this.elements.hoopRimBack = {
                            x: this.elements.hoop.x - 3,
                            y: this.elements.hoop.y - 27,
                            width: DEFAULT_HOOP_BACK_WIDTH,
                            height: DEFAULT_HOOP_BACK_HEIGHT,
                            targetRotation: 0,
                        };

                        const hoopTargetRotation = -Math.random();

                        this.elements.hoopTarget = {
                            x: this.width - 130,
                            y: 357,
                            width: DEFAULT_HOOP_WIDTH,
                            height: DEFAULT_HOOP_HEIGHT,
                            targetRotation: hoopTargetRotation,
                            leftPoint: this.rotatePoint(this.width - 135, 345, this.width - 130 + DEFAULT_HOOP_HEIGHT / 2, 347 + DEFAULT_HOOP_HEIGHT / 2, hoopTargetRotation),
                            rightPoint: this.rotatePoint(this.width - 165 + DEFAULT_HOOP_FRONT_WIDTH, 345, this.width - 130 + DEFAULT_HOOP_HEIGHT / 2, 347 + DEFAULT_HOOP_HEIGHT / 2, hoopTargetRotation),
                        };

                        this.elements.hoopRimFrontTarget = {
                            x: this.elements.hoopTarget.x - 13,
                            y: this.elements.hoopTarget.y - 30,
                            width: DEFAULT_HOOP_FRONT_WIDTH,
                            height: DEFAULT_HOOP_FRONT_HEIGHT,
                            // height: 36,
                        };

                        this.elements.hoopRimBackTarget = {
                            x: this.elements.hoopTarget.x - 3,
                            y: this.elements.hoopTarget.y - 27,
                            width: DEFAULT_HOOP_BACK_WIDTH,
                            height: DEFAULT_HOOP_BACK_HEIGHT,
                        };

                        // const randomX = 60 + Math.random() * 280;

                        this.elements.ball = {
                            x: this.elements.hoop.x + this.elements.hoop.width / 2,
                            y: this.elements.hoop.y + this.elements.hoop.height - 33,
                            radius: 30,
                            velocity: { x: 0, y: 0 },
                            launched: false,
                            isBelowHoop: false,
                            rotation: 0
                        };

                        // // Создаем обод (как в оригинале)
                        // this.elements.rim = {
                        //   left: { x: 150, y: 184, radius: 2.5 },
                        //   right: { x: 249, y: 184, radius: 2.5 }
                        // };

                        // // Границы корзины для столкновений
                        // this.elements.basketBounds = {
                        //   left: 148,
                        //   right: 252,
                        //   top: 180,
                        //   bottom: 190
                        // };

                        // Настраиваем обработчики событий
                        const canvas = this.ctx.canvas;
                        canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
                        canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
                        canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
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
                            const hoop = this.elements.hoop;
                            const bottom = hoop.y + 129;
                            this.dragStart = { x, y, time: Date.now(), deltaHoop: bottom - y, heightDelta: bottom };
                        }
                    },
                    handleMouseMove(e) {
                        if (!this.isDragging) return;

                        const hoop = this.elements.hoop;
                        const rect = this.ctx.canvas.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const dx = x - (hoop.x + hoop.width / 2);
                        const dy = y - (hoop.y + hoop.height / 2);

                        this.shownPoints = [];
                        this.points = [];

                        hoop.targetRotation = Math.atan2(dy, dx) - Math.PI / 2;
                        const yDelta = y - hoop.y;

                        let velX = (this.dragStart.x - x) / 10;
                        let velY = Math.max(this.dragStart.y - y, DEFAULT_HOOP_HEIGHT - MAX_HOOP_HEIGHT) / 6.6;
                        let posX = this.elements.hoopRimBack.x + this.elements.hoopRimBack.width / 2 + 50 * hoop.targetRotation;
                        let posY = this.elements.hoopRimBack.y + this.elements.hoopRimBack.height / 2 - 10 * hoop.targetRotation;
                        const ball = this.elements.ball;

                        for (let i = 0; i < 120; i++) {
                            velY += this.physics.gravity.y;
                            posX += velX;
                            posY += velY * 2;
                            velX *= this.physics.friction;
                            velY *= this.physics.friction;

                            // Отскок от границ
                            if (posX < 0) {
                                posX = 0;
                                velX = -velX * this.physics.restitution;
                            }
                            if (posX > this.width) {
                                posX = this.width;
                                velX = -velX * this.physics.restitution;
                            }
                            if (posY < 0) {
                                posY = 0;
                                velY = -velY * this.physics.restitution;
                            }
                            if (posY > this.height) {
                                posY = this.height;
                                velY = -velY * this.physics.restitution;
                            }

                            //Отскок от корзины
                            const targetHoop = this.elements.hoopTarget;
                            
                            const rightDistance = Math.sqrt((posX - targetHoop.rightPoint.x) ** 2 + (posY - targetHoop.rightPoint.y) ** 2);
                            const leftDistance = Math.sqrt((posX - targetHoop.leftPoint.x) ** 2 + (posY - targetHoop.leftPoint.y) ** 2);
                            
                            if (leftDistance < (ball.radius + BORDER_WIDTH / 2)) {
                                const nx = (posX - targetHoop.leftPoint.x) / leftDistance;
                                const ny = (posY - targetHoop.leftPoint.y) / leftDistance;

                                // Отскок с учетом коэффициента упругости
                                const dotProduct = velX * nx + velY * ny;
                                velX = (velX - 2 * dotProduct * nx) * this.physics.restitution;
                                velY = (velY- 2 * dotProduct * ny) * this.physics.restitution;

                                // Немного смещаем мяч чтобы избежать залипания
                                // posX = targetHoop.leftPoint.x + (ball.radius + BORDER_WIDTH / 2) * nx;
                                // posY = targetHoop.leftPoint.y + (ball.radius + BORDER_WIDTH / 2) * ny;
                            };

                            if (rightDistance < (ball.radius + BORDER_WIDTH / 2)) {
                                const nx = (posX - targetHoop.rightPoint.x) / rightDistance;
                                const ny = (posY - targetHoop.rightPoint.y) / rightDistance;

                                // Отскок с учетом коэффициента упругости
                                const dotProduct = velX * nx + velY * ny;
                                velX = (velX - 2 * dotProduct * nx) * this.physics.restitution;
                                velY = (velY - 2 * dotProduct * ny) * this.physics.restitution;

                                // Немного смещаем мяч чтобы избежать залипания
                                // posX = targetHoop.rightPoint.x + (ball.radius + BORDER_WIDTH / 2) * nx;
                                // posY = targetHoop.rightPoint.y + (ball.radius + BORDER_WIDTH / 2) * ny;
                            }

                        // Проверяем столкновение с правым ободом
                        
                            // const isLeftPoint = posX >= targetHoop.leftPoint.x && posX <= targetHoop.leftPoint.x + BORDER_WIDTH &&
                            //     posY >= targetHoop.leftPoint.y && posY <= targetHoop.leftPoint.y + BORDER_WIDTH;
                            // const isRightPoint = posX >= targetHoop.rightPoint.x && posX <= targetHoop.rightPoint.x + BORDER_WIDTH &&
                            //     posY >= targetHoop.rightPoint.y && posY <= targetHoop.rightPoint.y + BORDER_WIDTH;

                            // console.log(posX, isLeftPoint);

                            // if (isLeftPoint || isRightPoint) {
                            //     velX = -velX * this.physics.restitution;
                            //     velY = -velY * this.physics.restitution;
                            // }

                            this.points.push({ x: posX, y: posY });

                            if (i % 2 === 0 && this.shownPoints.length < 5 && i > 2) {
                                this.shownPoints.push({ x: posX, y: posY });
                            }
                        }

                        // Проверяем, кликнули ли по мячу
                        // const deltaY = (this.dragLast?.y ?? this.dragStart.y) - y;
                        hoop.launched = true;
                        this.dragLast = { x, y, yDelta };
                    },
                    handleMouseUp(e) {
                        if (this.isDragging) {
                            const rect = this.ctx.canvas.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            const timeElapsed = Date.now() - this.dragStart.time;
                            
                            this.handleRelease(x, y, timeElapsed);
                            this.isDragging = false;
                            this.elements.hoop.launched = false;
                            this.elements.hoop.newHeight = undefined;
                            // this.points = [];
                            this.shownPoints = [];
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
                        this.elements.ball.launched = true;
                        this.elements.ball.rotationSpeed = 1 / 3;
                        const { segmentTimes, segmentDurations } = this.calculateSegmentTimes();
                        this.segmentDurations = segmentDurations;
                        this.segmentTimes = segmentTimes;

                        // Рассчитываем силу броска на основе расстояния и времени
                        // const distanceX = x - this.dragStart.x;
                        // const distanceY = y - this.dragStart.y;
                        // const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                        
                        // Минимальная дистанция и время для броска
                        // if (distance > 10 && timeElapsed < 1000 && y < this.dragStart.y) {
                        //     const speedFactor = Math.min(1, distance / 100) * Math.min(1, 500 / timeElapsed);
                        //     const xTraj = -2300 * distanceX / distanceY * speedFactor;
                        //     this.launchBall(xTraj);
                        // }
                    },
                    launchBall(xTraj) {
                        const ball = this.elements.ball;
                        ball.launched = true;
                        ball.velocity.x = xTraj;
                        ball.velocity.y = -1750;
                        // Добавляем вращение как в оригинале
                        ball.rotationSpeed = xTraj / 3;
                        this.physics.gravity.y = 3000;
                        // setShowCurrentBest(false);
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
                    calculateDistances() {
                        const distances = [];
                        let totalDistance = 0;
                        
                        for (let i = 0; i < this.points.length - 1; i++) {
                            const dx = this.points[i + 1].x - this.points[i].x;
                            const dy = this.points[i + 1].y - this.points[i].y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            distances.push(distance);
                            totalDistance += distance;
                        }
                        
                        return { distances, totalDistance };
                    },
                    calculateSegmentTimes() {
                        const { distances, totalDistance } = this.calculateDistances();
                        const segmentTimes = [];
                        const segmentDurations = [];
                        this.totalTime = this.points.length * 0.5 * 1000;
                        
                        for (let i = 0; i < distances.length; i++) {
                            const duration = (distances[i] / totalDistance) * this.totalTime;
                            segmentDurations.push(duration);
                            
                            const startTime = i === 0 ? 0 : segmentTimes[i - 1].endTime;
                            segmentTimes.push({
                                startTime: startTime,
                                endTime: startTime + duration,
                                duration: duration
                            });
                        }
                        
                        return { segmentTimes, segmentDurations };
                    },
                    update(timestamp) {
                        const ball = this.elements.ball;
                        const hoop = this.elements.hoop;
                        
                        // const delta = deltaTime / 1000; // Преобразуем в секунды

                        if (hoop.launched && this.dragLast.yDelta < MAX_HOOP_HEIGHT && this.dragLast.yDelta >= DEFAULT_HOOP_HEIGHT) {
                            this.elements.hoop.height = this.dragLast.yDelta;
                            // console.log(ball.y);
                            ball.y = hoop.y + hoop.height - ball.radius;
                        } else if (!hoop.launched && this.elements.hoop.height > DEFAULT_HOOP_HEIGHT) {
                            this.elements.hoop.height -= 2;
                            // ball.y = hoop.y + hoop.height - ball.radius;
                        };

                        if (ball.launched) {
                            ball.rotation += ball.rotationSpeed;
                            if (!this.startTime) this.startTime = timestamp;
                            const elapsedTime = timestamp - this.startTime;

                            if (elapsedTime >= this.totalTime) {
                                ball.x = this.points[this.points.length - 1].x;
                                ball.y = this.points[this.points.length - 1].y;
                            }

                            // this.pointIndex = 0;
                            // this.speed = 0;
                            // console.log('update ebaniy');
                            let currentSegment = 0;
                            for (let i = 0; i < this.segmentTimes.length; i++) {
                                if (elapsedTime >= this.segmentTimes[i].startTime && elapsedTime <= this.segmentTimes[i].endTime) {
                                    currentSegment = i;
                                    break;
                                }
                            }
                            const segmentElapsed = elapsedTime - this.segmentTimes[currentSegment].startTime;
                            this.progress = segmentElapsed / this.segmentDurations[currentSegment];
                            
                            const currentPoint = this.points[currentSegment];
                            const nextPoint = this.points[currentSegment + 1];
                            const position = interpolate(currentPoint, nextPoint, this.progress);
                            const targetHoop = this.elements.hoopTarget;

                            console.log('ball.x', ball.x);
                            console.log('ball.y', ball.y);

                            if (ball.y > this.height - ball.radius) {
                                ball.launched = false;
                            }
                            if (
                                ball.y > targetHoop.rightPoint.y && 
                                ball.y > targetHoop.leftPoint.y && 
                                ball.y < targetHoop.leftPoint.y + BORDER_WIDTH &&
                                (ball.x + ball.radius) > targetHoop.leftPoint.x &&
                                (ball.x + ball.radius) < targetHoop.rightPoint.x
                        ) {
                                // ball.x = targetHoop.x + targetHoop.width / 2;
                                // ball.y = targetHoop.y + targetHoop.height - ball.radius / 2;
                               
                                console.log('targetHoop.leftPoint.x', targetHoop.leftPoint.x);
                                console.log('targetHoop.rightPoint.x', targetHoop.rightPoint.x);
                                console.log('targetHoop.y + targetHoop.height', targetHoop.y + targetHoop.height - ball.radius);
                                ball.launched = false;
                            }
                            
                            // const rightDistance = Math.sqrt((ball.x - targetHoop.rightPoint.x) ** 2 + (ball.y - targetHoop.rightPoint.y) ** 2);
                            // const leftDistance = Math.sqrt((ball.x - targetHoop.leftPoint.x) ** 2 + (ball.y - targetHoop.leftPoint.y) ** 2);
                            

                            // if (
                            //     ball.x + ball.radius > rightDistance &&
                            //     ball.x > leftDistance
                            // ) {
                            //     ball.launched = false;
                            // }

                            ball.x = position.x;
                            ball.y = position.y;
                        }

                       

                        // if (ball.launched) {
                        //   // Применяем гравитацию
                        //   ball.velocity.y += this.physics.gravity.y * delta;

                        //   // Применяем вращение
                        //   ball.rotation += ball.rotationSpeed * delta;

                        //   // Сохраняем предыдущую позицию для обнаружения прохождения через кольцо
                        //   const prevY = ball.y;

                        //   // Обновляем позицию
                        //   ball.x += ball.velocity.x * delta;
                        //   ball.y += ball.velocity.y * delta;

                        //   // Проверяем столкновения с корзиной
                        //   this.checkBasketCollision();

                        //   // Проверяем, прошёл ли мяч через кольцо (движется вниз и пересек уровень обода)
                        //   if (ball.velocity.y > 0 && prevY <= 188 && ball.y > 188 && !ball.isBelowHoop) {
                        //     ball.isBelowHoop = true;

                        //     // Проверяем, попал ли мяч в корзину (по горизонтали между ободами)
                        //     if (ball.x > 151 && ball.x < 249) {
                        //       // Засчитываем очко
                        //       setCurrentScore(prev => prev + 1);
                        //     } else {
                        //       // Сбрасываем счет, если промах
                        //       if (currentScore > highScore) {
                        //         setHighScore(currentScore);
                        //       }
                        //       setCurrentScore(0);
                        //       setShowCurrentBest(true);
                        //     }
                        //   }

                        //   // Проверяем, улетел ли мяч за пределы
                        //   if (ball.y > 1200) {
                        //     this.resetBall();
                        //   }

                        //   // Ограничиваем мяч границами canvas по горизонтали
                        //   if (ball.x - ball.radius < 0) {
                        //     ball.x = ball.radius;
                        //     ball.velocity.x = Math.abs(ball.velocity.x) * this.physics.restitution;
                        //   } else if (ball.x + ball.radius > this.ctx.canvas.width) {
                        //     ball.x = this.ctx.canvas.width - ball.radius;
                        //     ball.velocity.x = -Math.abs(ball.velocity.x) * this.physics.restitution;
                        //   }
                        // }
                    },
                    resetBall() {
                        this.physics.gravity.y = 0;

                        // Случайная позиция по X в пределах canvas (с отступами от краев)
                        const canvasWidth = this.ctx.canvas.width;
                        const minX = 60;
                        const maxX = canvasWidth - 60;
                        const randomX = minX + Math.random() * (maxX - minX);

                        this.elements.ball = {
                            // x: currentScore === 0 ? 200 : randomX,
                            x: 200,
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

                        // Рисуем мяч с вращением
                        const ball = this.elements.ball;
                        const ballImg = this.images.ball;
                        const backRimImg = this.images.backRim;

                        const hoop = this.elements.hoop;
                        const hoopTarget = this.elements.hoopTarget;

                        if (backRimImg) {
                            const rimBack = this.elements.hoopRimBack;
                            const rimBackTarget = this.elements.hoopRimBackTarget;
                            ctx.save();
                            ctx.translate((hoop.x + hoop.width / 2), (hoop.y + hoop.height / 2));
                            ctx.rotate(hoop.targetRotation);
                            ctx.drawImage(backRimImg, -rimBack.width / 2, -DEFAULT_HOOP_HEIGHT - 2 - ((hoop.height - DEFAULT_HOOP_HEIGHT) / 2),
                                rimBack.width, rimBack.height);
                            ctx.restore();
                            ctx.save();
                            ctx.translate((hoopTarget.x + hoopTarget.width / 2), (hoopTarget.y + hoopTarget.height / 2));
                            ctx.rotate(hoopTarget.targetRotation);
                            ctx.drawImage(backRimImg, -rimBackTarget.width / 2, -DEFAULT_HOOP_HEIGHT - 2,
                                rimBackTarget.width, rimBackTarget.height);
                            ctx.restore();
                        }

                        if (ballImg) {
                            ctx.save();
                            if (ball.rotation !== 0) {
                                ctx.translate(ball.x, ball.y);
                                ctx.rotate(ball.rotation);
                                ctx.drawImage(ballImg, -ball.radius, -ball.radius, ball.radius * 2, ball.radius * 2);
                            } else {
                                ctx.translate((hoop.x + hoop.width / 2), (hoop.y + hoop.height / 2));
                                ctx.rotate(hoop.targetRotation);
                                ctx.drawImage(ballImg, -ball.radius, hoop.height - 2.76 * ball.radius - (hoop.height - DEFAULT_HOOP_HEIGHT) / 2, ball.radius * 2, ball.radius * 2);
                            }
                            ctx.restore();
                        }

                        // Рисуем кольцо
                        const hoopImg = this.images.hoop;
                        if (hoopImg) {
                            ctx.save();
                            ctx.translate((hoop.x + hoop.width / 2), (hoop.y + hoop.height / 2));
                            ctx.rotate(hoop.targetRotation);
                            ctx.drawImage(hoopImg, -this.elements.hoop.width / 2, -this.elements.hoop.height / 2,
                                this.elements.hoop.width, this.elements.hoop.height);
                            ctx.restore();
                            ctx.save();
                            ctx.translate((hoopTarget.x + hoopTarget.width / 2), (hoopTarget.y + hoopTarget.height / 2));
                            ctx.rotate(hoopTarget.targetRotation);
                            ctx.drawImage(hoopImg, -hoopTarget.width / 2, -hoopTarget.height / 2,
                                hoopTarget.width, hoopTarget.height);
                            ctx.restore();
                        }

                        const rimImg = this.images.frontRim;

                        if (rimImg) {
                            const rimFront = this.elements.hoopRimFront;
                            const rimFrontTarget = this.elements.hoopRimFrontTarget;
                            ctx.save();
                            ctx.translate((hoop.x + hoop.width / 2), (hoop.y + hoop.height / 2));
                            ctx.rotate(hoop.targetRotation);
                            ctx.drawImage(rimImg, -rimFront.width / 2, -DEFAULT_HOOP_HEIGHT - 5 - ((hoop.height - DEFAULT_HOOP_HEIGHT) / 2),
                                rimFront.width, rimFront.height);
                            ctx.restore();

                            ctx.save();
                            ctx.translate((hoopTarget.x + hoopTarget.width / 2), (hoopTarget.y + hoopTarget.height / 2));
                            ctx.rotate(hoopTarget.targetRotation);
                            ctx.drawImage(rimImg, -rimFrontTarget.width / 2, -DEFAULT_HOOP_HEIGHT - 5,
                                rimFrontTarget.width, rimFrontTarget.height);
                            ctx.restore();
                        }

                        ctx.beginPath();
                        ctx.rect(hoopTarget.leftPoint.x, hoopTarget.leftPoint.y, BORDER_WIDTH, BORDER_WIDTH);
                        ctx.fillStyle = 'green';
                        ctx.fill();

                        ctx.beginPath();
                        ctx.rect(hoopTarget.rightPoint.x, hoopTarget.rightPoint.y, BORDER_WIDTH, BORDER_WIDTH);
                        ctx.fillStyle = 'green';
                        ctx.fill();

                        if (hoop.launched && hoop.height > DEFAULT_HOOP_HEIGHT) {
                            for (let i = 0; i < this.shownPoints.length; i++) {
                                ctx.beginPath();
                                ctx.arc(this.shownPoints[i].x, this.shownPoints[i].y, 10, 0, 2 * Math.PI);
                                ctx.fillStyle = 'red';
                                ctx.fill();
                            }
                        }
                    },
                    gameLoop(timestamp) {
                        if (!this.isRunning) return;

                        const deltaTime = timestamp - (this.lastTime || timestamp);
                        this.lastTime = timestamp;

                        this.update(timestamp);
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
    }, []);

    return { gameContainerRef };

}