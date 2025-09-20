import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';
import { Settings } from 'lucide-react';

interface AdminPanelProps {
  user: User;
  currentView: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, currentView }) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin Panel - {currentView}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Admin functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;