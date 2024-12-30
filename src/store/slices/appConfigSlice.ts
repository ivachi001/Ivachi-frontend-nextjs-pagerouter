import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppConfigState {
    appLoading: boolean;
    theme: 'light' | 'dark';
    isSidebarCollapsed: boolean;
    notifications: {
        isEnabled: boolean;
        sound: boolean;
    };
}

const initialState: AppConfigState = {
    appLoading: false,
    theme: 'light',
    isSidebarCollapsed: false,
    notifications: {
        isEnabled: true,
        sound: true,
    },
};

const appConfigSlice = createSlice({
    name: 'appConfig',
    initialState,
    reducers: {
        showAppLoader: (state) => {
            state.appLoading = true;
        },
        hideAppLoader: (state) => {
            state.appLoading = false;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        toggleSidebar: (state) => {
            state.isSidebarCollapsed = !state.isSidebarCollapsed;
        },
        updateNotificationSettings: (state, action: PayloadAction<Partial<AppConfigState['notifications']>>) => {
            state.notifications = { ...state.notifications, ...action.payload };
        },
    },
});

export const {
    showAppLoader,
    hideAppLoader,
    toggleTheme,
    toggleSidebar,
    updateNotificationSettings,
} = appConfigSlice.actions;

export default appConfigSlice.reducer; 