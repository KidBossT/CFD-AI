import React, { useState, useEffect } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNoteStore } from '../store/noteStore';

export const VoiceAssistant: React.FC = () => {
  const [currentNote, setCurrentNote] = useState('');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { notes, addNote, deleteNote } = useNoteStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIframeLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSaveNote = () => {
    if (currentNote.trim()) {
      addNote({
        id: crypto.randomUUID(),
        content: currentNote,
        timestamp: new Date(),
      });
      setCurrentNote('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-400 mb-4">Voice Assistant</h1>
        <p className="text-gray-400">Interact with your Fluid 101 assistant using voice commands</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-green-500/20 rounded-xl p-6">
            <div className="space-y-4">
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Take notes during the conversation..."
                className="w-full h-32 bg-black/40 border border-green-500/20 rounded-lg p-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-green-500/40 scrollbar-thin"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNote}
                  disabled={!currentNote.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  Save Note
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-green-500/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-green-400 mb-4">Saved Notes</h2>
            <motion.div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin">
              <AnimatePresence mode="popLayout">
                {notes.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 py-4"
                  >
                    No saved notes yet
                  </motion.p>
                ) : (
                  notes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="group bg-black/40 border border-green-500/20 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="text-gray-300 whitespace-pre-wrap">{note.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {note.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-2 opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: iframeLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-green-500/20 rounded-xl p-6 h-[800px] relative"
          >
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <iframe
                id="audio_iframe"
                src="https://widget.synthflow.ai/widget/v2/1732025003345x935396384966841900/1732025003254x795626211022958600"
                allow="microphone"
                width="100%"
                height="100%"
                style={{
                  border: 'none',
                  background: 'transparent',
                  pointerEvents: 'auto',
                }}
                onLoad={() => setIframeLoaded(true)}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};