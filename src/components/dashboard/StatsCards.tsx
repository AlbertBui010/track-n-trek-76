import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Zap, Trophy } from 'lucide-react';
import { useActivities } from '@/hooks/useActivities';

export const StatsCards = () => {
  const { activities, loading } = useActivities();

  const stats = React.useMemo(() => {
    if (!activities.length) {
      return {
        totalDistance: 0,
        totalTime: 0,
        avgPace: 0,
        totalActivities: 0,
      };
    }

    const totalDistance = activities.reduce((sum, activity) => sum + (activity.distance || 0), 0);
    const totalTime = activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
    const avgPace = activities.length > 0 
      ? activities.reduce((sum, activity) => sum + (activity.pace || 0), 0) / activities.length
      : 0;

    return {
      totalDistance,
      totalTime,
      avgPace,
      totalActivities: activities.length,
    };
  }, [activities]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const statsData = [
    {
      title: "Total Distance",
      value: `${stats.totalDistance.toFixed(1)} km`,
      icon: MapPin,
      color: "text-primary"
    },
    {
      title: "Total Time",
      value: formatTime(stats.totalTime),
      icon: Clock,
      color: "text-secondary"
    },
    {
      title: "Avg Pace",
      value: `${stats.avgPace.toFixed(1)} min/km`,
      icon: Zap,
      color: "text-accent"
    },
    {
      title: "Activities",
      value: stats.totalActivities.toString(),
      icon: Trophy,
      color: "text-orange-500"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-5 w-5 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-7 bg-muted rounded w-16 mb-1"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="bg-card/80 backdrop-blur-sm border border-border/50 hover:shadow-card transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};