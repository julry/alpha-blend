import { useEffect, useRef, useState } from "react";
import { useSizeRatio } from "../../../../hooks/useSizeRatio";
import { GAME_POINTS, MIN_BALL_POSITION } from "./constants";

export const useGame = ({ width, height, dpr, initialPuzzles, fieldPic }) => {
    const ratio = useSizeRatio();
    const gameContainerRef = useRef(null);
    const [currentScore, setCurrentScore] = useState(0);
    const gameRef = useRef(null);

    // Функция для предзагрузки изображений
    const preloadImages = () => {
        const puzzlesImages = initialPuzzles.reduce((res, puzzle) => {
            res[puzzle.id] = puzzle.image;

            return res;
        }, {});

        const images = {...puzzlesImages, 'field': fieldPic };

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
        if (!height || !width || !dpr) return;
        // Инициализация игры после монтирования компонента
        const initGame = async () => {
            if (!gameContainerRef.current || gameRef.current) return;

            try {
                // Предзагрузка изображений
                const loadedImages = await preloadImages();

                const game = {
                    images: {},
                    puzzles: {},
                    unlockedPuzzles: [],
                    lockedPuzzles: [],
                    width: width,
                    height: height,
                    selectedPiece: null,
                    dpr,
                    dragOffsetX: 0,
                    dragOffsetY: 0,
                    isRunning: true,
                    init() {
                        // Сохраняем загруженные изображения
                        loadedImages.forEach(({ name, img }) => {
                            this.images[name] = img;
                        });

                        // Создаем холст для игры
                        const canvas = document.createElement('canvas');

                        canvas.width = width * dpr;
                        canvas.height = height * dpr;
                        canvas.style.margin = '0 auto';
                        canvas.style.display = 'block';
                        canvas.style.width = width + 'px';
                        canvas.style.height = height + 'px';
                        canvas.style.backgroundColor = '#ffffff';

                        gameContainerRef.current.innerHTML = '';
                        gameContainerRef.current.appendChild(canvas);

                        const ctx = canvas.getContext('2d');
                        
                        ctx.scale(dpr, dpr);

                        this.ctx = ctx;
                        this.canvas = canvas;

                        // Создаем элементы игры
                        this.createGameElements();

                        // Запускаем игровой цикл
                        this.gameLoop();
                    },
                    createGameElements() {
                        initialPuzzles.forEach((puzzle) => {
                            const updatedPuzzle = { 
                                ...puzzle, 
                                width: puzzle.width * ratio, 
                                height: puzzle.height * ratio,
                                position: { x: puzzle.position.x * ratio, y: puzzle.position.y * ratio },
                                isLocked: false,
                                verticesRel: puzzle.verticesRel.map(({x,y}) => ({x: x*ratio, y: y*ratio}))
                            };
                            this.unlockedPuzzles.push(updatedPuzzle);
                            this.puzzles[puzzle.id] = updatedPuzzle;
                        })
                        // Настраиваем обработчики событий
                        const canvas = this.canvas;
                        canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
                        canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
                        canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
                        canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
                        canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
                    },
                    checkPosition() {
                        if (!this.isDragging || !this.selectedPiece) return;

                        this.isDragging = false;
                        
                        const piece = this.puzzles[this.selectedPiece.id];
                        const originalX = (piece.originalPosition.x + (width - 333 * ratio) / 2);
                        const originalY = piece.originalPosition.y + (height - 486 * ratio) / 2;
                        const dx = piece.position.x - originalX;
                        const dy = piece.position.y - originalY;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                            
                        if (distance < 20) {
                            setCurrentScore(prev => prev + 10);
                            this.puzzles[this.selectedPiece.id] = {...piece, position: {...piece.originalPosition, x: originalX, y: originalY}, isLocked: true};
                            this.lockedPuzzles.push({...piece, position: {...piece.originalPosition, x: originalX, y: originalY}, isLocked: true});
                            this.unlockedPuzzles = this.unlockedPuzzles.filter(puzz => puzz.id !== piece.id);
                        }

                        this.selectedPiece = null;
                    },
                    isPointInPolygon(point, polygon) {
                        let inside = false;
                        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                            const xi = polygon[i].x, yi = polygon[i].y;
                            const xj = polygon[j].x, yj = polygon[j].y;

                            const intersect = ((yi > point.y) !== (yj > point.y)) &&
                                (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);

                            if (intersect) inside = !inside;
                        }
                        return inside;
                    },
                    checkClickOnShape(clickX, clickY, shape) {
                        // shape имеет: startX, startY, verticesRel (относительные координаты вершин), width, height
                        // Проверка ограничивающего прямоугольника
                        if (clickX < shape.position.x || clickX > shape.position.x + shape.width ||
                            clickY < shape.position.y || clickY > shape.position.y + shape.height) {
                                console.log('ne podoshlo :(')
                            return false;
                        }
                        
                        // Преобразование вершин в абсолютные координаты
                        const absVertices = shape.verticesRel.map(vertex => ({
                            x: shape.position.x + vertex.x,
                            y: shape.position.y + vertex.y
                        }));
                        
                        // Проверка попадания в многоугольник
                        return this.isPointInPolygon({x: clickX, y: clickY}, absVertices);
                    },
                    getSelectedPiece(x, y) {
                        // const selected = [];
                        //TODO выяснить какой кусок лежит выше
                        for (let i = 0; i < Object.values(this.puzzles).length; i++) {
                            const piece = Object.values(this.puzzles)[i];
                            console.log(piece.isLocked);
                            if (this.checkClickOnShape(x, y, piece) && !piece?.isLocked) {
                                console.log('vot on')
                                this.selectedPiece = piece;
                                break;
                            }
                        }
                    },
                    handleMouseDown(e) {
                        const rect = this.canvas.getBoundingClientRect();
                    
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;

                        this.getSelectedPiece(x, y);

                        if (this.selectedPiece) {
                            this.isDragging = true;
                            this.dragOffsetX = x - this.selectedPiece.position.x;
                            this.dragOffsetY = y - this.selectedPiece.position.y;
                        };
                    },
                    handleMouseUp() {
                        this.checkPosition();
                        this.isDragging = false;
                    },
                    handleTouchStart(e) {
                        e.preventDefault();
                        this.isDragging = true;

                        if (e.touches.length === 1) {
                            const rect = this.canvas.getBoundingClientRect();
                    
                            const x = e.touches[0].clientX - rect.left;
                            const y = e.touches[0].clientY - rect.top;

                            this.getSelectedPiece(x, y);

                             if (this.selectedPiece) {
                                this.isDragging = true;
                                this.dragOffsetX = x - this.selectedPiece.position.x;
                                this.dragOffsetY = y - this.selectedPiece.position.y;
                            };
                        }
                    },
                    handleTouchEnd() {
                        this.checkPosition();
                        this.isDragging = false;
                    },
                    handleMouseMove(e) {
                        if (!this.selectedPiece || !this.isDragging) return;
                        const rect = this.canvas.getBoundingClientRect();
                    
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;

                        let puzzleX = x - this.dragOffsetX;
                        let puzzleY = y - this.dragOffsetY;

                        if (puzzleX > (width - (this.selectedPiece.width / 2))) {
                            puzzleX = width - (this.selectedPiece.width / 2);
                        }

                        if (puzzleY > (height - (this.selectedPiece.height / 2))) {
                            puzzleY = height - this.selectedPiece.height;
                        }
                        this.puzzles[this.selectedPiece.id].position.x = puzzleX < 0 ? 0 : puzzleX;
                        this.puzzles[this.selectedPiece.id].position.y = puzzleY < 0 ? 0 : puzzleY;
                    },
                    render() {
                        const ctx = this.ctx;
                        const canvas = this.canvas;

                        // Очищаем холст
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        const backImg = this.images.field;
                        if (backImg) {
                            ctx.drawImage(backImg, (width - 333*ratio) / 2, (height - 486 * ratio) / 2, 333 * ratio, 486 * ratio);
                        }

                        const puzzles = Object.values(this.puzzles);

                        for (let i = 0; i < this.lockedPuzzles.length; i++) {
                            const puzzle = this.lockedPuzzles[i];
                            const puzzImage = this.images[puzzle.id];
                            if (!puzzImage) return;

                            ctx.drawImage(puzzImage, puzzle.position.x, puzzle.position.y, puzzle.width, puzzle.height)
                        }

                        for (let i = 0; i < puzzles.length; i++) {
                            const puzzle = puzzles[i];
                            if (puzzle.isLocked) return;

                            const puzzImage = this.images[puzzle.id];
                            if (!puzzImage) return;

                            ctx.drawImage(puzzImage, puzzle.position.x, puzzle.position.y, puzzle.width, puzzle.height)
                        }
                    },
                    gameLoop() {
                        if (!this.isRunning) return;

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
                console.log('aleee');

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
    }, [ratio, width, height, dpr]);

    return { gameContainerRef, currentScore, setCurrentScore };
}