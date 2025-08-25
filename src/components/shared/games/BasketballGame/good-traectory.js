import React, { useState, useRef, useEffect, useCallback } from 'react';
import './BasketballGame.css';

const BasketballGame = () => {
  const [ballPosition, setBallPosition] = useState({ x: 80, y: 517 });
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [baskets, setBaskets] = useState([
    { id: 1, x: 50, y: 497, width: 60, height: 40, rotation: 45, hasBall: true },
    { id: 2, x: 250, y: 397, width: 60, height: 40, rotation: -45, hasBall: false }
  ]);
  const [gameState, setGameState] = useState('playing');
  const [score, setScore] = useState(0);
  const [trajectory, setTrajectory] = useState([]);
  const [ballInBasket, setBallInBasket] = useState(true);

  const gameAreaRef = useRef(null);
  const animationRef = useRef(null);
  const dragStartRef = useRef(null);
  const dragCurrentRef = useRef(null);

  const GRAVITY = 0.3;
  const FRICTION = 0.96;
  const BOUNCE = 0.6;

  const checkBasketCollision = useCallback((ballX, ballY, basket) => {
    const basketCenterX = basket.x + basket.width / 2;
    const basketCenterY = basket.y + basket.height / 2;
    
    const isInBasket = ballX > basket.x && 
                      ballX < basket.x + basket.width && 
                      ballY > basket.y && 
                      ballY < basket.y + basket.height;
    
    const distanceToCenter = Math.sqrt(
      Math.pow(ballX - basketCenterX, 2) + 
      Math.pow(ballY - basketCenterY, 2)
    );
    
    return isInBasket && distanceToCenter < 20;
  }, []);

  const updateBallPosition = useCallback(() => {
    setBallPosition(prev => {
      let newX = prev.x + velocity.x;
      let newY = prev.y + velocity.y;
      let newVelX = velocity.x * FRICTION;
      let newVelY = velocity.y + GRAVITY;

      if (newX <= 0 || newX >= 375) {
        newX = newX <= 0 ? 0 : 375;
        newVelX = -newVelX * BOUNCE;
      }

      if (newY <= 0 || newY >= 677) {
        newY = newY <= 0 ? 0 : 677;
        newVelY = -newVelY * BOUNCE;
      }

      let scored = false;
      const updatedBaskets = baskets.map(basket => {
        if (!basket.hasBall && checkBasketCollision(newX, newY, basket)) {
          scored = true;
          return { ...basket, hasBall: true };
        }
        return basket;
      });

      if (scored) {
        setVelocity({ x: 0, y: 0 });
        setScore(prev => prev + 1);
        setBallInBasket(true);
        
        const newBasketId = Date.now();
        const newBasket = {
          id: newBasketId,
          x: Math.random() > 0.5 ? 50 : 250,
          y: Math.random() * 200 + 100,
          width: 60,
          height: 40,
          rotation: Math.random() > 0.5 ? 45 : -45,
          hasBall: false
        };
        
        setBaskets(prev => [...prev.filter(b => !b.hasBall), newBasket]);
        
        // Не перемещаем мяч сразу, он будет лететь к новой корзине
        return { x: newX, y: newY };
      }

      setVelocity({ x: newVelX, y: newVelY });

      if (Math.abs(newVelX) < 0.1 && Math.abs(newVelY) < 0.1 && newY >= 650) {
        setGameState('failed');
        return prev;
      }

      return { x: newX, y: newY };
    });
  }, [velocity, baskets, checkBasketCollision]);

  useEffect(() => {
    if (isDragging && dragStartRef.current && dragCurrentRef.current) {
      const startX = dragStartRef.current.x;
      const startY = dragStartRef.current.y;
      const currentX = dragCurrentRef.current.x;
      const currentY = dragCurrentRef.current.y;

      // Расчет траектории
      const points = [];
      let velX = (startX - currentX) / 10;
      let velY = (startY - currentY) / 10;
      let posX = ballPosition.x;
      let posY = ballPosition.y;

      // Рассчитываем 6 точек траектории
      for (let i = 0; i < 6; i++) {
        velY += GRAVITY;
        posX += velX * 2;
        posY += velY * 2;
        velX *= FRICTION;
        velY *= FRICTION;

        // Отскок от границ
        if (posX < 0) {
          posX = 0;
          velX = -velX * BOUNCE;
        }
        if (posX > 375) {
          posX = 375;
          velX = -velX * BOUNCE;
        }
        if (posY < 0) {
          posY = 0;
          velY = -velY * BOUNCE;
        }
        if (posY > 677) {
          posY = 677;
          velY = -velY * BOUNCE;
        }

        points.push({ x: posX, y: posY });
      }

      setTrajectory(points);
    }
  }, [isDragging, ballPosition]);

  useEffect(() => {
    if (gameState === 'playing' && !isDragging && (velocity.x !== 0 || velocity.y !== 0)) {
      animationRef.current = requestAnimationFrame(() => {
        updateBallPosition();
      });
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, isDragging, velocity, updateBallPosition]);

  const handleTouchStart = (e) => {
    if (gameState === 'failed' || !ballInBasket) return;

    const touch = e.touches[0];
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const distance = Math.sqrt(Math.pow(x - ballPosition.x, 2) + Math.pow(y - ballPosition.y, 2));
    if (distance < 25) {
      setIsDragging(true);
      dragStartRef.current = { x: ballPosition.x, y: ballPosition.y };
      dragCurrentRef.current = { x, y };
      setVelocity({ x: 0, y: 0 });
      setBallInBasket(false);
      
      // Убираем мяч из корзины
      setBaskets(prev => prev.map(basket => ({
        ...basket,
        hasBall: false
      })));
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const maxDragDistance = 100;
    const dragX = Math.max(Math.min(x, dragStartRef.current.x + maxDragDistance), dragStartRef.current.x - maxDragDistance);
    const dragY = Math.max(Math.min(y, dragStartRef.current.y + maxDragDistance), dragStartRef.current.y - maxDragDistance);

    dragCurrentRef.current = { x: dragX, y: dragY };
    
    // Обновляем позицию мяча при dragging
    setBallPosition({
      x: dragStartRef.current.x + (dragStartRef.current.x - dragX) * 0.3,
      y: dragStartRef.current.y + (dragStartRef.current.y - dragY) * 0.3
    });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    setTrajectory([]);

    if (dragStartRef.current && dragCurrentRef.current) {
      const power = 0.25;
      const newVelX = (dragStartRef.current.x - dragCurrentRef.current.x) * power;
      const newVelY = (dragStartRef.current.y - dragCurrentRef.current.y) * power;
      
      setVelocity({ x: newVelX, y: newVelY });
    }
  };

  const resetGame = () => {
    setBallPosition({ x: 80, y: 517 });
    setVelocity({ x: 0, y: 0 });
    setBaskets([
      { id: 1, x: 50, y: 497, width: 60, height: 40, rotation: 45, hasBall: true },
      { id: 2, x: 250, y: 397, width: 60, height: 40, rotation: -45, hasBall: false }
    ]);
    setGameState('playing');
    setBallInBasket(true);
  };

  return (
    <div className="game-container">
      <div className="score">Score: {score}</div>
      
      <div 
        ref={gameAreaRef}
        className="game-area"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ width: '375px', height: '677px' }}
      >
        {/* Корзины */}
        {baskets.map(basket => (
          <div
            key={basket.id}
            className={`basket ${basket.hasBall ? 'with-ball' : ''}`}
            style={{
              left: basket.x,
              top: basket.y,
              width: basket.width,
              height: basket.height,
              transform: `rotate(${basket.rotation}deg)`
            }}
          >
            {basket.hasBall && ballInBasket && (
              <div 
                className="basket-ball"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )}
          </div>
        ))}

        {/* Мяч - всегда виден, кроме когда в корзине */}
        {!ballInBasket && (
          <div
            className="ball"
            style={{
              left: ballPosition.x - 15,
              top: ballPosition.y - 15,
              transform: isDragging ? 'scale(1.2)' : 'scale(1)'
            }}
          />
        )}

        {/* Траектория */}
        {trajectory.map((point, index) => (
          <div
            key={index}
            className="trajectory-point"
            style={{
              left: point.x - 3,
              top: point.y - 3,
              width: '6px',
              height: '6px',
              opacity: 1 - (index / trajectory.length * 0.8),
              transform: `scale(${1 - index * 0.15})`
            }}
          />
        ))}

        {/* Линия направления броска */}
        {isDragging && dragStartRef.current && dragCurrentRef.current && (
          <div
            className="drag-line"
            style={{
              left: dragStartRef.current.x,
              top: dragStartRef.current.y,
              width: Math.sqrt(
                Math.pow(dragCurrentRef.current.x - dragStartRef.current.x, 2) +
                Math.pow(dragCurrentRef.current.y - dragStartRef.current.y, 2)
              ),
              transform: `rotate(${Math.atan2(
                dragCurrentRef.current.y - dragStartRef.current.y,
                dragCurrentRef.current.x - dragStartRef.current.x
              ) * 180 / Math.PI}deg)`,
              opacity: 0.7
            }}
          />
        )}

        {gameState === 'failed' && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>Final Score: {score}</p>
            <button onClick={resetGame}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasketballGame;