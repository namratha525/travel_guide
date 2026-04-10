import { useState, useEffect, useCallback } from "react";
import { getSubscribers, deleteSubscriber } from "../api/api";
import {
  C, Btn, Table, TR, TD, Pagination, SearchBar,
  PageHeader, Toast, ConfirmDialog, Spinner,
} from "../components";

export default function Newsletter() {
  const [subs, setSubs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      const data = await getSubscribers(params);
      setSubs(data.subscribers);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const t = setTimeout(() => setPage(1), 400); return () => clearTimeout(t); }, [search]);

  async function handleDelete() {
    try {
      await deleteSubscriber(deleteId);
      showToast("Subscriber removed");
      setDeleteId(null);
      load();
    } catch (err) { showToast(err.message, "error"); }
  }

  return (
    <div>
      <PageHeader title={`Newsletter Subscribers (${total})`} />

      <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "center" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search email..." />
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", color: C.muted, fontSize: 13 }}>
          📧 {total} total subscribers
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
          <Table headers={["#", "Email", "Subscribed On", "Actions"]} empty={subs.length === 0 ? "No subscribers yet" : null}>
            {subs.map((s, i) => (
              <TR key={s._id}>
                <TD style={{ color: C.muted, fontSize: 13 }}>{(page - 1) * 15 + i + 1}</TD>
                <TD style={{ fontWeight: 500 }}>{s.email}</TD>
                <TD style={{ color: C.muted }}>{new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</TD>
                <TD>
                  <Btn size="sm" variant="danger" onClick={() => setDeleteId(s._id)}>Remove</Btn>
                </TD>
              </TR>
            ))}
          </Table>
          <Pagination page={page} pages={pages} onPage={setPage} />
        </>
      )}

      {deleteId && <ConfirmDialog msg="Remove this subscriber from the newsletter list?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
