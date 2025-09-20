import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';
import { Trophy } from 'lucide-react';

interface LeaderboardViewProps {
  user: User;
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ user }) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Community Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Leaderboard functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardView;