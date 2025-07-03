
import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  Shield,
  LogOut,
  Upload
} from 'lucide-react';
import { OjahDashboard } from './modules/OjahDashboard';
import { OjahContentManagement } from './modules/OjahContentManagement';
import { OjahUserManagement } from './modules/OjahUserManagement';
import { OjahSiteSettings } from './modules/OjahSiteSettings';
import { OjahAnalytics } from './modules/OjahAnalytics';
import { OjahSystemSecurity } from './modules/OjahSystemSecurity';
import { OjahCsvImport } from './modules/OjahCsvImport';

interface OjahLayoutProps {
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: OjahDashboard },
  { id: 'content', label: 'Управление контентом', icon: FileText, component: OjahContentManagement },
  { id: 'users', label: 'Управление пользователями', icon: Users, component: OjahUserManagement },
  { id: 'csv-import', label: 'Импорт CSV', icon: Upload, component: OjahCsvImport },
  { id: 'settings', label: 'Настройки сайта', icon: Settings, component: OjahSiteSettings },
  { id: 'analytics', label: 'Аналитика и статистика', icon: BarChart3, component: OjahAnalytics },
  { id: 'system', label: 'Система и безопасность', icon: Shield, component: OjahSystemSecurity },
];

export const OjahLayout = ({ onLogout }: OjahLayoutProps) => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const ActiveComponent = menuItems.find(item => item.id === activeModule)?.component || OjahDashboard;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <h2 className="text-lg font-semibold">Ojah Admin</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeModule === item.id}
                    onClick={() => setActiveModule(item.id)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onLogout} className="text-red-600 hover:text-red-700">
                  <LogOut className="h-4 w-4" />
                  <span>Выйти</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 flex flex-col">
          <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">
                {menuItems.find(item => item.id === activeModule)?.label || 'Dashboard'}
              </h1>
            </div>
            <Button onClick={onLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </header>
          
          <div className="flex-1 p-6 bg-gray-50">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
