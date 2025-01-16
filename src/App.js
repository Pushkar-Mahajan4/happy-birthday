import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import './App.css';

const App = () => {
  const [hearts, setHearts] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [showNewScreen, setShowNewScreen] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showBirthdayImage, setShowBirthdayImage] = useState(false);
  const [balloons, setBalloons] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('birthday-song.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex(prevIndex => {
        if (prevIndex < 2) {
          return prevIndex + 1;
        } else {
            clearInterval(textInterval);
            setShowButtons(true);
            return prevIndex;
        }
      });
    }, 8000); // orioginal 8000 changed to 1000 for testing

    return () => clearInterval(textInterval);
  }, []);

  const heartCount = 4;
  const spawnInterval = 2000;
  const messages = ["It's Your Special Day Sushieee!", "I tried to make something for you, since you are special to me!", "Do you wanna see what I made?"];
  const balloonImages = ['red.png', 'green.png', 'pink.png', 'orange.png'];

  useEffect(() => {
    let initialHeartCount = 0;
    const initialHeartInterval = setInterval(() => {
      if (initialHeartCount < heartCount) {
        setHearts(prevHearts => [...prevHearts, {
          id: Math.random(),
          left: Math.random() * 100,
          size: Math.random() * 20 + 20,
          startY: 60 + (initialHeartCount * 10),
          isInitial: true,
        }]);
        initialHeartCount++;
      } else {
        clearInterval(initialHeartInterval);
      }
    }, 500);

    const regularSpawnInterval = setInterval(() => {
      setHearts((prevHearts) => [
        ...prevHearts,
        {
          id: Date.now(),
          left: Math.random() * 100,
          size: Math.random() * 20 + 20,
          isInitial: false,
        },
      ]);
    }, spawnInterval);

    return () => {
      clearInterval(initialHeartInterval);
      clearInterval(regularSpawnInterval);
    };
  }, []);

  useEffect(() => {
    let balloonInterval;
    if (showBirthdayImage) {
      balloonInterval = setInterval(() => {
        setBalloons(prevBalloons => [...prevBalloons, {
          id: Date.now(),
          left: Math.random() * 100,
          image: balloonImages[Math.floor(Math.random() * balloonImages.length)],
          size: Math.random() * 30 + 40,
        }]);
      }, 1000);
    }
    return () => clearInterval(balloonInterval);
  }, [showBirthdayImage]);

  const handleButtonClick = () => {
    setShowNewScreen(true);
  };

  const handleLightsClick = () => {
    if (!lightsOn) {
      setLightsOn(true);
    } else if (!musicPlaying) {
      setMusicPlaying(true);
      audioRef.current.play();
    } else {
      setShowBirthdayImage(true);
      setButtonDisabled(true);
    }
  };

  if (showNewScreen) {
    return (
      <div style={{
        backgroundColor: lightsOn ? '#e4c4cc' : '#1D1C2A',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        <motion.button
          onClick={handleLightsClick}
          animate={{ scale: 1 }}
          whileTap={{ scale: 1.1 }}
          initial={{ scale: 1 }}
          disabled={buttonDisabled}
          style={{
            fontWeight: 'bold',
            backgroundColor: lightsOn ? '#C32955' : '#1271e0',
            padding: '15px 40px',
            fontSize: '20px',
            width: "450px",
            borderRadius: '30px',
            border: 'none',
            cursor: buttonDisabled ? 'default' : 'pointer',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            position: 'absolute',
            top: '20%',
            left: '38%',
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center center',
            zIndex: 2,
            opacity: buttonDisabled ? 0.7 : 1
          }}
        >
          {!lightsOn ? 'Lights on' : !musicPlaying ? 'Play Music!' : buttonDisabled ? 'Wait for it :)' : 'Decorate!'}
        </motion.button>

        {showBirthdayImage && (
          <>
            <motion.img
              src="Happy_birthday.png"
              initial={{ y: -500, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                position: 'absolute',
                top: '37%',
                left: '37%',
                transform: 'translate(-50%, -50%)',
                width: '500px',
                height: 'auto',
                zIndex: 2
              }}
            />
            {balloons.map((balloon) => (
              <motion.img
                key={balloon.id}
                src={balloon.image}
                style={{
                  position: 'absolute',
                  left: `${balloon.left}%`,
                  width: `${balloon.size}px`,
                  height: 'auto',
                  zIndex: 1
                }}
                initial={{ y: '100vh' }}
                animate={{
                  y: '-100vh',
                  x: ['0%', '5%', '-5%', '0%']
                }}
                transition={{
                  duration: 15,
                  ease: 'linear',
                  x: {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }
                }}
                onAnimationComplete={() => {
                  setBalloons(prevBalloons => 
                    prevBalloons.filter(b => b.id !== balloon.id)
                  );
                }}
              />
            ))}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px 40px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        zIndex: 10,
        textAlign: 'center',
        width: '600px',
        height: showButtons ? '250px' : '200px'
      }}>
        <h1 style={{ fontSize: '5em', marginBottom: '-10px', marginTop: '-5px' }}>✨</h1>
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentTextIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {messages[currentTextIndex]}
          </motion.h2>
        </AnimatePresence>
        {showButtons && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '20px' }}
          >
            <button 
              onClick={handleButtonClick}
              style={{
                margin: '0 10px',
                padding: '10px 30px',
                fontSize: '18px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: '#C32955',
                color: 'white'
              }}
            >
              Yes!
            </button>
            <button
              onClick={handleButtonClick}
              style={{
                margin: '0 10px',
                padding: '10px 30px',
                fontSize: '18px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: '#8045D6',
                color: 'white'
              }}
            >
              No
            </button>
          </motion.div>
        )}
      </div>
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          left={heart.left}
          size={heart.size}
          isInitial={heart.isInitial}
          startY={heart.startY}
          onComplete={() =>
            setHearts((prevHearts) => prevHearts.filter((h) => h.id !== heart.id))
          }
        />
      ))}
    </div>
  );
}

const Heart = ({ left, size, isInitial, startY, onComplete }) => {
  return (
    <motion.div
      className="heart"
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      initial={{ y: isInitial ? `${startY}vh` : "100vh" }}
      animate={{
        y: "-100vh",
        x: ["0%", "10%", "-10%", "5%"],
        rotate: [0, 20, -20, 0],
      }}
      transition={{
        duration: isInitial ? 6 : 12,
        ease: "linear",
        x: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        },
        rotate: {
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        },
        y: {
          duration: isInitial ? 6 : 12,
          ease: "linear"
        }
      }}
      onAnimationComplete={onComplete}
    />
  );
};

export default App;