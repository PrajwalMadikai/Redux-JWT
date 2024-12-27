import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    email: string;
    userId: string;
    isLoggedIn: boolean;
    
  }
  
  const initialState: UserState = {
    email: '',
    userId: '',
    isLoggedIn: false,
    
  };
  
  const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setUser: (state, action: PayloadAction<{ email: string; userId: string ;}>) => {
        state.email = action.payload.email;
        state.userId = action.payload.userId;
        state.isLoggedIn = true;
       
      },
      clearUser: (state) => {
        state.email = '';
        state.userId = '';
        state.isLoggedIn = false;
        
      },
    },
  });

 
  export const { setUser, clearUser } = userSlice.actions;
  
  export default userSlice.reducer;