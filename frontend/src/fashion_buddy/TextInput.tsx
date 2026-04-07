import React, { useState, useRef } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';
import { callFashionBuddyText } from "../api"; // Up one level to src/api.ts
import toast from 'react-hot-toast';

const LOADING_MESSAGES = [
    { message: "📝 Analyzing your fashion preferences...", duration: 2500 },
    { message: "🎯 Finding the perfect matches...", duration: 2500 },
    { message: "✨ Preparing your style recommendations...", duration: 2500 }
];

type Props = {
    setResults: (results: string | null) => void;
    setLoading: (loading: boolean) => void;
};

const TextInput: React.FC<Props> = ({ setResults, setLoading }) => {
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const showLoadingSequence = () => {
        LOADING_MESSAGES.forEach(({ message, duration }, index) => {
            setTimeout(() => {
                toast(message, {
                    duration: duration,
                    icon: '⏳',
                    style: {
                        background: '#F7F6F3',
                        color: '#4B2E2B',
                        border: '1px solid #F8E1D9',
                    },
                });
            }, index * duration);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        showLoadingSequence();

        try {
            const responseText = await callFashionBuddyText(text);
            setResults(responseText);

            toast.success('✨ Your style matches are ready!', {
                duration: 4000,
                style: { background: '#F7F6F3', color: '#4B2E2B', border: '1px solid #F8E1D9' },
            });
        } catch (err) {
            console.error('Error finding suggestions', err);
            setResults('');
            toast.error('Could not connect to the fashion expert.', {
                duration: 4000,
                style: { background: '#F7F6F3', color: '#4B2E2B', border: '1px solid #F8E1D9' },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-surface p-8 rounded-xl shadow-soft flex flex-col items-center space-y-6 border border-taupe"
        >
            <div className="w-full flex items-center space-x-3">
                <HiOutlinePencil className="text-2xl text-brown" />
                <textarea
                    id="fashion-input"
                    name="fashion-description"
                    ref={textareaRef}
                    value={text}
                    onChange={handleChange}
                    placeholder="Describe the clothing item (e.g., 'Blue summer dress for a wedding')..."
                    rows={2}
                    className="flex-1 bg-nude border-none rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-peach transition-all placeholder-taupe text-brown min-h-[48px]"
                    style={{ resize: 'none', maxHeight: '200px' }}
                />
            </div>
            <button
                type="submit"
                className="bg-brown text-offwhite px-8 py-3 rounded-full text-lg font-semibold shadow-soft transition-all hover:bg-accent disabled:opacity-50"
                disabled={!text.trim()}
            >
                Get Suggestions
            </button>
        </form>
    );
};

export default TextInput;