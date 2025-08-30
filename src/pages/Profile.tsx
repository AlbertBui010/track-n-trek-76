import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { profile, loading, updateProfile, uploadAvatar } = useProfile();
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
      name: profile?.name || '',
      weight: profile?.weight?.toString() || '',
      age: profile?.age?.toString() || '',
      resting_hr: profile?.resting_hr?.toString() || '',
      goal: profile?.goal || '',
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        weight: profile.weight?.toString() || '',
        age: profile.age?.toString() || '',
        resting_hr: profile.resting_hr?.toString() || '',
        goal: profile.goal || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    const updates = {
      name: formData.name || null,
      weight: formData.weight ? parseInt(formData.weight) : null,
      age: formData.age ? parseInt(formData.age) : null,
      resting_hr: formData.resting_hr ? parseInt(formData.resting_hr) : null,
      goal: formData.goal || null,
    };

    const { error } = await updateProfile(updates);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
    }

    setUpdating(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setUploading(true);
    const { error } = await uploadAvatar(file);

    if (error) {
      toast.error('Failed to upload avatar');
    } else {
      toast.success('Avatar updated successfully');
    }

    setUploading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

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
            Profile Settings
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback>
                  {profile?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" disabled={uploading} asChild>
                    <span>
                      {uploading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4 mr-2" />
                      )}
                      Change Avatar
                    </span>
                  </Button>
                </Label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG up to 2MB
                </p>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter your age"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Enter your weight"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resting_hr">Resting Heart Rate</Label>
                  <Input
                    id="resting_hr"
                    name="resting_hr"
                    type="number"
                    value={formData.resting_hr}
                    onChange={handleInputChange}
                    placeholder="BPM"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Fitness Goal</Label>
                <Textarea
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  placeholder="Describe your fitness goals..."
                  rows={3}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={updating}
              >
                {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;