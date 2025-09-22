import { supabaseClient } from '@app/lib/supabase-client';

export const login = async (email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};
