import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Activity {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  gpx_url: string | null;
  distance: number | null;
  duration: number | null;
  pace: number | null;
  elevation_gain: number | null;
  activity_type: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityTag {
  id: string;
  activity_id: string;
  tag: string;
  created_at: string;
}

export const useActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData: Partial<Activity> & { title: string }) => {
    if (!user) return { error: 'No user found' };

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          ...activityData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setActivities(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating activity:', error);
      return { data: null, error };
    }
  };

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    if (!user) return { error: 'No user found' };

    try {
      const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setActivities(prev => 
        prev.map(activity => 
          activity.id === id ? data : activity
        )
      );
      return { data, error: null };
    } catch (error) {
      console.error('Error updating activity:', error);
      return { data: null, error };
    }
  };

  const deleteActivity = async (id: string) => {
    if (!user) return { error: 'No user found' };

    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setActivities(prev => prev.filter(activity => activity.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Error deleting activity:', error);
      return { error };
    }
  };

  const uploadGPX = async (file: File) => {
    if (!user) return { error: 'No user found' };

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('gpx-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('gpx-files')
        .getPublicUrl(fileName);

      return { data: data.publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading GPX:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [user]);

  return {
    activities,
    loading,
    createActivity,
    updateActivity,
    deleteActivity,
    uploadGPX,
    refetch: fetchActivities,
  };
};