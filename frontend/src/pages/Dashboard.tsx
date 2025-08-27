import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

type AppItem = {
  id: string;
  title: string;
  company: string;
  status: string;
  createdAt: string;
};

export function Dashboard() {
  const [items, setItems] = useState<AppItem[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/applications', { params: { q, status } });
        setItems(res.data);
      } catch (e) {
        setItems([]);
      }
    })();
  }, [q, status]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title/company" className="border rounded px-3 py-2" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All Statuses</option>
          <option value="APPLIED">Applied</option>
          <option value="PHONE_SCREEN">Phone Screen</option>
          <option value="INTERVIEWING">Interviewing</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
          <option value="ON_HOLD">On Hold</option>
        </select>
        <Link to="#" className="ml-auto bg-blue-600 text-white px-3 py-2 rounded" onClick={(e) => { e.preventDefault(); (document.getElementById('modal-new') as HTMLDialogElement)?.showModal(); }}>Add Application</Link>
        <a className="bg-gray-200 px-3 py-2 rounded" href={`${import.meta.env.VITE_API_BASE_URL}/export/csv`} target="_blank">Export CSV</a>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it) => (
          <Link to={`/applications/${it.id}`} key={it.id} className="bg-white rounded shadow p-4 hover:shadow-md transition">
            <div className="font-semibold">{it.title}</div>
            <div className="text-sm text-gray-600">{it.company}</div>
            <div className="text-xs mt-1">Status: {it.status}</div>
          </Link>
        ))}
      </div>

      <NewApplicationModal onCreated={(app) => setItems((prev) => [app, ...prev])} />
    </div>
  );
}

function NewApplicationModal({ onCreated }: { onCreated: (a: any) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ title: '', company: '', status: 'APPLIED' });

  useEffect(() => {
    const el = document.getElementById('modal-new') as HTMLDialogElement | null;
    if (!el) return;
    const handler = () => setOpen(true);
    el.addEventListener('close', () => setOpen(false));
    el.addEventListener('cancel', () => setOpen(false));
    el.addEventListener('open', handler);
    return () => { el.removeEventListener('open', handler as any); };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/applications', form);
    onCreated(res.data);
    (document.getElementById('modal-new') as HTMLDialogElement)?.close();
  };

  return (
    <dialog id="modal-new" className="modal">
      <form method="dialog" className="bg-white p-6 rounded w-full max-w-lg" onSubmit={submit}>
        <h2 className="text-lg font-semibold mb-4">Add New Application</h2>
        <div className="grid gap-3">
          <input className="border rounded px-3 py-2" placeholder="Job Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Company Name" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <textarea className="border rounded px-3 py-2" placeholder="Job Description / Notes" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Application URL" value={form.applicationUrl || ''} onChange={(e) => setForm({ ...form, applicationUrl: e.target.value })} />
          <input type="date" className="border rounded px-3 py-2" value={form.dateApplied || ''} onChange={(e) => setForm({ ...form, dateApplied: e.target.value })} />
          <select className="border rounded px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="APPLIED">Applied</option>
            <option value="PHONE_SCREEN">Phone Screen</option>
            <option value="INTERVIEWING">Interviewing</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
        </div>
        <div className="mt-4 flex gap-2 justify-end">
          <button type="button" className="px-3 py-2" onClick={() => (document.getElementById('modal-new') as HTMLDialogElement)?.close()}>Cancel</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
        </div>
      </form>
    </dialog>
  );
}

