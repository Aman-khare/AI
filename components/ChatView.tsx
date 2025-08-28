
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from '../types';
import { getAIResponseStream } from '../services/geminiService';
import { useSpeech } from '../hooks/useSpeech';

const ChatView: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hello! I'm Aura, your AI companion. How are you feeling today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const handleTranscriptReady = useCallback((transcript: string) => {
        setInput(prev => prev + transcript + ' ');
    }, []);

    const { isListening, startListening, stopListening, speak } = useSpeech(handleTranscriptReady);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const currentInput = input;
        const newUserMessage: Message = { id: Date.now().toString(), text: currentInput, sender: 'user' };

        // FIX: Create history from messages state BEFORE updating it, to send the correct context.
        const history = messages.map(msg => ({
            role: msg.sender === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);
        
        const aiResponseId = (Date.now() + 1).toString();
        const aiInitialMessage: Message = { id: aiResponseId, text: '', sender: 'ai' };
        setMessages(prev => [...prev, aiInitialMessage]);

        try {
            // FIX: Pass the conversation history and the new input to the AI.
            const stream = await getAIResponseStream(history, currentInput);
            let fullText = '';
            for await (const chunk of stream) {
                fullText += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === aiResponseId ? { ...msg, text: fullText } : msg
                ));
            }
            speak(fullText);
        } catch (error) {
            console.error(error);
            setMessages(prev => prev.map(msg => 
                msg.id === aiResponseId ? { ...msg, text: "I'm having trouble connecting right now. Please try again later." } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 p-4">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg px-4 py-3 rounded-2xl shadow-md ${
                            msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'
                        }`}>
                           {msg.text || <span className="animate-pulse">...</span>}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="mt-4 flex items-center bg-gray-800 rounded-full p-2 shadow-inner">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 px-4"
                    disabled={isLoading}
                />
                <button
                    onClick={isListening ? stopListening : startListening}
                    className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-600 hover:bg-gray-500'}`}
                >
                    <MicrophoneIcon />
                </button>
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="ml-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors"
                >
                   {isLoading ? <SpinnerIcon/> : <SendIcon />}
                </button>
            </div>
        </div>
    );
};


const MicrophoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);
const SpinnerIcon = () => (
    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export default ChatView;
