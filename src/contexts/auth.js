import { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
    	// Check for the current user session
		const fetchSession = async () => {
			const { data: { session } } = await supabase.auth.getSession();
			setUser(session?.user ?? null);
		};

    	// Subscribe to session changes (login, logout, etc.)
    	const { data: authListener } = supabase.auth.onAuthStateChange(
        	(event, session) => {
            	setUser(session?.user ?? null);
        	}
    	);

    	return () => {
        	authListener?.unsubscribe();
    	};
	}, []);

	const value = {
    	signIn: (email, password) => supabase.auth.signIn({ email, password }),
    	signOut: () => supabase.auth.signOut(),
    	user
	};

	return (
    	<AuthContext.Provider value={value}>
        	{children}
    	</AuthContext.Provider>
	);
}
