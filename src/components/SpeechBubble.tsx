import React, { useState } from 'react';
import { Dialogue } from '../types/comic';

interface SpeechBubbleProps {
  dialogue: Dialogue;
  onUpdateText?: (newText: string) => void;
  onReposition?: (x: number, y: number) => void;
  isEditable?: boolean;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  dialogue,
  onUpdateText,
  onReposition,
  isEditable = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(dialogue.text);

  const pos = dialogue.position || { x: 50, y: 15 };
  const isRightSide = pos.x > 50;

  const handleBlur = () => {
    setIsEditing(false);
    if (onUpdateText && text !== dialogue.text) {
      onUpdateText(text);
    }
  };

  const isNarration = dialogue.type === 'narration' || dialogue.speaker?.toLowerCase() === 'narration';
  const isShout = dialogue.type === 'shout';

  if (isNarration) {
    return (
      <div
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: 'translate(-50%, 0)',
        }}
        className="absolute z-20 max-w-[85%] select-none transition-transform"
      >
        <div className="bg-[#fef08a] text-black border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#000] text-[11px] md:text-xs font-bold font-comic tracking-wide uppercase">
          {isEditing ? (
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              className="bg-transparent border-b border-black outline-none w-full"
            />
          ) : (
            <span
              onClick={() => isEditable && setIsEditing(true)}
              className={isEditable ? 'cursor-pointer hover:underline' : ''}
            >
              {dialogue.text}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: 'translate(-50%, 0)',
      }}
      className="absolute z-20 max-w-[70%] select-none group"
    >
      <div
        className={`relative bg-white text-black border-2 border-black rounded-[14px] px-2.5 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.85)] text-[10px] md:text-[11px] font-bold font-comic uppercase tracking-tight leading-snug ${
          isShout ? 'border-[2.5px] bg-[#fffbeb] scale-105' : ''
        }`}
      >
        {isEditing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            rows={2}
            className="bg-transparent border-b border-black outline-none w-full text-[11px] font-bold uppercase resize-none"
          />
        ) : (
          <div
            onClick={() => isEditable && setIsEditing(true)}
            className={`cursor-pointer ${isEditable ? 'hover:text-rose-700' : ''}`}
            title={isEditable ? 'Click to edit dialogue' : undefined}
          >
            {dialogue.text}
          </div>
        )}

        {/* Comic Bubble Pointer Tail */}
        <div
          className={
            isRightSide
              ? 'comic-bubble-tail comic-bubble-tail-bottom-right'
              : 'comic-bubble-tail comic-bubble-tail-bottom-left'
          }
        />
      </div>
    </div>
  );
};
