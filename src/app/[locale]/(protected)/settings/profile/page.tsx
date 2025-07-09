import { UpdateAvatarCard } from '@/components/settings/profile/update-avatar-card';
import { UpdateNameCard } from '@/components/settings/profile/update-name-card';

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      <UpdateAvatarCard />
      <UpdateNameCard />
    </div>
  );
}
