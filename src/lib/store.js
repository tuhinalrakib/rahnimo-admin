import { 
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE, 
    REGISTER, 
    REHYDRATE,
    persistReducer,
    persistStore,
} from "redux-persist"
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/reduxSlice/authSlice"
import userReducer from "@/reduxSlice/userSlice"

const storage = typeof window !== "undefined" ?
    require("redux-persist/lib/storage").default : null

const userPersistConfig = {
  key: "adminUser",
  storage,
  whitelist: ["user"],
};

const authPersistConfig = {
  key: "adminAuth",
  storage,
  whitelist: ["accessToken"],
};

const persistedUserReducer = storage
    ?
    persistReducer(userPersistConfig, userReducer)
    :
    userReducer;

const persistedAuthReducer = storage
    ?
    persistReducer(authPersistConfig, authReducer)
    :
    authReducer
const rootReducer = combineReducers({
    auth : persistedAuthReducer,
    user : persistedUserReducer
})

export const store = configureStore({
    reducer : rootReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = storage ? persistStore(store) : null;