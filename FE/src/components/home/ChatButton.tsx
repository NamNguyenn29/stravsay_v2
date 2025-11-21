import { useState } from 'react';
import { FloatButton } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import ChatBox from './ChatBox';

const ChatButton: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {open && (
                <div className="fixed bottom-20 right-5 z-50">
                    <ChatBox onClose={() => setOpen(false)} />
                </div>
            )}
            <FloatButton
                icon={<MessageOutlined />}
                type="primary"
                style={{ right: 20, bottom: 20 }}
                onClick={() => setOpen(prev => !prev)}
            />
        </>
    );
};

export default ChatButton;
