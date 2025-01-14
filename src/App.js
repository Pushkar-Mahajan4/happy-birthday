import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import './App.css';

const App = () => {
  const [hearts, setHearts] = useState([]);
  const heartCount = 4; // Number of hearts to spawn
  const spawnInterval = 2000; // Spawn rate in milliseconds

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