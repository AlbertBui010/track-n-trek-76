import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useActivities } from '@/hooks/useActivities';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock, Zap, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecentActivities = () => {
  const { activities, loading } = useActivities();
  const navigate = useNavigate();

  const recentActivities = activities.slice(0, 5);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 rounded-lg border animate-pulse">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
            <div className="flex gap-4">
              <div className="h-3 bg-muted rounded w-16"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!recentActivities.length) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <MapPin className="w-12 h-12 mx-auto text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
        <p className="text-muted-foreground mb-4">
          Start tracking your running and cycling activities
        </p>
        <Button onClick={() => navigate('/activities/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Activity
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentActivities.map((activity) => (
        <div 
          key={activity.id} 
          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => navigate(`/activities/${activity.id}`)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{activity.title}</h4>
              <Badge variant="secondary" className="text-xs">
                {activity.activity_type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{activity.distance?.toFixed(1)} km</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(activity.duration || 0)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>{activity.pace?.toFixed(1)} min/km</span>
            </div>
          </div>
        </div>
      ))}
      
      {activities.length > 5 && (
        <div className="text-center pt-4">
          <Button variant="outline" onClick={() => navigate('/activities')}>
            View All Activities
          </Button>
        </div>
      )}
    </div>
  );
};