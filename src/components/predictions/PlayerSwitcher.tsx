"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPlayers,
  getCurrentPlayer,
  setCurrentPlayer,
  addPlayer,
  type Player,
} from "@/lib/predictions/store";

// Preset emoji list for new players
const EMOJI_OPTIONS = [
  "\u{1F3CE}\u{FE0F}", "\u{1F3C6}", "\u{1F525}", "\u26A1", "\u{1F49C}",
  "\u{1F31F}", "\u{1F680}", "\u{1F3C1}", "\u{1F3AF}", "\u{1F4A5}",
  "\u{1F60E}", "\u{1F451}", "\u{1F48E}", "\u{1F40D}", "\u{1F985}",
  "\u{1F30A}", "\u{1F308}", "\u2B50", "\u{1F3C5}", "\u{1F94A}",
];

interface PlayerSwitcherProps {
  onPlayerChange?: (player: Player) => void;
  compact?: boolean;
}

export default function PlayerSwitcher({
  onPlayerChange,
  compact = false,
}: PlayerSwitcherProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [current, setCurrent] = useState<Player | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState(EMOJI_OPTIONS[5]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load players
  useEffect(() => {
    setPlayers(getPlayers());
    setCurrent(getCurrentPlayer());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setShowAddForm(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSwitch = (player: Player) => {
    setCurrentPlayer(player.id);
    setCurrent(player);
    setIsOpen(false);
    onPlayerChange?.(player);
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    const player = addPlayer(newName.trim(), newEmoji);
    setPlayers(getPlayers());
    setNewName("");
    setNewEmoji(EMOJI_OPTIONS[5]);
    setShowAddForm(false);
    handleSwitch(player);
  };

  if (!current) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current player button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowAddForm(false);
        }}
        className={`flex items-center gap-2 rounded-lg border border-f1-border bg-f1-surface/80 backdrop-blur-sm
          hover:border-f1-red/40 transition-all ${compact ? "px-3 py-1.5" : "px-4 py-2"}`}
      >
        <span className={compact ? "text-lg" : "text-xl"}>{current.emoji}</span>
        <span className={`font-medium ${compact ? "text-sm" : "text-base"}`}>
          {current.name}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-f1-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-72 rounded-xl border border-f1-border bg-f1-surface/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Player list */}
            <div className="p-2 max-h-64 overflow-y-auto">
              <p className="text-[10px] uppercase tracking-wider text-f1-muted px-2 py-1 font-medium">
                Switch Player
              </p>
              {players.map((player, i) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <button
                    onClick={() => handleSwitch(player)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${
                        player.id === current.id
                          ? "bg-f1-red/10 border border-f1-red/20"
                          : "hover:bg-f1-surface-hover"
                      }`}
                  >
                    <span className="text-xl">{player.emoji}</span>
                    <span className="text-sm font-medium">{player.name}</span>
                    {player.id === current.id && (
                      <motion.div
                        layoutId="player-active"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-f1-red"
                      />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-f1-border" />

            {/* Add new player */}
            {showAddForm ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-3 space-y-3"
              >
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Player name..."
                  maxLength={20}
                  autoFocus
                  className="w-full rounded-lg border border-f1-border bg-f1-dark text-white text-sm px-3 py-2
                    focus:outline-none focus:ring-1 focus:ring-f1-red focus:border-f1-red"
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />

                {/* Emoji picker grid */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-f1-muted mb-1.5">
                    Pick an emoji
                  </p>
                  <div className="grid grid-cols-10 gap-1">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setNewEmoji(emoji)}
                        className={`text-lg p-1 rounded-md transition-all ${
                          newEmoji === emoji
                            ? "bg-f1-red/20 ring-1 ring-f1-red scale-110"
                            : "hover:bg-f1-surface-hover"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    disabled={!newName.trim()}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                      newName.trim()
                        ? "bg-f1-red hover:bg-red-700 text-white"
                        : "bg-f1-border text-f1-muted cursor-not-allowed"
                    }`}
                  >
                    Add {newEmoji} {newName.trim() || "Player"}
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-2 rounded-lg text-sm text-f1-muted hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-f1-muted hover:text-white hover:bg-f1-surface-hover transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Player
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
