import { supabase } from './supabaseClient';

const redirectTo = window.location.origin;

// Sign up new user
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

// Sign in existing user
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

// Sign out current user
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Get current user session
export function getUser() {
  return supabase.auth.getUser();
}

// Listen to auth state changes (optional)
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

// Sign in with Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo,
    },
  });
  return { data, error };
}

// Sign in with Microsoft
export async function signInWithMicrosoft() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      redirectTo: redirectTo,
    },
  });
  return { data, error };
}

// Sign in with Discord
export async function signInWithDiscord() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: redirectTo,
    },
  });
  return { data, error };
}
