import { HydraXProvider, useHydraX } from '@/contexts/HydraXContext';
import { LoginPanel } from '@/components/LoginPanel';
import { Dashboard } from '@/components/Dashboard';

const HydraXApp = () => {
  const { currentUser } = useHydraX();

  if (!currentUser) {
    return <LoginPanel />;
  }

  return <Dashboard />;
};

const Index = () => {
  return (
    <HydraXProvider>
      <HydraXApp />
    </HydraXProvider>
  );
};

export default Index;
