import { useState, useTransition } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar, type TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { CustomersView } from './components/CustomersView';
import { BillingView } from './components/BillingView';
import { SettingsView } from './components/SettingsView';
import { ToastContainer, type ToastMessage } from './components/Toast';
import {
  INITIAL_CUSTOMERS,
  INITIAL_INVOICES,
  INITIAL_ACTIVITIES,
} from './data/mockData';
import type { Customer, CustomerStatus } from './types';
import './App.css';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, startTransition] = useTransition();

  // Primary data states
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [invoices] = useState(INITIAL_INVOICES);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddCustomer = (data: Omit<Customer, 'id' | 'signupDate'>) => {
    const newCustomer: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      signupDate: new Date().toISOString().split('T')[0],
    };

    setCustomers((prev) => [newCustomer, ...prev]);

    // Record activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        title: 'Nuevo suscriptor registrado',
        description: `${data.name} (${data.company}) se unió al plan ${data.plan}`,
        timestamp: 'Justo ahora',
        type: 'signup',
      },
      ...prev,
    ]);
  };

  const handleUpdateStatus = (customerId: string, newStatus: CustomerStatus) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: newStatus } : c))
    );
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
  };

  const handleRefresh = () => {
    triggerToast('Métricas y datos sincronizados con el servidor', 'info');
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          startTransition(() => {
            setCurrentTab(tab);
          });
        }}
        customerCount={customers.length}
        isOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          activities={activities}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRefresh={handleRefresh}
        />

        <main className="content-body">
          {currentTab === 'overview' && (
            <OverviewView
              customers={customers}
              activities={activities}
              onTriggerToast={triggerToast}
              onNavigateToCustomers={() => setCurrentTab('customers')}
            />
          )}

          {currentTab === 'customers' && (
            <CustomersView
              customers={customers}
              searchTerm={searchTerm}
              onAddCustomer={handleAddCustomer}
              onUpdateStatus={handleUpdateStatus}
              onDeleteCustomer={handleDeleteCustomer}
              onTriggerToast={triggerToast}
            />
          )}

          {currentTab === 'billing' && (
            <BillingView
              invoices={invoices}
              onTriggerToast={triggerToast}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView onTriggerToast={triggerToast} />
          )}
        </main>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
