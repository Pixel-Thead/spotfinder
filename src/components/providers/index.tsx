import { View } from 'react-native';
import Toast from 'react-native-toast-message';

import { AuthProvider } from './auth';
import { TQueryProvider } from './query';
import { SubscriptionProvider } from './subscription';
import { AuthGuard } from '../guard/auth';

type Props = {
  children: Readonly<React.ReactNode>;
};

export const MainProviders = ({ children }: Props) => {
  return (
    <TQueryProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <AuthGuard>
            <View className="h-full w-full bg-gray-100 dark:bg-gray-950">{children}</View>
            <Toast position="bottom" topOffset={50} />
          </AuthGuard>
        </SubscriptionProvider>
      </AuthProvider>
    </TQueryProvider>
  );
};
