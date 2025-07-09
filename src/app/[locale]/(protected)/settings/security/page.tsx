import { DeleteAccountCard } from '@/components/settings/security/delete-account-card';
import { PasswordCardWrapper } from '@/components/settings/security/password-card-wrapper';

export default function SecurityPage() {
  return (
    <div className="flex flex-col gap-8">
      <PasswordCardWrapper />
      <DeleteAccountCard />
    </div>
  );
}
