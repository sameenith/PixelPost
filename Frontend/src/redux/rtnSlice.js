import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
  },
  reducers: {
    // actions
    setLikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        state.likeNotification.push(action.payload);
      } 
      else if (action.payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (notification) => {
            const notificationToRemoveId = `${action.payload?.userId}-${action.payload?.postId}`;
            const currentNotificationId = `${notification?.userId}-${notification?.postId}`;
            
            return currentNotificationId !== notificationToRemoveId;
          }
        );
      }
    },
    clearNotifications: (state) => {
      state.likeNotification = [];
    },
  },
});

export const { setLikeNotification,clearNotifications } = rtnSlice.actions;
export default rtnSlice.reducer;
