import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Card,
  CreateUserForm,
  GamesManagementCard,
  Layout,
  MySessionsCard,
  PredictionVolumeCard,
  ResultCorrectionCard,
  ResultEntryCard,
  Section,
  Stat,
  UserTable,
  api,
  type NavItem,
  type UserSummary,
} from './shared';

const NAV: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'create', label: 'Create admin' },
  { id: 'admins', label: 'Admins' },
  { id: 'games', label: 'Games' },
  { id: 'results', label: 'Enter results' },
  { id: 'correct-results', label: 'Correct a result' },
  { id: 'volume', label: 'Prediction volume' },
  { id: 'sessions', label: 'Your sessions' },
  { id: 'scope', label: 'Scope of this role' },
  { id: 'coming-next', label: 'Coming next' },
];

export function Dashboard() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setUsers(await api.listUsers());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // The API returns Admins and nothing else for this tier, so these are
  // counts of the Admin roster rather than of the whole platform.
  const active = users.filter((u) => u.isActive).length;

  return (
    <Layout
      title="Welcome, Platform Admin"
      subtitle="Provision Admin accounts and control their status and sessions."
      nav={NAV}
    >
      {error && <Alert tone="error">{error}</Alert>}

      <Section id="overview">
        <div className="grid grid--stats">
          <Stat label="Admins" value={users.length} />
          <Stat label="Active" value={active} />
          <Stat label="Disabled" value={users.length - active} />
        </div>
      </Section>

      <Section id="create">
        <CreateUserForm allowedTypes={['ADMIN']} onCreated={() => void load()} />
      </Section>

      <Section id="admins">
        <UserTable
          title="Admins"
          desc="Every Admin account on the platform."
          users={users}
          canManage
          onChanged={() => void load()}
        />
      </Section>

      <Section id="games">
        <GamesManagementCard />
      </Section>

      <Section id="results">
        <ResultEntryCard />
      </Section>

      <Section id="correct-results">
        <ResultCorrectionCard />
      </Section>

      <Section id="volume">
        <PredictionVolumeCard />
      </Section>

      <Section id="sessions">
        <MySessionsCard />
      </Section>

      <Section id="scope">
        <Card title="Scope of this role">
          <div className="note">
            Platform Admin's sole responsibility is creating Admin accounts and handling them —
            activating, deactivating (with a full cascade preview), and controlling their sessions
            — plus defining games (schedule and leave days) and seeing platform-wide stake volume.
            Nothing else. An Admin's authority over its own Agents and Players — creating them,
            managing them, granting tokens, editing its rate card, enabling games — is intrinsic to
            being an Admin, not something Platform Admin assigns; there are no roles or permissions
            to configure here at all. Each Admin owns the agents and players it creates, and
            supervises them from its own portal — those accounts, and every individual prediction,
            deliberately aren't visible here.
          </div>
        </Card>
      </Section>

      <Section id="coming-next">
        <Card title="Coming next" desc="Not yet built — placeholders so the shape is visible.">
          <div className="note">
            Bug/support messaging.
          </div>
        </Card>
      </Section>
    </Layout>
  );
}
