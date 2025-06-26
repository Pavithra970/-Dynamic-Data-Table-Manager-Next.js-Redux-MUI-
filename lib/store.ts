import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

import themeReducer from './slices/themeSlice'
import rowsReducer    from './slices/rowsSlice'
import columnsReducer from './slices/columnsSlice'

// ---------- storage that works in both browser & server ----------
const createNoopStorage = () => ({
  getItem   : async (_: string) => null,
  setItem   : async (_: string, __: string) => {},
  removeItem: async (_: string) => {},
})

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')   // real localStorage in browser
    : createNoopStorage()         // noop on the server

// ---------- persist config ----------
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['columns','theme'],        // only persist column visibility
}

// ---------- root reducer ----------
const rootReducer = combineReducers({
  rows: rowsReducer,
  columns: columnsReducer,
  theme: themeReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// ---------- store ----------
export const store = configureStore({
  reducer: persistedReducer,
  middleware: gDM =>
    gDM({
      serializableCheck: false,  // silence redux-persist warnings
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)

// ---------- typed hooks ----------
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
