import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TextGenerateEffectProps {
  words: string;
  className?: string;
}

export const TextGenerateEffect: React.FC<TextGenerateEffectProps> = ({
  words,
  className = '',
}) => {
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);

  useEffect(() => {
    const wordArray = words.split(' ');
    let currentIndex = 0;

    const timer = setInterval(() => {
      if (currentIndex <= wordArray.length) {
        setDisplayedWords(wordArray.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [words]);

  return (
    <div className={className}>
      {displayedWords.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};
