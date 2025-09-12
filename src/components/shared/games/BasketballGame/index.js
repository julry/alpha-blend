import React, { useEffect, useRef, useState } from 'react';
import { useGame } from './useGame copy2';
import { FlexWrapper } from '../../ContentWrapper';
import styled from 'styled-components';


const BasketballGame = () => {
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showCurrentBest, setShowCurrentBest] = useState(false);

  // Функция для предзагрузки изображений
  const {gameContainerRef} = useGame();

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div ref={gameContainerRef} style={{ display: 'inline-block' }}></div>
        {/* Оверлей для отображения счета поверх игры */}
        <div style={{
          position: 'absolute',
          top: '312px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          width: '100%'
        }}>
          {showCurrentBest && (
            <div style={{
              fontFamily: 'Arial',
              fontSize: '20px',
              color: '#000',
              position: 'absolute',
              top: '-31px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%'
            }}>
              Current Best
            </div>
          )}
          <div style={{
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#000'
          }}>
            {currentScore}
          </div>
          {/* {showCurrentBest && (
            <div style={{
              fontFamily: 'Arial',
              fontSize: '40px',
              color: '#00e6e6',
              position: 'absolute',
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%'
            }}>
              {highScore}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default BasketballGame;