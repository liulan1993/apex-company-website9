"use client";

import React, { useState, useEffect, useRef, FC, SVGProps } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// +----------------------------------+
// |  Helper Functions & Styling      |
// +----------------------------------+

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const GlobalStyles = () => (
  <style>{`
    /* 使用对国内用户更友好的字体栈 */
    body {
      font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
    }
    
    .message-container {
      scrollbar-width: thin;
      scrollbar-color: #a0aec0 #edf2f7;
    }

    .message-container::-webkit-scrollbar {
      width: 6px;
    }

    .message-container::-webkit-scrollbar-track {
      background: #edf2f7;
    }

    .message-container::-webkit-scrollbar-thumb {
      background-color: #a0aec0;
      border-radius: 10px;
      border: 3px solid #edf2f7;
    }
  `}</style>
);


// +----------------------------------+
// |  Type Definitions                |
// +----------------------------------+

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// +----------------------------------+
// |  Inline SVG Icon Components      |
// +----------------------------------+

const SearchIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const MicIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
);
const ArrowUpIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
);
const PlusIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const FileTextIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
);
const CodeIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);
const BookOpenIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
);
const PenToolIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19 7-7 3 3-7 7-3-3z"></path><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="m2 2 7.586 7.586"></path><path d="m11 13 2.5 2.5"></path></svg>
);
const BrainCircuitIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 5a3 3 0 1 0-5.993.129"></path><path d="M12 5a3 3 0 1 1 5.993.129"></path><path d="M15 13a3 3 0 1 0-5.993.129"></path><path d="M15 13a3 3 0 1 1 5.993.129"></path><path d="M9 13a3 3 0 1 0-5.993.129"></path><path d="M9 13a3 3 0 1 1 5.993.129"></path><path d="M6.007 8.129A3 3 0 1 0 9 13"></path><path d="M18.007 8.129A3 3 0 1 1 15 13"></path><path d="M12 19a3 3 0 1 0-5.993.129"></path><path d="M12 19a3 3 0 1 1 5.993.129"></path><path d="M12 5a3 3 0 1 0-5.993.129"></path><path d="m12 16 1-1"></path><path d="m9 10 1-1"></path><path d="m15 10-1-1"></path></svg>
);
const DeepResearchIcon: FC<SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
    <circle cx="8" cy="8" r="3" fill="currentColor" />
  </svg>
);
const CloseIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const ChevronDownIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9"></polyline></svg>
);
const BotIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);
const UserIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);


// +------------------------------------------+
// |  Sub-components for AI Interface & Chat  |
// +------------------------------------------+

const CommandButton: FC<{icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void;}> = ({ icon, label, isActive, onClick }) => (
  <motion.button onClick={onClick} className={cn('flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all', isActive ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300')}>
    <div className={cn(isActive ? 'text-blue-600' : 'text-gray-500')}>{icon}</div>
    <span className={cn('text-sm font-medium', isActive ? 'text-blue-700' : 'text-gray-700')}>{label}</span>
  </motion.button>
);

const ModelSelector: FC<{selectedModel: string, setSelectedModel: (model: string) => void}> = ({ selectedModel, setSelectedModel}) => {
    const [isOpen, setIsOpen] = useState(false);
    const models = ["DeepSeek-R1-0528", "DeepSeek-V3-0324"];
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-gray-100 text-gray-500 hover:bg-gray-200">
                <span>{selectedModel}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute bottom-full mb-2 w-max bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
                        <ul className="py-1">
                            {models.map((model) => (
                                <li key={model} onClick={() => {setSelectedModel(model); setIsOpen(false);}} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                    {model}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ChatMessages: FC<{messages: Message[], isLoading: boolean}> = ({ messages, isLoading }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    return (
        <div ref={scrollRef} className="message-container w-full h-96 overflow-y-auto p-4 space-y-4 mb-4 border border-gray-200 rounded-xl bg-gray-50/50">
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><BotIcon className="w-5 h-5 text-gray-600"/></div>}
                    <div className={`max-w-prose p-3 rounded-xl ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-100'}`}>
                        <p className="text-sm" style={{whiteSpace: 'pre-wrap'}}>{msg.content}</p>
                    </div>
                    {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><UserIcon className="w-5 h-5 text-blue-600"/></div>}
                </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><BotIcon className="w-5 h-5 text-gray-600"/></div>
                    <div className="max-w-prose p-3 rounded-xl bg-white text-gray-800 border border-gray-100">
                        <motion.div className="flex space-x-1" initial="hidden" animate="visible" variants={{hidden: {}, visible: {transition: {staggerChildren: 0.2,},},}}>
                            {[...Array(3)].map((_, i) => (
                                <motion.div key={i} className="w-2 h-2 bg-gray-400 rounded-full" variants={{hidden: { opacity: 0, y: 3 }, visible: {opacity: 1, y: 0, transition: {duration: 0.5, repeat: Infinity, repeatType: "mirror", delay: i * 0.2,},},}}/>
                            ))}
                        </motion.div>
                    </div>
                </div>
            )}
        </div>
    );
};


// +----------------------------------+
// |  Main AI Interface Component     |
// +----------------------------------+

const AIAssistantInterface: FC = () => {
    const [inputValue, setInputValue] = useState("");
    const [searchEnabled, setSearchEnabled] = useState(false);
    const [deepResearchEnabled, setDeepResearchEnabled] = useState(false);
    const [reasonEnabled, setReasonEnabled] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<{name: string, content: string}[]>([]);
    const [showUploadAnimation, setShowUploadAnimation] = useState(false);
    const [activeCommandCategory, setActiveCommandCategory] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState("DeepSeek-R1-0528");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const commandSuggestions = {
        learn: ["解释大爆炸理论", "光合作用是如何进行的？", "什么是黑洞？"],
        code: ["创建一个 React 待办事项列表组件", "写一个 Python 函数来排序列表", "解释 JavaScript 中的 async/await"],
        write: ["给客户写一封专业的电子邮件", "起草一篇关于人工智能的博客文章", "写一个关于太空探索的创意故事"],
    };

    const handleSendMessage = async (promptOverride?: string) => {
        const textToSend = promptOverride || inputValue;
        if (!textToSend.trim() && uploadedFiles.length === 0) return;

        setIsLoading(true);
        const userMessageContent = uploadedFiles.length > 0
            ? `上传文件:\n${uploadedFiles.map(f => `- ${f.name}`).join('\n')}\n\n问题: ${textToSend}`
            : textToSend;
        
        const newMessages: Message[] = [...messages, { role: 'user', content: userMessageContent }];
        setMessages(newMessages);
        setInputValue('');

        const apiMessages = newMessages.map(msg => {
            if (msg.role === 'user' && uploadedFiles.length > 0) {
                 const fileContent = uploadedFiles.map(f => `// 文件名: ${f.name}\n\n${f.content}`).join('\n\n---\n\n');
                 return { role: 'user', content: `${fileContent}\n\n---\n\n${textToSend}` };
            }
            return msg;
        });

        const systemPrompts = [];
        if (searchEnabled) systemPrompts.push("启用网络搜索。");
        if (deepResearchEnabled) systemPrompts.push("进行深度研究，提供详细和全面的答案。");
        if (reasonEnabled) systemPrompts.push("展示你的推理过程。");
        
        if (systemPrompts.length > 0) {
            apiMessages.unshift({ role: 'system', content: systemPrompts.join(' ') });
        }

        try {
            const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
            
            if (!apiKey) {
                throw new Error("未找到 DeepSeek API 密钥。请设置 NEXT_PUBLIC_DEEPSEEK_API_KEY 环境变量。");
            }

            const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: apiMessages,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API 错误: ${response.status} - ${errorData.error.message}`);
            }

            const data = await response.json();
            const assistantMessage = data.choices[0].message;
            setMessages(prev => [...prev, assistantMessage]);
            setUploadedFiles([]);

        } catch (err) {
            const errorMessage = (err as Error).message;
            setMessages(prev => [...prev, { role: 'assistant', content: `抱歉，出错了: ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCommandSelect = (command: string) => {
        setInputValue(command);
        setActiveCommandCategory(null);
        handleSendMessage(command);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        setShowUploadAnimation(true);
        const readPromises = Array.from(files).map(file => {
            return new Promise<{name: string, content: string}>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve({ name: file.name, content: e.target?.result as string });
                };
                reader.onerror = (e) => reject(e);
                reader.readAsText(file);
            });
        });

        Promise.all(readPromises)
            .then(newFiles => setUploadedFiles(prev => [...prev, ...newFiles]))
            .catch(error => {
                console.error("Error reading files:", error);
                setMessages(prev => [...prev, {role: 'assistant', content: '抱歉，读取文件时出错。'}]);
            })
            .finally(() => setShowUploadAnimation(false));
        
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            
            <ChatMessages messages={messages} isLoading={isLoading} />

            <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
                <div className="p-4">
                    <input ref={inputRef} type="text" placeholder="问我任何问题..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()} className="w-full bg-transparent text-gray-700 text-base outline-none placeholder:text-gray-400"/>
                </div>

                {uploadedFiles.length > 0 && (
                    <div className="px-4 pb-3">
                        <div className="flex flex-wrap gap-2">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center gap-2 bg-gray-50 py-1 px-2 rounded-md border border-gray-200">
                                    <FileTextIcon className="w-3 h-3 text-blue-600" />
                                    <span className="text-xs text-gray-700">{file.name}</span>
                                    <button onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== index))} className="text-gray-400 hover:text-gray-600">
                                        <CloseIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => setSearchEnabled(!searchEnabled)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${searchEnabled ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                            <SearchIcon className="w-4 h-4" /><span>搜索</span>
                        </button>
                        <button onClick={() => setDeepResearchEnabled(!deepResearchEnabled)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${deepResearchEnabled ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                            <DeepResearchIcon className={deepResearchEnabled ? "text-blue-600" : "text-gray-400"}/><span>深度研究</span>
                        </button>
                        <button onClick={() => setReasonEnabled(!reasonEnabled)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${reasonEnabled ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                            <BrainCircuitIcon className={`w-4 h-4 ${reasonEnabled ? "text-blue-600" : "text-gray-400"}`}/><span>推理</span>
                        </button>
                        <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <MicIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleSendMessage()} disabled={isLoading || (!inputValue.trim() && uploadedFiles.length === 0)} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${ (inputValue.trim() || uploadedFiles.length > 0) ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                            <ArrowUpIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="px-4 py-2 border-t border-gray-100">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} multiple />
                    <button onClick={() => fileInputRef.current?.click()} disabled={showUploadAnimation} className="flex items-center gap-2 text-gray-600 text-sm hover:text-gray-900 transition-colors">
                        {showUploadAnimation ? (
                             <motion.div className="flex space-x-1" initial="hidden" animate="visible" variants={{hidden: {}, visible: {transition: {staggerChildren: 0.1,},},}}>
                                {[...Array(3)].map((_, i) => ( <motion.div key={i} className="w-1.5 h-1.5 bg-blue-600 rounded-full" variants={{hidden: { opacity: 0, y: 5 }, visible: {opacity: 1, y: 0, transition: {duration: 0.4, repeat: Infinity, repeatType: "mirror", delay: i * 0.1,},},}}/> ))}
                            </motion.div>
                        ) : (<PlusIcon className="w-4 h-4" />)}
                        <span>上传文件</span>
                    </button>
                </div>
            </div>

            <div className="w-full grid grid-cols-3 gap-4 mb-4">
                <CommandButton icon={<BookOpenIcon className="w-5 h-5" />} label="学习" isActive={activeCommandCategory === "learn"} onClick={() => { setActiveCommandCategory("learn"); handleCommandSelect(commandSuggestions.learn[0]);}}/>
                <CommandButton icon={<CodeIcon className="w-5 h-5" />} label="代码" isActive={activeCommandCategory === "code"} onClick={() => { setActiveCommandCategory("code"); handleCommandSelect(commandSuggestions.code[0]);}}/>
                <CommandButton icon={<PenToolIcon className="w-5 h-5" />} label="写作" isActive={activeCommandCategory === "write"} onClick={() => { setActiveCommandCategory("write"); handleCommandSelect(commandSuggestions.write[0]);}}/>
            </div>
        </div>
    );
}

// +----------------------------------+
// |  Background & Main Page Layout   |
// +----------------------------------+
function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({ id: i, d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`, width: 0.5 + i * 0.03, }));
    return (
        <div className="absolute inset-0 pointer-events-none text-slate-900/20">
            <svg className="w-full h-full" viewBox="0 0 696 316" fill="none" xmlns="http://www.w3.org/2000/svg">
                <title>背景动画路径</title>
                {paths.map((path) => ( <motion.path key={path.id} d={path.d} stroke="currentColor" strokeWidth={path.width} strokeOpacity={0.1 + path.id * 0.03} initial={{ pathLength: 0.3, opacity: 0.6 }} animate={{ pathLength: 1, opacity: [0.3, 0.6, 0.3], pathOffset: [0, 1, 0] }} transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, ease: "linear" }} />))}
            </svg>
        </div>
    );
}

function BackgroundAndLayout({ title, children }: { title: string, children: React.ReactNode }) {
    const words = title.split(" ");
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-y-auto bg-white text-slate-950 p-4">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>
            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="max-w-4xl mx-auto flex flex-col items-center">
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6 tracking-tighter">
                        {words.map((word, wordIndex) => (
                            <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                                {word.split("").map((letter, letterIndex) => ( <motion.span key={`${wordIndex}-${letterIndex}`} initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: wordIndex * 0.1 + letterIndex * 0.03, type: "spring", stiffness: 150, damping: 25 }} className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-700/80">{letter}</motion.span> ))}
                            </span>
                        ))}
                    </h1>
                    <motion.p initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 1, ease: "easeOut" }} className="mt-4 text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">
                      Apex专属AI，满血版，支持深度、联网，切换模型等。
                    </motion.p>
                    <div className="w-full mt-12">
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// +----------------------------------+
// |  Main App Page Component         |
// +----------------------------------+

export default function HomePage() {
  return (
    <>
        <GlobalStyles />
        <BackgroundAndLayout title="Apex—DeepSeek">
            <AIAssistantInterface />
        </BackgroundAndLayout>
    </>
  );
}
