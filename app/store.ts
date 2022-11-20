import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '../slices/uiSlice'

// configureStoreは複数のreducerをひとまとめにして格納してくれる
export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
})

//storeの中に記載しているすべてstateを取得
//typeof store.getState (そのstateのデータ型を取得)（RootState）
export type RootState = ReturnType<typeof store.getState>
