import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
    user: {
        id: number | null;
        email: string;
        fullName: string;
        role: 'admin' | 'user' | null;
        token: string | null;
        permissions: string[];
    }
    isAuthenticated: boolean;
}

const initialState: UserData = {
    user: {
        id: null,
        email: '',
        fullName: '',
        role: null,
        token: null,
        permissions: [],
    },
    isAuthenticated: false,
};

const userDataSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<Partial<UserData>>) => {
            return { ...state, ...action.payload };
        },
        clearUserData: (state) => {
            return initialState;
        },
    },
});

export const {
    setUserData,
    clearUserData
} = userDataSlice.actions;

export default userDataSlice.reducer; 