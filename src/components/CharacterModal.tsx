import React, { useState } from 'react';
import { X, Sparkles, Loader2, Check, Shield, Trash2, Camera } from 'lucide-react';
import { Character } from '../types/comic';

interface CharacterModalProps {
  character?: Character | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (character: Character) => void;
  onDelete?: (charId: string) => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  character,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(character?.name || '');
  const [role, setRole] = useState(character?.role || 'Hero');
  const [appearance, setAppearance] = useState(character?.appearance || '');
  const [clothing, setClothing] = useState(character?.clothing || '');
  const [personality, setPersonality] = useState(character?.personality || '');
  const [powers, setPowers] = useState(character?.powers || '');
  const [avatar, setAvatar] = useState(
    character?.avatar ||
      `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" fill="#18091d"/>
        <circle cx="50" cy="45" r="30" fill="#e11d48"/>
        <text x="50" y="55" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">?</text>
      </svg>
    `)}`
  );
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  const handleGenerateAvatar = async () => {
    if (!name) return;
    setIsGeneratingAvatar(true);
    try {
      const res = await fetch('/api/ai/character-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, appearance, clothing }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setAvatar(data.imageUrl);
      } else {
        // styled SVG avatar generator fallback
        const svgAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
            <rect width="100" height="100" fill="#15081b"/>
            <circle cx="50" cy="46" r="36" fill="#1d4ed8"/>
            <circle cx="50" cy="40" r="18" fill="#fcd34d"/>
            <path d="M 32,70 C 32,56 68,56 68,70 L 68,90 L 32,90 Z" fill="#b91c1c"/>
            <circle cx="50" cy="50" r="46" fill="none" stroke="#f43f5e" stroke-width="3"/>
          </svg>
        `)}`;
        setAvatar(svgAvatar);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const savedCharacter: Character = {
      id: character?.id || `char-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      avatar,
      appearance: appearance.trim(),
      clothing: clothing.trim(),
      personality: personality.trim(),
      powers: powers.trim(),
    };

    onSave(savedCharacter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#120716] border border-rose-900/70 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-500" />
            <h3 className="text-base font-bold text-white">
              {character ? 'Edit Character' : 'Create New Comic Character'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Character Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar and Main Info */}
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <img
                src={avatar}
                alt={name || 'Avatar'}
                className="w-16 h-16 rounded-xl border-2 border-rose-600 object-cover bg-zinc-900 shadow-md"
              />
              <button
                type="button"
                onClick={handleGenerateAvatar}
                disabled={isGeneratingAvatar || !name}
                title="Generate Avatar with Gemini"
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
              >
                {isGeneratingAvatar ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Character Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Doga, Adrak Chacha"
                  className="w-full bg-[#18091d] border border-zinc-800 focus:border-rose-600 rounded-lg px-3 py-1.5 text-xs font-semibold text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Archetype / Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Vigilante Protector, Strategic Mentor"
                  className="w-full bg-[#18091d] border border-zinc-800 focus:border-rose-600 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Appearance & Physical Description */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Visual Appearance & Physical Traits
            </label>
            <textarea
              rows={2}
              value={appearance}
              onChange={(e) => setAppearance(e.target.value)}
              placeholder="e.g. Muscular build, masked canine cowl, intense jawline..."
              className="w-full bg-[#18091d] border border-zinc-800 focus:border-rose-600 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
            />
          </div>

          {/* Clothing / Costume */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Costume & Equipment
            </label>
            <input
              type="text"
              value={clothing}
              onChange={(e) => setClothing(e.target.value)}
              placeholder="e.g. Blue tactical bodysuit, yellow crossed ammo belts, red boots"
              className="w-full bg-[#18091d] border border-zinc-800 focus:border-rose-600 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
            />
          </div>

          {/* Powers or Abilities */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Powers / Signature Skills
            </label>
            <input
              type="text"
              value={powers}
              onChange={(e) => setPowers(e.target.value)}
              placeholder="e.g. Peak human conditioning, tactical marksman, iron will"
              className="w-full bg-[#18091d] border border-zinc-800 focus:border-rose-600 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            {character && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(character.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Character</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
