// Course version (lesson 10) — becomes the full RailPass version in lesson 17.
import { EmptyState } from '../../../shared/ui/empty-state';
import { PageHeader } from '../../../shared/ui/page-header';

export function ExtrasView() {
  return (
    <>
      <PageHeader title="Extras & fares" description="Add-on editing follows the add-a-feature playbook in lesson 17." />
      <EmptyState title="Feature slot reserved" description="Queries and route APIs exist now; the editable extras table arrives later." />
    </>
  );
}
