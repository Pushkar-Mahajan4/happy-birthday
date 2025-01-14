import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import './App.css';

const App = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    
    setHearts([
      {
        id: Math.random(), // Generate random ID
        left: Math.random() * 100, // Random starting position
        size: Math.random() * 20 + 20, // Random size
      },
    ]);

    const interval = setInterval(() => {
      setHearts((prevHearts) => [
        ...prevHearts,
        {
          id: Date.now(),
          left: Math.random() * 100, // Random starting position (percentage of screen width)
          size: Math.random() * 20 + 20, // Random size between 20px and 40px
        },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          left={heart.left}
          size={heart.size}
          onComplete={() =>
            setHearts((prevHearts) => prevHearts.filter((h) => h.id !== heart.id))
          }
        />
      ))}
    </div>
  );
}

const Heart = ({ left, size, onComplete }) => {
  return (
    <motion.div
      className="heart"
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      initial={{ y: "100vh", rotate: 0 }} // Start at the bottom
      animate={{
        y: "-120vh", // Float to above the top of the screen
        x: ["0%", "10%", "-10%", "5%"], // Wiggle effect
        rotate: [0, 20, -20, 0], // Slow rotation
      }}
      transition={{
        duration: 40, // Smooth float over 6 seconds
        ease: "easeInOut",
        repeat: 0,
      }}
      onAnimationComplete={onComplete}
    />
  );
};

export default App;
