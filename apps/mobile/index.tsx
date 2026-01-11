import 'react-native-url-polyfill/auto';
import './src/__create/polyfills';
global.Buffer = require('buffer').Buffer;

import 'expo-router/entry';
import { App } from 'expo-router/build/qualified-entry';
import type { ReactNode } from 'react';
import { AppRegistry, LogBox } from 'react-native';
import { DeviceErrorBoundaryWrapper } from './__create/DeviceErrorBoundary';

// Remove AnythingMenu dependency for standalone operation
function HabitPunchWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

let WrapperComponentProvider = HabitPunchWrapper;

if (__DEV__) {
  LogBox.ignoreAllLogs();
  LogBox.uninstall();
  WrapperComponentProvider = ({ children }) => {
    return (
      <DeviceErrorBoundaryWrapper>
        {children}
      </DeviceErrorBoundaryWrapper>
    );
  };
}
AppRegistry.setWrapperComponentProvider(() => WrapperComponentProvider);
AppRegistry.registerComponent('main', () => App);
