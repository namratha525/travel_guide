import { useState, useEffect, useCallback } from "react";
import {
  getDestinations, createDestination, updateDestination, deleteDestination,
  getRegions, createRegion, updateRegion, deleteRegion,
  getStates, createState, updateState, deleteState,
} from "../api/api";
import {
  C, Btn, Input, Textarea, Select, Modal, Table, TR, TD, Pagination,
  SearchBar, PageHeader, Toast, ConfirmDialog, Spinner,
} from "../components";

// ─── Destinations ─────────────────────────────────────────────────────────────
export function Destinations() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      const [destData, stateData] = await Promise.all([getDestinations(params), getStates()]);
      setItems(destData.destinations);
      setTotal(destData.total);
      setPages(destData.pages);
      setStates(stateData);
    } catch (err) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const t = setTimeout(() => setPage(1), 400); return () => clearTimeout(t); }, [search]);

  async function handleSave() {
    setSaving(true);
    try {
      const fd = new FormData();
      if (form.name) fd.append("name", form.name);
      if (form.description) fd.append("description", form.description);
      if (form.stateId) fd.append("stateId", form.stateId);
      if (imageFile) fd.append("image", imageFile);
      if (modal === "add") await createDestination(fd);
      else await updateDestination(editId, fd);
      showToast(`Destination ${modal === "add" ? "created" : "updated"}`);
      setModal(null);
      load();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      await deleteDestination(deleteId);
      showToast("Destination deleted");
      setDeleteId(null);
      load();
    } catch (err) { showToast(err.message, "error"); }
  }

  return (
    <div>
      <PageHeader title={`Destinations (${total})`} action={<Btn onClick={() => { setForm({}); setEditId(null); setImageFile(null); setModal("add"); }}>+ Add Destination</Btn>} />
      <div style={{ marginBottom: 20 }}><SearchBar value={search} onChange={setSearch} placeholder="Search destinations..." /></div>

      {loading ? <Spinner /> : (
        <>
          <Table headers={["Image", "Name", "State", "Description", "Actions"]} empty={items.length === 0 ? "No destinations" : null}>
            {items.map(d => (
              <TR key={d._id}>
                <TD>
                  {d.image ? <img src={d.image} alt={d.name} style={{ width: 52, height: 40, borderRadius: 8, objectFit: "cover" }} />
                    : <div style={{ width: 52, height: 40, borderRadius: 8, background: C.border, display: "flex", alignItems: "center", justifyContent: "center" }}>🗺️</div>}
                </TD>
                <TD style={{ fontWeight: 600 }}>{d.name}</TD>
                <TD style={{ color: C.muted }}>{d.stateId?.name || "—"}</TD>
                <TD style={{ color: C.muted, fontSize: 13 }}>{d.description?.slice(0, 60)}{d.description?.length > 60 ? "..." : ""}</TD>
                <TD>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn size="sm" variant="ghost" onClick={() => { setForm({ name: d.name, description: d.description, stateId: d.stateId?._id }); setEditId(d._id); setImageFile(null); setModal("edit"); }}>Edit</Btn>
                    <Btn size="sm" variant="danger" onClick={() => setDeleteId(d._id)}>Delete</Btn>
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
          <Pagination page={page} pages={pages} onPage={setPage} />
        </>
      )}

      {modal && (
        <Modal title={modal === "add" ? "Add Destination" : "Edit Destination"} onClose={() => setModal(null)}>
          <Input label="Name" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Select label="State" value={form.stateId || ""} onChange={e => setForm({ ...form, stateId: e.target.value })}
            options={[{ value: "", label: "Select a state" }, ...states.map(s => ({ value: s._id, label: s.name }))]} />
          <Textarea label="Description" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 6 }}>IMAGE</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ color: C.text, fontSize: 13 }} />
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Btn>
          </div>
        </Modal>
      )}
      {deleteId && <ConfirmDialog msg="Delete this destination?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}

// ─── Regions ──────────────────────────────────────────────────────────────────
export function Regions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try { setItems(await getRegions()); }
    catch (err) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const fd = new FormData();
      if (form.name) fd.append("name", form.name);
      if (imageFile) fd.append("image", imageFile);
      if (modal === "add") await createRegion(fd);
      else await updateRegion(editId, fd);
      showToast(`Region ${modal === "add" ? "created" : "updated"}`);
      setModal(null); load();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      await deleteRegion(deleteId);
      showToast("Region deleted");
      setDeleteId(null); load();
    } catch (err) { showToast(err.message, "error"); }
  }

  return (
    <div>
      <PageHeader title={`Regions (${items.length})`} action={<Btn onClick={() => { setForm({}); setEditId(null); setImageFile(null); setModal("add"); }}>+ Add Region</Btn>} />

      {loading ? <Spinner /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {items.map(r => (
            <div key={r._id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
              {r.image
                ? <img src={r.image} alt={r.name} style={{ width: "100%", height: 120, objectFit: "cover" }} />
                : <div style={{ width: "100%", height: 120, background: C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🌍</div>}
              <div style={{ padding: 16 }}>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{r.name}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn size="sm" variant="ghost" style={{ flex: 1 }} onClick={() => { setForm({ name: r.name }); setEditId(r._id); setModal("edit"); }}>Edit</Btn>
                  <Btn size="sm" variant="danger" style={{ flex: 1 }} onClick={() => setDeleteId(r._id)}>Delete</Btn>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div style={{ color: C.muted, gridColumn: "span 4", textAlign: "center", padding: 40 }}>No regions yet. Add one!</div>}
        </div>
      )}

      {modal && (
        <Modal title={modal === "add" ? "Add Region" : "Edit Region"} onClose={() => setModal(null)}>
          <Input label="Region Name" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 6 }}>IMAGE</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ color: C.text, fontSize: 13 }} />
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Btn>
          </div>
        </Modal>
      )}
      {deleteId && <ConfirmDialog msg="Delete this region? (Only possible if no states are linked)" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}

// ─── States ───────────────────────────────────────────────────────────────────
export function States() {
  const [items, setItems] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const [stateData, regionData] = await Promise.all([getStates(), getRegions()]);
      setItems(stateData);
      setRegions(regionData);
    } catch (err) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const fd = new FormData();
      if (form.name) fd.append("name", form.name);
      if (form.regionId) fd.append("regionId", form.regionId);
      if (imageFile) fd.append("image", imageFile);
      if (modal === "add") await createState(fd);
      else await updateState(editId, fd);
      showToast(`State ${modal === "add" ? "created" : "updated"}`);
      setModal(null); load();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      await deleteState(deleteId);
      showToast("State deleted");
      setDeleteId(null); load();
    } catch (err) { showToast(err.message, "error"); }
  }

  return (
    <div>
      <PageHeader title={`States (${items.length})`} action={<Btn onClick={() => { setForm({}); setEditId(null); setImageFile(null); setModal("add"); }}>+ Add State</Btn>} />

      {loading ? <Spinner /> : (
        <Table headers={["Image", "Name", "Region", "Actions"]} empty={items.length === 0 ? "No states yet" : null}>
          {items.map(s => (
            <TR key={s._id}>
              <TD>
                {s.image ? <img src={s.image} alt={s.name} style={{ width: 52, height: 40, borderRadius: 8, objectFit: "cover" }} />
                  : <div style={{ width: 52, height: 40, borderRadius: 8, background: C.border, display: "flex", alignItems: "center", justifyContent: "center" }}>📍</div>}
              </TD>
              <TD style={{ fontWeight: 600 }}>{s.name}</TD>
              <TD style={{ color: C.muted }}>{s.regionId?.name || "—"}</TD>
              <TD>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn size="sm" variant="ghost" onClick={() => { setForm({ name: s.name, regionId: s.regionId?._id }); setEditId(s._id); setImageFile(null); setModal("edit"); }}>Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => setDeleteId(s._id)}>Delete</Btn>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      )}

      {modal && (
        <Modal title={modal === "add" ? "Add State" : "Edit State"} onClose={() => setModal(null)}>
          <Input label="State Name" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Select label="Region" value={form.regionId || ""} onChange={e => setForm({ ...form, regionId: e.target.value })}
            options={[{ value: "", label: "Select a region" }, ...regions.map(r => ({ value: r._id, label: r.name }))]} />
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 6 }}>IMAGE</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ color: C.text, fontSize: 13 }} />
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Btn>
          </div>
        </Modal>
      )}
      {deleteId && <ConfirmDialog msg="Delete this state? (Only possible if no destinations are linked)" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
