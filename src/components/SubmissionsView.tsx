import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';
import { Shield } from 'lucide-react';

interface SubmissionsViewProps {
  user: User;
}

const SubmissionsView: React.FC<SubmissionsViewProps> = ({ user }) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Review Submissions - AEO Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>AEO submission review functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionsView;