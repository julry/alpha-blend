import { useGame } from './useGame';

const WorkBasketballGame = () => {
  const {gameContainerRef, showCurrentBest, currentScore} = useGame();

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

export default WorkBasketballGame;