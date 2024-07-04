import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const TextGenerateEffect = ({ words, className }) => {
  const scopeRef = useRef(null);
  let wordsArray = words.split(" ");

  useEffect(() => {
    // Start animation when component mounts
    wordsArray.forEach((_, idx) => {
      setTimeout(() => {
        if (scopeRef.current) {
          scopeRef.current.children[idx].style.opacity = 1;
        }
      }, idx * 200); // Adjust delay as needed
    });
  }, []);

  const renderWords = () => {
    return (
      <div ref={scopeRef}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="text-black text-6xl opacity-0"
            style={{
              display: "inline-block",
              opacity: 0,
              marginRight: "0.80rem",
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="text-black text-5xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};

export default TextGenerateEffect;
