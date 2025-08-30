import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivities } from '@/hooks/useActivities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const CreateActivity = () => {
  const navigate = useNavigate();
  const { createActivity, uploadGPX } = useActivities();
  const [loading, setLoading] = useState(false);
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activity_type: 'running',
    distance: '',
    duration: '',
    pace: '',
    elevation_gain: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGPXUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.gpx')) {
      toast.error('Please select a valid GPX file');
      return;
    }

    setGpxFile(file);
    
    // Auto-fill activity title from filename
    if (!formData.title) {
      const filename = file.name.replace('.gpx', '');
      setFormData(prev => ({
        ...prev,
        title: filename,
      }));
    }

    // Parse GPX file to extract data
    try {
      const gpxContent = await file.text();
      
      const { data, error } = await supabase.functions.invoke('parse-gpx', {
        body: { gpxContent },
      });

      if (error) throw error;

      // Auto-fill form with parsed data
      setFormData(prev => ({
        ...prev,
        distance: data.distance?.toString() || '',
        duration: data.duration?.toString() || '',
        pace: data.pace?.toString() || '',
        elevation_gain: data.elevationGain?.toString() || '',
      }));

      toast.success('GPX file parsed successfully');
    } catch (error) {
      console.error('Error parsing GPX:', error);
      toast.error('Failed to parse GPX file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let gpxUrl = null;

      // Upload GPX file if provided
      if (gpxFile) {
        const { data: uploadData, error: uploadError } = await uploadGPX(gpxFile);
        if (uploadError) throw uploadError;
        gpxUrl = uploadData;
      }

      // Create activity
      const activityData = {
        title: formData.title,
        description: formData.description || null,
        activity_type: formData.activity_type,
        gpx_url: gpxUrl,
        distance: formData.distance ? parseFloat(formData.distance) : null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        pace: formData.pace ? parseFloat(formData.pace) : null,
        elevation_gain: formData.elevation_gain ? parseFloat(formData.elevation_gain) : null,
      };

      const { data, error } = await createActivity(activityData);

      if (error) throw error;

      toast.success('Activity created successfully');
      navigate(`/activities/${data.id}`);
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Add New Activity
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Activity Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* GPX Upload */}
              <div className="space-y-2">
                <Label htmlFor="gpx-upload">GPX File (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Label htmlFor="gpx-upload" className="cursor-pointer flex-1">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {gpxFile ? gpxFile.name : 'Click to upload GPX file or drag and drop'}
                      </p>
                    </div>
                  </Label>
                  <input
                    id="gpx-upload"
                    type="file"
                    accept=".gpx"
                    className="hidden"
                    onChange={handleGPXUpload}
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Morning Run"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity_type">Activity Type</Label>
                  <Select
                    value={formData.activity_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, activity_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="cycling">Cycling</SelectItem>
                      <SelectItem value="walking">Walking</SelectItem>
                      <SelectItem value="hiking">Hiking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us about your activity..."
                  rows={3}
                />
              </div>

              {/* Activity Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    name="distance"
                    type="number"
                    step="0.01"
                    value={formData.distance}
                    onChange={handleInputChange}
                    placeholder="5.2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="1800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pace">Pace (min/km)</Label>
                  <Input
                    id="pace"
                    name="pace"
                    type="number"
                    step="0.01"
                    value={formData.pace}
                    onChange={handleInputChange}
                    placeholder="5.45"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="elevation_gain">Elevation Gain (m)</Label>
                  <Input
                    id="elevation_gain"
                    name="elevation_gain"
                    type="number"
                    step="0.01"
                    value={formData.elevation_gain}
                    onChange={handleInputChange}
                    placeholder="120"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !formData.title}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Activity
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateActivity;