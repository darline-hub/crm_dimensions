
export interface Role {
  id_role: number;
  libelle: string;
  description?: string;
}

export interface Permission {
  id_permission: number;
  nom: string;
  description?: string;
}

export interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  est_actif: boolean;
  role: Role;
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  mot_de_passe: string;
}

export interface AuthResponse {
  token: string;
  user: Utilisateur;
}