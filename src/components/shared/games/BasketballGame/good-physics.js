import React, { useState, useRef, useEffect, useCallback } from 'react';
import './BasketballGame.css';

const BasketballGame = () => {
  const [ballPosition, setBallPosition] = useState({ x: 80, y: 517 });
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [baskets, setBaskets] = useState([
    { id: 1, x: 50, y: 497, width: 60, height: 40, rotation: 45, hasBall: true, isSlingshot: true },
    { id: 2, x: 250, y: 397, width: 60, height: 40, rotation: -45, hasBall: false, isSlingshot: false }
  ]);
  const [gameState, setGameState] = useState('playing');
  const [score, setScore] = useState(0);
  const [trajectory, setTrajectory] = useState([]);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const gameAreaRef = useRef(null);
  const animationRef = useRef(null);

  const GRAVITY = 0.4;
  const FRICTION = 0.98;
  const BOUNCE = 0.7;
  const SLINGSHOT_POWER = 0.15;

  const getCurrentSlingshot = useCallback(() => {
    return baskets.find(basket => basket.isSlingshot);
  }, [baskets]);

  const checkBasketCollision = useCallback((ballX, ballY, basket) => {
    if (basket.isSlingshot) return false; // Не проверяем столкновение с рогаткой
    
    const basketCenterX = basket.x + basket.width / 2;
    const basketCenterY = basket.y + basket.height / 2;
    
    const isInBasket = ballX > basket.x - 15 && 
                      ballX < basket.x + basket.width + 15 && 
                      ballY > basket.y - 15 && 
                      ballY < basket.y + basket.height + 15;
    
    const distanceToCenter = Math.sqrt(
      Math.pow(ballX - basketCenterX, 2) + 
      Math.pow(ballY - basketCenterY, 2)
    );
    
    return isInBasket && distanceToCenter < 30;
  }, []);

  const updateBallPosition = useCallback(() => {
    setBallPosition(prev => {
      let newX = prev.x + velocity.x;
      let newY = prev.y + velocity.y;
      let newVelX = velocity.x * FRICTION;
      let newVelY = velocity.y + GRAVITY;

      // Столкновение с границами
      if (newX <= 15 || newX >= 360) {
        newX = newX <= 15 ? 15 : 360;
        newVelX = -newVelX * BOUNCE;
      }

      if (newY <= 15 || newY >= 662) {
        newY = newY <= 15 ? 15 : 662;
        newVelY = -newVelY * BOUNCE;
      }

      // Проверка попадания в корзины (кроме рогатки)
      const targetBasket = baskets.find(basket => !basket.isSlingshot);
      if (targetBasket && checkBasketCollision(newX, newY, targetBasket)) {
        setVelocity({ x: 0, y: 0 });
        setScore(prev => prev + 1);
        
        // Создаем новую корзину-цель
        const newTargetBasket = {
          id: Date.now(),
          x: Math.random() > 0.5 ? 50 : 250,
          y: Math.random() * 200 + 100,
          width: 60,
          height: 40,
          rotation: Math.random() > 0.5 ? 45 : -45,
          hasBall: false,
          isSlingshot: false
        };
        
        // Меняем роли: текущая цель становится рогаткой
        setBaskets(prev => [
          { ...getCurrentSlingshot(), hasBall: false, isSlingshot: false },
          { ...prev.find(b => !b.isSlingshot), hasBall: true, isSlingshot: true },
          newTargetBasket
        ].filter(basket => basket.id !== targetBasket.id));

        return { x: newX, y: newY };
      }

      setVelocity({ x: newVelX, y: newVelY });

      // Если мяч остановился и не попал в корзину
      if (Math.abs(newVelX) < 0.5 && Math.abs(newVelY) < 0.5 && newY >= 650) {
        setGameState('failed');
      }

      return { x: newX, y: newY };
    });
  }, [velocity, baskets, checkBasketCollision, getCurrentSlingshot]);

  useEffect(() => {
    if (isDragging) {
      const slingshot = getCurrentSlingshot();
      if (!slingshot) return;

      const slingshotCenter = {
        x: slingshot.x + slingshot.width / 2,
        y: slingshot.y + slingshot.height / 2
      };

      // Расчет траектории
      const points = [];
      const power = Math.sqrt(dragOffset.x * dragOffset.x + dragOffset.y * dragOffset.y) * SLINGSHOT_POWER;
      
      // Направление броска (противоположное drag)
      const angle = Math.atan2(-dragOffset.y, -dragOffset.x);
      let velX = Math.cos(angle) * power * 12;
      let velY = Math.sin(angle) * power * 12;
      
      let posX = slingshotCenter.x;
      let posY = slingshotCenter.y;

      // Рассчитываем траекторию
      for (let i = 0; i < 20; i++) {
        velY += GRAVITY;
        posX += velX;
        posY += velY;
        velX *= FRICTION;
        velY *= FRICTION;

        // Отскоки от границ
        if (posX < 15) {
          posX = 15;
          velX = -velX * BOUNCE;
        }
        if (posX > 360) {
          posX = 360;
          velX = -velX * BOUNCE;
        }
        if (posY < 15) {
          posY = 15;
          velY = -velY * BOUNCE;
        }
        if (posY > 662) {
          posY = 662;
          velY = -velY * BOUNCE;
        }

        points.push({ x: posX, y: posY });
      }

      setTrajectory(points);
    }
  }, [isDragging, dragOffset, getCurrentSlingshot]);

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
    if (gameState === 'failed') return;

    const touch = e.touches[0];
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const slingshot = getCurrentSlingshot();
    if (!slingshot) return;

    const slingshotCenter = {
      x: slingshot.x + slingshot.width / 2,
      y: slingshot.y + slingshot.height / 2
    };

    const distance = Math.sqrt(Math.pow(x - slingshotCenter.x, 2) + Math.pow(y - slingshotCenter.y, 2));
    if (distance < 50) {
      setIsDragging(true);
      setDragOffset({ x: 0, y: 0 });
      setVelocity({ x: 0, y: 0 });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const slingshot = getCurrentSlingshot();
    if (!slingshot) return;

    const slingshotCenter = {
      x: slingshot.x + slingshot.width / 2,
      y: slingshot.y + slingshot.height / 2
    };

    // Ограничиваем максимальное растяжение
    const maxDrag = 150;
    let offsetX = (x - slingshotCenter.x) * 0.8;
    let offsetY = (y - slingshotCenter.y) * 0.8;

    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
    if (distance > maxDrag) {
      offsetX = (offsetX / distance) * maxDrag;
      offsetY = (offsetY / distance) * maxDrag;
    }

    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    
    const slingshot = getCurrentSlingshot();
    if (!slingshot) return;

    // Запускаем мяч
    const power = Math.sqrt(dragOffset.x * dragOffset.x + dragOffset.y * dragOffset.y) * SLINGSHOT_POWER;
    const angle = Math.atan2(-dragOffset.y, -dragOffset.x);
    
    const newVelX = Math.cos(angle) * power * 10;
    const newVelY = Math.sin(angle) * power * 10;

    setVelocity({ x: newVelX, y: newVelY });
    
    // Устанавливаем мяч в центр рогатки перед броском
    const slingshotCenter = {
      x: slingshot.x + slingshot.width / 2,
      y: slingshot.y + slingshot.height / 2
    };
    setBallPosition(slingshotCenter);

    setTrajectory([]);
    setDragOffset({ x: 0, y: 0 });
  };

  const resetGame = () => {
    setBallPosition({ x: 80, y: 517 });
    setVelocity({ x: 0, y: 0 });
    setBaskets([
      { id: 1, x: 50, y: 497, width: 60, height: 40, rotation: 45, hasBall: true, isSlingshot: true },
      { id: 2, x: 250, y: 397, width: 60, height: 40, rotation: -45, hasBall: false, isSlingshot: false }
    ]);
    setGameState('playing');
    setTrajectory([]);
    setDragOffset({ x: 0, y: 0 });
  };

  const slingshot = getCurrentSlingshot();
  const slingshotCenter = slingshot ? {
    x: slingshot.x + slingshot.width / 2,
    y: slingshot.y + slingshot.height / 2
  } : { x: 0, y: 0 };

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
            className={`basket ${basket.isSlingshot ? 'slingshot' : ''} ${basket.hasBall ? 'with-ball' : ''}`}
            style={{
              left: basket.x,
              top: basket.y,
              width: basket.width,
              height: basket.height,
              transform: `rotate(${basket.rotation}deg)`
            }}
          >
            {basket.hasBall && basket.isSlingshot && (
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

        {/* Мяч */}
        <div
          className="ball"
          style={{
            left: ballPosition.x - 15,
            top: ballPosition.y - 15,
            transition: isDragging ? 'none' : 'all 0.1s ease'
          }}
        />

        {/* Линии рогатки */}
        {isDragging && slingshot && (
          <>
            <div
              className="slingshot-line"
              style={{
                left: slingshotCenter.x,
                top: slingshotCenter.y,
                width: Math.sqrt(dragOffset.x * dragOffset.x + dragOffset.y * dragOffset.y),
                transform: `rotate(${Math.atan2(dragOffset.y, dragOffset.x) * 180 / Math.PI}deg)`,
              }}
            />
            <div
              className="slingshot-handle"
              style={{
                left: slingshotCenter.x + dragOffset.x - 10,
                top: slingshotCenter.y + dragOffset.y - 10
              }}
            />
          </>
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
              transform: `scale(${1 - index * 0.05})`
            }}
          />
        ))}

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