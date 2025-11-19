import type { UserProfile, Session, SkillEndorsement } from '../types';
import { supabase } from '../supabaseClient';
// FIX: Add a top-level import for the Supabase Session type to avoid parsing issues with inline dynamic imports.
import type { Session as SupabaseSession } from '@supabase/supabase-js';

export const supabaseService = {
  onAuthStateChange(
    // FIX: Corrected the callback signature by using the imported SupabaseSession type and adding the 'session' parameter name.
    callback: (event: string, session: SupabaseSession | null) => void
  ) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async signIn(email: string, password?: string): Promise<{ session: Session | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: password as string });
    if (error) throw error;
    return { session: data.session as Session };
  },

  async signUp(email: string, password?: string, fullName?: string): Promise<{ session: Session | null }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: password as string,
      options: {
        data: {
          full_name: fullName,
          avatar_url: `https://i.pravatar.cc/150?u=${email}`
        }
      }
    });
    if (error) throw error;
    // The auth trigger will create the profile. The onAuthStateChange listener will handle the session.
    return { session: data.session as Session };
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getUserById(id: string): Promise<UserProfile | null> {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        headline,
        bio,
        avatar_url
      `)
      .eq('id', id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      throw profileError;
    }
    if (!profileData) return null;

    // Fetch skills with their endorsements and endorser profiles
    const { data: skillsData, error: skillsError } = await supabase
      .from('skills')
      .select(`
        id,
        skill_name,
        endorsements (
          endorser_id,
          profiles ( id, full_name )
        )
      `)
      .eq('user_id', id);

    if (skillsError) {
      console.error("Error fetching skills:", skillsError);
      throw skillsError;
    }

    const formattedSkills: SkillEndorsement[] = (skillsData || []).map((s: any) => ({
      skill: s.skill_name,
      // FIX: Ensure `s.endorsements` is an array before calling .filter to prevent crash if it's null.
      endorsedBy: (s.endorsements || [])
        .filter((e: any) => e.profiles) // Defensively filter out endorsements with no matching profile
        .map((e: any) => ({ id: e.profiles.id, fullName: e.profiles.full_name })),
    }));

    // Fetch connections
    const { data: connectionsData, error: connectionsError } = await supabase
      .from('connections')
      .select('user2_id')
      .eq('user1_id', id);

    if (connectionsError) {
      console.error("Error fetching connections:", connectionsError);
      throw connectionsError;
    }

    return {
      id: profileData.id,
      email: profileData.email,
      fullName: profileData.full_name,
      headline: profileData.headline || '',
      bio: profileData.bio || '',
      avatarUrl: profileData.avatar_url,
      skills: formattedSkills,
      connections: ((connectionsData as any[]) || []).map((c: any) => c.user2_id as string),
    };
  },

  async searchUsersBySkill(query: string): Promise<UserProfile[]> {
    let userIds: string[];

    if (!query) {
      const { data, error } = await supabase.from('profiles').select('id');
      if (error) throw error;
      // FIX: The `id` from Supabase can be `unknown`. `flatMap` is used to safely
      // extract only valid string IDs, ensuring type safety and preventing runtime errors.
      userIds = ((data as any[]) || []).flatMap((p: any) => (typeof p.id === 'string' ? [p.id] : []));
    } else {
      const { data: skillsData, error } = await supabase
        .from('skills')
        .select('user_id')
        .ilike('skill_name', `%${query}%`);
      if (error) throw error;
      // FIX: The `user_id` from Supabase can be `unknown` and `skillsData` can be null.
      // `flatMap` is used to safely extract only valid string user IDs, ensuring type safety
      // and preventing runtime errors.
      userIds = [...new Set(((skillsData as any[]) || []).flatMap((s: any) => (typeof s.user_id === 'string' ? [s.user_id] : [])))];
    }

    if (userIds.length === 0) return [];

    // Bulk fetch all required data
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, headline, bio, avatar_url')
      .in('id', userIds);
    if (profilesError) throw profilesError;

    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('user_id, skill_name, endorsements(endorser_id, profiles(id, full_name))')
      .in('user_id', userIds);
    if (skillsError) throw skillsError;

    const { data: connections, error: connectionsError } = await supabase
      .from('connections')
      .select('user1_id, user2_id')
      .in('user1_id', userIds);
    if (connectionsError) throw connectionsError;

    // Process and map data in-memory for efficiency
    const skillsByUser = new Map<string, any[]>();
    skills?.forEach(skill => {
        if (!skillsByUser.has(skill.user_id)) skillsByUser.set(skill.user_id, []);
        skillsByUser.get(skill.user_id)!.push(skill);
    });

    const connectionsByUser = new Map<string, string[]>();
    connections?.forEach(conn => {
        if (!connectionsByUser.has(conn.user1_id)) connectionsByUser.set(conn.user1_id, []);
        connectionsByUser.get(conn.user1_id)!.push(conn.user2_id);
    });

    // Assemble the final UserProfile objects
    // FIX: Handle case where profiles might be null (though unlikely given previous checks)
    return (profiles || []).map(profile => {
      const userSkills = skillsByUser.get(profile.id) || [];
      const formattedSkills: SkillEndorsement[] = userSkills.map((s: any) => ({
        skill: s.skill_name,
        // FIX: Ensure `s.endorsements` is an array before calling .filter to prevent crash if it's null.
        endorsedBy: (s.endorsements || [])
          .filter((e: any) => e.profiles) // Defensively filter out endorsements with no matching profile
          .map((e: any) => ({ id: e.profiles.id, fullName: e.profiles.full_name })),
      }));

      return {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        headline: profile.headline || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatar_url,
        skills: formattedSkills,
        connections: connectionsByUser.get(profile.id) || [],
      };
    });
  },

  async updateProfile(userId: string, updates: { headline?: string; bio?: string }): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async addEndorsement(targetUserId: string, skill: string, endorserId: string): Promise<void> {
    const { data: skillData, error: skillError } = await supabase
      .from('skills')
      .select('id')
      .eq('user_id', targetUserId)
      .eq('skill_name', skill)
      .single();

    if (skillError || !skillData) {
      console.error('Error finding skill to endorse:', skillError);
      throw new Error('Could not find the specified skill to endorse.');
    }

    const skillId = skillData.id;

    const { error: endorsementError } = await supabase
      .from('endorsements')
      .insert({ skill_id: skillId, endorser_id: endorserId });

    if (endorsementError) {
      if (endorsementError.code === '23505') { // unique_violation
        console.warn('User has already endorsed this skill.');
        return;
      }
      console.error('Error adding endorsement:', endorsementError);
      throw endorsementError;
    }
  },
  
  async addSkill(userId: string, skill: string): Promise<void> {
    const { error } = await supabase
      .from('skills')
      .insert({ user_id: userId, skill_name: skill });

    if (error) {
      if (error.code === '23505') { // unique_violation
        console.warn('User already has this skill.');
        return;
      }
      console.error('Error adding skill:', error);
      throw error;
    }
  },

  async sendConnectionRequest(senderId: string, receiverId: string): Promise<void> {
    // Create a bidirectional connection to ensure it shows for both users
    const { error } = await supabase
      .from('connections')
      .insert([
        { user1_id: senderId, user2_id: receiverId },
        { user1_id: receiverId, user2_id: senderId },
      ]);

    if (error) {
      if (error.code === '23505') { // unique_violation
        console.warn('Connection already exists.');
        return;
      }
      console.error('Error sending connection request:', error);
      throw error;
    }
  },
};