
import React, { useState, useEffect, useCallback } from 'react';
import type { UserProfile, Session } from '../types';
import { Page } from '../types';
import { ConnectModal } from '../components/ConnectModal';
import { UserPlusIcon, CheckCircleIcon, PlusCircleIcon, PencilIcon, XMarkIcon } from '../components/icons';

interface ProfilePageProps {
  userId: string;
  session: Session;
  setPage: (page: Page, userId?: string) => void;
  supabaseService: any;
}

const SkillItem: React.FC<{
  skillEndorsement: UserProfile['skills'][0];
  onEndorse: (skill: string) => void;
  isEndorsedByCurrentUser: boolean;
  isOwnProfile: boolean;
}> = ({ skillEndorsement, onEndorse, isEndorsedByCurrentUser, isOwnProfile }) => {
  return (
    <li className="flex items-center justify-between p-3 bg-white rounded-md hover:bg-gray-100 transition-colors border">
      <div>
        <span className="font-medium text-brand-secondary">{skillEndorsement.skill}</span>
        {skillEndorsement.endorsedBy.length > 0 && (
          <span className="ml-2 text-sm text-gray-500">
            &bull; {skillEndorsement.endorsedBy.length} endorsement{skillEndorsement.endorsedBy.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      {!isOwnProfile && (
        <button
          onClick={() => onEndorse(skillEndorsement.skill)}
          disabled={isEndorsedByCurrentUser}
          className="inline-flex items-center text-sm font-medium text-brand-primary disabled:text-green-500 disabled:cursor-not-allowed hover:text-brand-dark"
        >
          {isEndorsedByCurrentUser ? (
            <>
              <CheckCircleIcon className="w-5 h-5 mr-1" /> Endorsed
            </>
          ) : (
            <>
              <PlusCircleIcon className="w-5 h-5 mr-1" /> Endorse
            </>
          )}
        </button>
      )}
    </li>
  );
};


export const ProfilePage: React.FC<ProfilePageProps> = ({ userId, session, setPage, supabaseService }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ headline: '', bio: '' });

  const isOwnProfile = userId === session.user.id;
  const isConnected = !!currentUser?.connections?.includes(userId);

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, currentUserData] = await Promise.all([
        supabaseService.getUserById(userId),
        supabaseService.getUserById(session.user.id)
      ]);
      if (!profileData) {
        throw new Error("User not found.");
      }
      setUser(profileData);
      setCurrentUser(currentUserData);
      // Initialize edit state
      setEditData({
        headline: profileData.headline || '',
        bio: profileData.bio || ''
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  }, [userId, session.user.id, supabaseService]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleEndorse = async (skill: string) => {
    if (!user) return;
    await supabaseService.addEndorsement(user.id, skill, session.user.id);
    fetchProfileData(); // Re-fetch to update UI
  };
  
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    await supabaseService.addSkill(session.user.id, newSkill.trim());
    setNewSkill('');
    fetchProfileData();
  };

  const handleSendRequest = async (message: string) => {
    if (!user) return;
    console.log(`Sending connection request to ${user.fullName} with message: "${message}"`);
    await supabaseService.sendConnectionRequest(session.user.id, user.id);
    fetchProfileData();
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      await supabaseService.updateProfile(user.id, editData);
      setUser({ ...user, headline: editData.headline, bio: editData.bio });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to save profile updates.");
    }
  };

  const handleCancelEdit = () => {
    if (user) {
        setEditData({ headline: user.headline || '', bio: user.bio || '' });
    }
    setIsEditing(false);
  };

  if (loading) return <div className="text-center py-20">Loading profile...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!user || !currentUser) return <div className="text-center py-20">Could not load user data.</div>;

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="md:flex md:items-start">
              <div className="md:flex-shrink-0 flex justify-center md:block">
                <img className="h-32 w-32 rounded-full object-cover" src={user.avatarUrl} alt={user.fullName} />
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left flex-grow">
                <h2 className="text-3xl font-bold text-brand-dark">{user.fullName}</h2>
                
                {isEditing ? (
                    <div className="mt-2">
                        <label htmlFor="headline" className="sr-only">Headline</label>
                        <input
                            id="headline"
                            type="text"
                            value={editData.headline}
                            onChange={(e) => setEditData({...editData, headline: e.target.value})}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
                            placeholder="Your professional headline (e.g. Founder at TechStartup)"
                        />
                    </div>
                ) : (
                    <p className="text-xl text-gray-600 mt-1">{user.headline || <span className="text-gray-400 italic">No headline added</span>}</p>
                )}
                
                <p className="text-sm text-gray-500 mt-2">{user.email}</p>
              </div>

              <div className="mt-6 md:mt-0 md:ml-auto flex flex-col items-center md:items-end space-y-3">
                {!isOwnProfile ? (
                  <button
                    onClick={() => setIsConnectModalOpen(true)}
                    disabled={!!isConnected}
                    className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-green-500 disabled:cursor-not-allowed"
                  >
                    {isConnected ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5 mr-2" /> Connected
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="w-5 h-5 mr-2" /> Connect
                      </>
                    )}
                  </button>
                ) : (
                    <div className="flex space-x-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancelEdit}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
                                >
                                    <XMarkIcon className="w-5 h-5 mr-2 -ml-1" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
                                >
                                    <CheckCircleIcon className="w-5 h-5 mr-2 -ml-1" />
                                    Save
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
                            >
                                <PencilIcon className="w-5 h-5 mr-2 -ml-1" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-8 py-6">
            <h3 className="text-xl font-semibold text-brand-dark mb-4">About</h3>
            {isEditing ? (
                 <textarea
                    rows={5}
                    className="shadow-sm focus:ring-brand-accent focus:border-brand-accent block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Tell us about your background, your skills, and what kind of business you want to start..."
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                 />
            ) : (
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {user.bio || <span className="text-gray-400 italic">No bio added yet.</span>}
                </p>
            )}
          </div>
          
          <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
            <h3 className="text-xl font-semibold text-brand-dark mb-4">Skills</h3>
            {isOwnProfile && (
              <form onSubmit={handleAddSkill} className="mb-4 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill (e.g., JavaScript)"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary"
                >
                  Add Skill
                </button>
              </form>
            )}
            <ul className="space-y-2">
              {user.skills.length > 0 ? (
                user.skills.map(skillEndorsement => (
                  <SkillItem
                      key={skillEndorsement.skill}
                      skillEndorsement={skillEndorsement}
                      onEndorse={handleEndorse}
                      isEndorsedByCurrentUser={skillEndorsement.endorsedBy.some(e => e.id === session.user.id)}
                      isOwnProfile={isOwnProfile}
                  />
                ))
              ) : (
                <li className="text-gray-500 text-sm p-3 bg-gray-100 rounded-md">
                  {isOwnProfile ? "You haven't added any skills yet. Add one above to let others know what you're great at!" : "This user hasn't added any skills yet."}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {!isOwnProfile && (
        <ConnectModal
          isOpen={isConnectModalOpen}
          onClose={() => setIsConnectModalOpen(false)}
          targetUser={user}
          currentUser={currentUser}
          onSendRequest={handleSendRequest}
        />
      )}
    </>
  );
};
