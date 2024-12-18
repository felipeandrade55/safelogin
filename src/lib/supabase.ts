import { createClient } from '@supabase/supabase-js';

// Inicializa o cliente Supabase com as credenciais da instância self-hosted
const supabaseUrl = localStorage.getItem('SUPABASE_URL') || '';
const supabaseAnonKey = localStorage.getItem('SUPABASE_ANON_KEY') || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para configurar as credenciais do Supabase
export const configureSupabase = (url: string, anonKey: string) => {
  localStorage.setItem('SUPABASE_URL', url);
  localStorage.setItem('SUPABASE_ANON_KEY', anonKey);
  window.location.reload(); // Recarrega a página para usar as novas credenciais
};

// Função para verificar se o Supabase está configurado
export const isSupabaseConfigured = () => {
  return !!localStorage.getItem('SUPABASE_URL') && !!localStorage.getItem('SUPABASE_ANON_KEY');
};