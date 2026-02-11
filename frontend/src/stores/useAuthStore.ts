import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    setAccessToken: (accessToken) => {
        set({accessToken});
    },

    clearState: () => {
        set({accessToken: null, user: null, loading: false});
    },

    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true });
            await authService.signUp(username, password, email, firstName, lastName);
            toast.success("Account created successfully. Redirecting...");
            
            setTimeout(() => {
                window.location.href = '/signin';
            }, 1500);
        } catch (error) {
            console.error(error);
            toast.error('Unable to sign up');
        } finally {
            set({loading: false})
        }
    },

    signIn: async (username, password) => {
        try {
            set({loading: true});

            const {accessToken} = await authService.signIn(username, password);
            get().setAccessToken(accessToken);

            await get().fetchMe();

            toast.success('Welcome back to NoteChat!');

        } catch (error) {
            console.error(error);
            toast.error('Sign in failed. Please try again.');
        } finally { 
        set({loading: false});
        }
    },

    signOut: async () => {
        try {
            await authService.signOut();
            get().clearState(); 
            toast.success('Logged out successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Error logging out. Please try again.');
        }
    },

    fetchMe: async () => {
        try {
            set({ loading: true });
            const user = await authService.fetchMe();
            set({ user });
        } catch (error) {
            console.error(error);
            set({ user: null, accessToken: null });
            toast.error("Error fetching user data. Please try again.");
        } finally {
            set({ loading: false });
        }
    },

    refresh: async () => {
        try {
            set({loading: true})
            const {user, fetchMe, setAccessToken} = get();
            const accessToken = await authService.refresh();

            setAccessToken(accessToken);

            if(!user) {
                await fetchMe();
            }

        } catch (error) {
            console.error(error);
            toast.error('Session expired. Please sign in again.')
            get().clearState();
        } finally {
            set({loading: false});
        }
    }
}))