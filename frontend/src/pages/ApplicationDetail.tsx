import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';

export function ApplicationDetail() {
  const { id } = useParams();
  const [app, setApp] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [prep, setPrep] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await api.get(`/applications/${id}`);
      setApp(res.data);
      setStatus(res.data.status);
    })();
  }, [id]);

  const updateStatus = async () => {
    const res = await api.post(`/applications/${id}/status`, { status, note, followUpDate });
    setApp({ ...app, status: res.data.status, statusUpdates: [res.data, ...(app.statusUpdates || [])] });
    setNote('');
    setFollowUpDate('');
  };

  const generatePrep = async () => {
    const res = await api.post(`/prep/${id}/generate`);
    setPrep(res.data);
  };

  if (!app) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-xl font-semibold">{app.title}</div>
        <div className="text-gray-600">{app.company}</div>
        <div className="mt-2 whitespace-pre-wrap">{app.description}</div>
        {app.applicationUrl && (
          <a className="text-blue-600" href={app.applicationUrl} target="_blank">Job Link</a>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="font-semibold mb-2">Status</div>
        <div className="flex items-center gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-3 py-2">
            <option value="APPLIED">Applied</option>
            <option value="PHONE_SCREEN">Phone Screen</option>
            <option value="INTERVIEWING">Interviewing</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className="border rounded px-3 py-2 flex-1" />
          <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} className="border rounded px-3 py-2" />
          <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={updateStatus}>Update</button>
        </div>

        <div className="mt-4 space-y-2">
          {(app.statusUpdates || []).map((u: any) => (
            <div key={u.id} className="text-sm">{u.status} — {u.note} {u.followUpDate ? `(${new Date(u.followUpDate).toDateString()})` : ''}</div>
          ))}
        </div>
      </div>

      {(app.status === 'PHONE_SCREEN' || app.status === 'INTERVIEWING' || app.status === 'OFFER') && (
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Interview Prep</div>
            <button className="bg-green-600 text-white px-3 py-2 rounded" onClick={generatePrep}>Generate</button>
          </div>
          {prep && (
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <div>
                <div className="font-semibold mb-2">Top 10 Questions</div>
                <ol className="list-decimal pl-4 space-y-1 text-sm">
                  {prep.questions?.map((q: string, i: number) => <li key={i}>{q}</li>)}
                </ol>
              </div>
              <div>
                <div className="font-semibold mb-2">Key Skills</div>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  {prep.skills?.map((s: any, i: number) => (<li key={i}><a className="text-blue-600" href={s.url} target="_blank">{s.name}</a></li>))}
                </ul>
              </div>
              <div>
                <div className="font-semibold mb-2">7-Day Schedule</div>
                <ol className="list-decimal pl-4 space-y-1 text-sm">
                  {prep.schedule?.map((d: any, i: number) => (<li key={i}>Day {d.day}: {d.tasks.join(', ')}</li>))}
                </ol>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

