import { useRef } from 'react';
import './App.css';
import { useGame } from './useGame';
import { BALL_RADIUS, HOOP_DEPTH, HOOP_HEIGHT, HOOP_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH } from './constants';


const App = () => {
    const gameAreaRef = useRef(null);
    //TODO: перенести стили
    //TODO: добавить все остальное
    const {
        handleTouchEnd,
        handleTouchMove,
        handleTouchStart,
        resetGame,
        gameOver,
        trajectory,
        score,
        hoops,
        ballPosition,
    } = useGame({gameAreaRef})
    return (
        <div className="game-container">
            <div
                ref={gameAreaRef}
                className="game-area"
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Корзины */}
                {hoops.map((hoop, index) => (
                    <div
                        key={index}
                        className={`hoop ${hoop.hasBall ? 'has-ball' : ''}`}
                        style={{
                            left: hoop.x - HOOP_WIDTH / 2,
                            top: hoop.y - HOOP_HEIGHT / 2,
                            width: HOOP_WIDTH,
                            height: HOOP_HEIGHT,
                            transform: `rotate(${hoop.angle}deg)`,
                            transformOrigin: 'center center'
                        }}
                    >
                        <div className="hoop-back" style={{ width: HOOP_DEPTH }}></div>
                    </div>
                ))}

                {/* Мяч */}
                <div
                    className="ball"
                    style={{
                        left: ballPosition.x - BALL_RADIUS,
                        top: ballPosition.y - BALL_RADIUS,
                        width: BALL_RADIUS * 2,
                        height: BALL_RADIUS * 2
                    }}
                />

                {/* Траектория */}
                {trajectory.map((point, index) => (
                    <div
                        key={index}
                        className="trajectory-point"
                        style={{
                            left: point.x - 2,
                            top: point.y - 2,
                            opacity: index / trajectory.length
                        }}
                    />
                ))}

                {/* Очки */}
                <div className="score">Score: {score}</div>

                {/* Игра окончена */}
                {gameOver && (
                    <div className="game-over">
                        <h2>Game Over</h2>
                        <p>Your score: {score}</p>
                        <button onClick={resetGame}>Play Again</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;