import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { Avatar, Spin, Button, message } from 'antd';
import { CloseOutlined, SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { ChatboxService } from '@/services/chatboxService';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

interface ChatBoxProps {
    onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: 'Xin chào! Mình là AI, bạn muốn hỏi gì hôm nay?' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const sendMessage = useCallback(async () => {
        if (!input.trim()) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await ChatboxService.chat(input);

            const aiMessage: Message = { sender: 'ai', text: response.data.response || 'Ai can not answer' }
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            message.error("Failed to send message");
            const aiMessage: Message = { sender: 'ai', text: "Sorry error occur" }
            setMessages(prev => [...prev, aiMessage]);
        } finally {
            setLoading(false)
        }


    }, [input]);

    const handleKeyPress = useCallback(
        (e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        },
        [sendMessage]
    );

    return (
        <div className="w-[700px] max-w-[95vw] h-[500px] flex flex-col rounded-xl overflow-hidden
                    backdrop-blur-md bg-white/20 shadow-lg animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center p-3 font-semibold text-lg
                      bg-white/10 backdrop-blur-sm">
                Chat AI
                <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.sender === 'ai' && <Avatar icon={<RobotOutlined />} className="mr-2" />}
                        <div
                            className={`max-w-[70%] p-3 rounded-2xl shadow
                          ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white/60 text-black'}`}
                        >
                            {msg.text}
                        </div>
                        {msg.sender === 'user' && <Avatar icon={<UserOutlined />} className="ml-2" />}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-end justify-start">
                        <Avatar icon={<RobotOutlined />} className="mr-2" />
                        <div className="max-w-[70%] p-3 rounded-2xl shadow bg-white/60 flex items-center gap-2">
                            <Spin size="small" /> Đang trả lời...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-sm">
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    rows={1}
                    className="flex-1 resize-none rounded-lg p-2 bg-white/30 backdrop-blur-sm focus:outline-none"
                />
                <Button type="primary" icon={<SendOutlined />} onClick={sendMessage} />
            </div>
        </div>
    );
};

export default ChatBox;
