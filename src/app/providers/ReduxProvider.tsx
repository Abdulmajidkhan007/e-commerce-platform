import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { Spinner } from "@/components/feedback/Spinner";

interface Props {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex min-h-screen items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
