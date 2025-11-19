
import React from 'react';
import type { UserProfile } from '../types';
import { Page } from '../types';
import { UserPlusIcon } from './icons';

interface UserCardProps {
  user: UserProfile;
  setPage: (page: Page, userId?: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, setPage }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex items-center space-x-4">
          <img className="w-16 h-16 rounded-full" src={user.avatarUrl} alt={user.fullName} />
          <div>
            <h3 
              className="text-lg font-semibold text-brand-dark cursor-pointer hover:text-brand-primary"
              onClick={() => setPage(Page.Profile, user.id)}
            >
              {user.fullName}
            </h3>
            <p className="text-sm text-gray-600">{user.headline}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700 h-10 overflow-hidden">{user.bio}</p>
        <div className="mt-4">
          <h4 className="text-sm font-medium text-brand-secondary">Top Skills</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.skills.slice(0, 3).map(skill => (
              <span key={skill.skill} className="px-2 py-1 text-xs font-medium bg-brand-accent bg-opacity-20 text-brand-primary rounded-full">
                {skill.skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => setPage(Page.Profile, user.id)}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
        >
          <UserPlusIcon className="w-5 h-5 mr-2" />
          View Profile & Connect
        </button>
      </div>
    </div>
  );
};
