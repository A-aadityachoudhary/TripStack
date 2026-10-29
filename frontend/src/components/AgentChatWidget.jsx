import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, User } from 'lucide-react';
import { BotMessageSquare } from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';

export default function AgentChatWidget() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Travel Agent. Looking to plan a trip to Bali, Switzerland, or Japan? Ask me anything or let me help you book your next vacation!'
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    if (!textToSend) setInput('');

    // Guard check: Intercept request if user is not signed in
    if (!isSignedIn) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry buddy but you have to sign up or sign in first.'
        }
      ]);
      return;
    }

    setLoading(true);

    // Extract logged-in user email and name from Clerk
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    const userName = user?.fullName || user?.firstName || 'Traveler';

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          history: newMessages,
          userInfo: {
            email: userEmail,
            name: userName
          }
        })
      });

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I encountered an issue processing your request.' }
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Unable to connect to the AI Agent backend.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-4 transition-all duration-300">
          {/* Header */}
          <div className="bg-white text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sky-500/10 border border-sky-300 flex items-center justify-center text-sky-600 shadow-sm">
                <BotMessageSquare className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-1">
                  <span className="text-sky-600">Trip</span>
                  <span className="text-slate-900">Stack</span>
                  <span className="text-slate-500 font-normal ml-0.5">Agent</span>
                </h3>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> By Aaditya Choudhary
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <BotMessageSquare className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-sky-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-xs'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic pl-9">
                <Loader2 className="w-4 h-4 animate-spin text-sky-600" /> AI Agent is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto text-xs">
              <button
                onClick={() => handleSend("I want to book the Bali package")}
                className="bg-slate-100 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer"
              >
                🏝️ Book Bali Package
              </button>
              <button
                onClick={() => handleSend("What hotels are available in Switzerland?")}
                className="bg-slate-100 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer"
              >
                🏨 Swiss Hotels
              </button>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask or book your trip..."
              className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500 text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer border border-sky-400/30"
        aria-label="Open AI Travel Agent Chat"
      >
        {/* Upgraded AI Bot Icon */}
        <BotMessageSquare className="w-7 h-7 stroke-[2.2]" />

        {/* Online Status Indicator Dot */}
        <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>
      </button>
    </div>
  );
}