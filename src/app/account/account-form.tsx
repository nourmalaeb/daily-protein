'use client';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import { Input } from '@/components/input';
import { Button } from '@/components/button';

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, avatar_url`)
        .eq('user_id', user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.log(error);
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from('profiles').upsert({
        user_id: user?.id as string,
        full_name: fullname,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert('Profile updated!');
    } catch (error) {
      console.log(error);
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-10 p-4">
      <h1 className="font-bold text-2xl tracking-tight">Manage your account</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <Input id="email" type="text" value={user?.email} disabled />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="fullName">Full Name</label>
          <Input
            id="fullName"
            type="text"
            value={fullname || ''}
            onChange={e => setFullname(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="username">Username</label>
          <Input
            id="username"
            type="text"
            value={username || ''}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div>
          <Button
            onClick={() => updateProfile({ fullname, username, avatar_url })}
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update'}
          </Button>
        </div>
      </form>

      <div>
        <form action="/signout" method="post">
          <Button type="submit">Sign out</Button>
        </form>
      </div>
    </div>
  );
}
