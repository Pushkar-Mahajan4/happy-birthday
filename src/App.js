import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import './App.css';

const App = () => {
  const [hearts, setHearts] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);

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
    }, 8000);

    return () => clearInterval(textInterval);
  }, []);

  const heartCount = 4; // Number of hearts to spawn
  const spawnInterval = 2000; // Spawn rate in milliseconds
  const messages = ["It's Your Special Day Sushieee!", "I tried to make something for you, since you are special to me!", "Do you wanna see what I made?"]; // Add your messages here

  useEffect(() => {
    // Create and add initial hearts one by one with a delay
    let initialHeartCount = 0;
    const initialHeartInterval = setInterval(() => {
      if (initialHeartCount < heartCount) {
        setHearts(prevHearts => [...prevHearts, {
          id: Math.random(),
          left: Math.random() * 100,
          size: Math.random() * 20 + 20,
          startY: 60 + (initialHeartCount * 10), // Space hearts vertically from 60vh
          isInitial: true,
        }]);
        initialHeartCount++;
      } else {
        clearInterval(initialHeartInterval);
      }
    }, 500); // Add a new initial heart every 500ms

    // Start regular heart spawning after initial hearts are created
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
  }, []); // Only run on mount since values are constant

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
              style={{
                margin: '0 10px',
                padding: '10px 30px',
                fontSize: '18px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: '#e3aab7',
                color: 'white'
              }}
            >
              Yes
            </button>
            <button
              style={{
                margin: '0 10px',
                padding: '10px 30px',
                fontSize: '18px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: '#e3aab7',
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