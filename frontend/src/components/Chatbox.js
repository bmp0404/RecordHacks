import React, { useState, useEffect, useRef } from 'react';

const ChatBox = ({ jamId, height = '400px' }) => {  // Added height prop with default value
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Example of loading messages from backend
  useEffect(() => {
    // This would be replaced with actual API call
    const fetchMessages = async () => {
      // Simulate loading messages with dummy data
      const dummyMessages = [
        { id: 1, user: 'Rohan', text: 'I love this track!', timestamp: new Date(Date.now() - 900000).toISOString() },
        { id: 2, user: 'Krish', text: 'The beat is amazing', timestamp: new Date(Date.now() - 600000).toISOString() },
        { id: 3, user: 'Vedant', text: 'Who\'s the producer?', timestamp: new Date(Date.now() - 300000).toISOString() },
        { id: 4, user: 'Ayaan', text: 'This app is so cool!!!', timestamp: new Date(Date.now() - 100000).toISOString() }
      ];
      
      setMessages(dummyMessages);
    };
    
    fetchMessages();
  }, [jamId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Create a new message object
    const messageObj = {
      id: Date.now(),
      user: 'You',
      text: newMessage,
      timestamp: new Date().toISOString()
    };
    
    // Optimistic update - add message to UI immediately
    setMessages([...messages, messageObj]);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-box" style={{ 
      width: '100%',
      maxWidth: '600px',
      height: height, // Use the height prop instead of hardcoded value
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
      margin: '20px auto',
      background: 'rgba(0,0,0,0.2)',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Messages container */}
      <div className="messages-container" style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {messages.length === 0 ? (
          <div className="no-messages" style={{ 
            textAlign: 'center', 
            color: 'rgba(255,255,255,0.6)',
            margin: 'auto' 
          }}>
            No messages yet. Be the first to chat!
          </div>
        ) : (
          messages.map(msg => (
            <div 
              key={msg.id}
              className={`message ${msg.user === 'You' ? 'own-message' : ''}`}
              style={{ 
                alignSelf: msg.user === 'You' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                padding: '10px 16px',
                borderRadius: msg.user === 'You' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                background: msg.user === 'You' ? 
                  'linear-gradient(45deg, #3D9AF1, #7B4CFF)' : 
                  'rgba(255,255,255,0.15)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              {msg.user !== 'You' && (
                <div className="message-user" style={{ 
                  fontWeight: 'bold', 
                  marginBottom: '4px',
                  fontSize: '0.9rem' 
                }}>
                  {msg.user}
                </div>
              )}
              <div className="message-text">{msg.text}</div>
              <div className="message-time" style={{ 
                fontSize: '0.7rem',
                opacity: 0.7,
                textAlign: 'right',
                marginTop: '4px'
              }}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input form */}
      <form 
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          padding: '10px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.2)'
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '12px 16px',
            border: 'none',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            fontSize: '1rem'
          }}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          style={{
            marginLeft: '10px',
            padding: '0 20px',
            border: 'none',
            borderRadius: '24px',
            background: newMessage.trim() ? 
              'linear-gradient(45deg, #4CAF50, #2E7D32)' : 
              'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: newMessage.trim() ? 'pointer' : 'default',
            opacity: newMessage.trim() ? 1 : 0.5
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;