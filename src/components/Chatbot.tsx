import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Bot, User, Sparkles, Loader, Trash2 } from 'lucide-react';
import { dataApi } from '../services/api';

interface ChatbotProps {
  projectId: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const Chatbot: React.FC<ChatbotProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(`chat_history_${projectId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState(() => {
    return localStorage.getItem(`chat_input_${projectId}`) || '';
  });
  const [loading, setLoading] = useState(false);
  const [latestResponse, setLatestResponse] = useState<string | null>(() => {
    const saved = localStorage.getItem(`chat_response_${projectId}`);
    return saved || null;
  });
  const [processedFiles, setProcessedFiles] = useState<string[]>(() => {
    const saved = localStorage.getItem(`chat_files_${projectId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`chat_history_${projectId}`, JSON.stringify(messages));
  }, [messages, projectId]);

  useEffect(() => {
    localStorage.setItem(`chat_input_${projectId}`, input);
  }, [input, projectId]);

  useEffect(() => {
    if (latestResponse) {
      localStorage.setItem(`chat_response_${projectId}`, latestResponse);
    } else {
      localStorage.removeItem(`chat_response_${projectId}`);
    }
  }, [latestResponse, projectId]);

  useEffect(() => {
    if (processedFiles.length > 0) {
      localStorage.setItem(`chat_files_${projectId}`, JSON.stringify(processedFiles));
    } else {
      localStorage.removeItem(`chat_files_${projectId}`);
    }
  }, [processedFiles, projectId]);

  const handleClear = () => {
    setMessages([]);
    setLatestResponse(null);
    setProcessedFiles([]);
    setInput('');
    localStorage.removeItem(`chat_history_${projectId}`);
    localStorage.removeItem(`chat_input_${projectId}`);
    localStorage.removeItem(`chat_response_${projectId}`);
    localStorage.removeItem(`chat_files_${projectId}`);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setProcessedFiles([]); // Clear previous files while loading

    try {
      const result = await dataApi.sendChatMessage(projectId, userMessage.content);
      
      // We don't add the assistant response to the 'messages' list anymore,
      // we only set it as the latest response.
      setLatestResponse(result.answer);
      if (result.processedFiles) {
        setProcessedFiles(result.processedFiles);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setLatestResponse("I'm sorry, I encountered an error processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full gap-6 p-6">
      {/* Left Side: Chat Interface */}
      <div className="w-1/3 flex flex-col bg-surface border border-overlay rounded-[5px] shadow-sm overflow-hidden h-full">
        <div className="p-4 border-b border-overlay bg-surface flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-iris/10 text-iris rounded-[5px]">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-text">Research Assistant</h3>
              <p className="text-xs text-subtle">Ask questions about your project</p>
            </div>
          </div>
          <button 
            onClick={handleClear}
            className="p-2 text-subtle hover:text-love hover:bg-love/10 rounded-[5px] transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted p-6">
              <Sparkles size={48} className="mb-4 text-iris/50" />
              <p className="mb-2">No messages yet.</p>
              <p className="text-sm text-subtle">Ask me about tasks, documents, or project status!</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 flex-row-reverse`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                bg-pine/10 text-pine
              `}>
                <User size={14} />
              </div>
              <div className={`
                max-w-[85%] rounded-[5px] p-3 text-sm
                bg-pine text-surface
              `}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-iris/10 text-iris flex items-center justify-center shrink-0">
                 <Bot size={14} />
               </div>
               <div className="bg-overlay border border-muted/20 text-text rounded-[5px] p-3">
                 <Loader size={16} className="animate-spin text-subtle" />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-overlay bg-surface">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-overlay border border-muted/20 rounded-[5px] py-3 pl-4 pr-12 text-text focus:outline-none focus:border-iris transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-iris text-surface rounded-[5px] hover:bg-foam disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Right Side: Output / Detailed View */}
      <div className="flex-1 bg-surface border border-overlay rounded-[5px] shadow-sm p-6 overflow-y-auto h-full">
        <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
          Research Output
        </h2>
        
        {latestResponse ? (
          <div className="prose dark:prose-invert max-w-none text-text">
            {processedFiles.length > 0 && (
              <p className="text-xs text-subtle mb-4">
                File processed - {processedFiles.join(', ')}
              </p>
            )}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {latestResponse}
            </ReactMarkdown>
          </div>
        ) : (
           <div className="h-full flex flex-col items-center justify-center text-muted border-2 border-dashed border-overlay/50 rounded-[5px]">
             <p>The assistant's detailed response will appear here.</p>
           </div>
        )}
      </div>
    </div>
  );
};
