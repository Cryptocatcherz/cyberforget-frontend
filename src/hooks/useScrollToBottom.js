import { useRef, useEffect } from 'react';

export const useScrollToBottom = (messages, showWelcome) => {
  const chatContainerRef = useRef(null);
  const welcomeMessageRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (showWelcome && welcomeMessageRef.current) {
      welcomeMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showWelcome]);

  return { chatContainerRef, welcomeMessageRef };
}; 