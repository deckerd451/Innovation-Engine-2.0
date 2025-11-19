
import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { generateConnectionMessage } from '../services/geminiService';
import { SparklesIcon, UserPlusIcon } from './icons';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: UserProfile;
  currentUser: UserProfile;
  onSendRequest: (message: string) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, targetUser, currentUser, onSendRequest }) => {
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMessage(`Hi ${targetUser.fullName.split(' ')[0]}, I'd like to connect.`);
    }
  }, [isOpen, targetUser.fullName]);

  if (!isOpen) return null;

  const handleGenerateMessage = async () => {
    setIsGenerating(true);
    try {
      const generatedMsg = await generateConnectionMessage(currentUser, targetUser);
      setMessage(generatedMsg);
    } catch (error) {
      console.error(error);
      // Fallback message
      setMessage(`Hi ${targetUser.fullName.split(' ')[0]},\nI came across your profile and was impressed with your background. I'd love to connect and discuss potential collaborations.\nBest,\n${currentUser.fullName.split(' ')[0]}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSend = () => {
    onSendRequest(message);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-brand-dark">Send Connection Request to {targetUser.fullName}</h3>
        </div>
        <div className="p-6">
          <textarea
            className="w-full h-40 p-3 border rounded-md focus:ring-2 focus:ring-brand-accent focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={handleGenerateMessage}
            disabled={isGenerating}
            className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400"
          >
            <SparklesIcon className="w-4 h-4 mr-2"/>
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
          <button onClick={handleSend} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md shadow-sm hover:bg-brand-secondary">
             <UserPlusIcon className="w-5 h-5 mr-2" />
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};
