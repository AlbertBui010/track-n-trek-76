import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Button } from '@/components/ui/button';
import { useActivities } from '@/hooks/useActivities';
import { format, startOfWeek, startOfMonth, startOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';

type TimeRange = 'week' | 'month' | 'year';

export const ActivityChart = () => {
  const { activities, loading } = useActivities();
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const chartData = React.useMemo(() => {
    if (!activities.length) return [];

    const now = new Date();
    let startDate: Date;
    let intervals: Date[];
    let formatString: string;

    switch (timeRange) {
      case 'week':
        startDate = startOfWeek(now);
        intervals = eachDayOfInterval({ start: startDate, end: now });
        formatString = 'EEE';
        break;
      case 'month':
        startDate = startOfMonth(now);
        intervals = eachDayOfInterval({ start: startDate, end: now });
        formatString = 'MMM dd';
        break;
      case 'year':
        startDate = startOfYear(now);
        intervals = eachMonthOfInterval({ start: startDate, end: now });
        formatString = 'MMM';
        break;
    }

    return intervals.map(date => {
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.created_at);
        if (timeRange === 'year') {
          return activityDate.getMonth() === date.getMonth() && 
                 activityDate.getFullYear() === date.getFullYear();
        } else {
          return activityDate.toDateString() === date.toDateString();
        }
      });

      const totalDistance = dayActivities.reduce((sum, activity) => sum + (activity.distance || 0), 0);
      const totalTime = dayActivities.reduce((sum, activity) => sum + (activity.duration || 0), 0);

      return {
        date: format(date, formatString),
        distance: totalDistance,
        time: totalTime / 3600, // Convert to hours
      };
    });
  }, [activities, timeRange]);

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse bg-muted rounded w-full h-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={timeRange === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('week')}
        >
          Week
        </Button>
        <Button
          variant={timeRange === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('month')}
        >
          Month
        </Button>
        <Button
          variant={timeRange === 'year' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('year')}
        >
          Year
        </Button>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-muted-foreground text-sm"
            />
            <YAxis className="text-muted-foreground text-sm" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Line 
              type="monotone" 
              dataKey="distance" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              name="Distance (km)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};