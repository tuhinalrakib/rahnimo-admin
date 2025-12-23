"use client";
import { store, persistor } from '@/lib/store';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const ReduxProvider = ({ children }) => {

    return <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            { children }
        </PersistGate>
    </Provider>
};

export default ReduxProvider;