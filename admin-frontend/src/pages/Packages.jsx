import { useState, useEffect, useCallback } from "react";
import { getPackages, createPackage, updatePackage, deletePackage } from "../api/api";
import {
  C, Btn, Input, Textarea, Modal, Table, TR, TD, Pagination,
  SearchBar, PageHeader, Toast, ConfirmDialog, Spinner,
} from "../components";

const EMPTY_FORM = { title: "", city: "", state: "", days: "", nights: "", price: "", description: "" };

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | "edit"
  const [form, setForm] = useState(EMPTY_FORM);
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
      const data = await getPackages(params);
      setPackages(data.packages);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const t = setTimeout(() => setPage(1), 400); return () => clearTimeout(t); }, [search]);

  function openAdd() { setForm(EMPTY_FORM); setImageFile(null); setEditId(null); setModal("add"); }
  function openEdit(pkg) {
    setForm({ title: pkg.title, city: pkg.city, state: pkg.state, days: pkg.days, nights: pkg.nights, price: pkg.price, description: pkg.description });
    setEditId(pkg._id); setImageFile(null); setModal("edit");
  }

  async function handleSave() {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== "") fd.append(k, v); });
      if (imageFile) fd.append("image", imageFile);
      if (modal === "add") await createPackage(fd);
      else await updatePackage(editId, fd);
      showToast(`Package ${modal === "add" ? "created" : "updated"}`);
      setModal(null);
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await deletePackage(deleteId);
      showToast("Package deleted");
      setDeleteId(null);
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  const f = (k) => ({ value: form[k] || "", onChange: e => setForm({ ...form, [k]: e.target.value }) });

  return (
    <div>
      <PageHeader title={`Packages (${total})`} action={<Btn onClick={openAdd}>+ Add Package</Btn>} />

      <div style={{ marginBottom: 20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search title, city, state..." />
      </div>

      {loading ? <Spinner /> : (
        <>
          <Table headers={["Image", "Title", "City", "State", "Days/Nights", "Price", "Actions"]}
            empty={packages.length === 0 ? "No packages found" : null}>
            {packages.map(p => (
              <TR key={p._id}>
                <TD>
                  {p.image
                    ? <img src={p.image} alt={p.title} style={{ width: 52, height: 40, borderRadius: 8, objectFit: "cover" }} />
                    : <div style={{ width: 52, height: 40, borderRadius: 8, background: C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📦</div>}
                </TD>
                <TD style={{ fontWeight: 600 }}>{p.title}</TD>
                <TD style={{ color: C.muted }}>{p.city}</TD>
                <TD style={{ color: C.muted }}>{p.state}</TD>
                <TD style={{ color: C.muted }}>{p.days}D / {p.nights}N</TD>
                <TD style={{ color: C.success, fontWeight: 700 }}>₹{p.price?.toLocaleString()}</TD>
                <TD>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn size="sm" variant="ghost" onClick={() => openEdit(p)}>Edit</Btn>
                    <Btn size="sm" variant="danger" onClick={() => setDeleteId(p._id)}>Delete</Btn>
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
          <Pagination page={page} pages={pages} onPage={setPage} />
        </>
      )}

      {modal && (
        <Modal title={modal === "add" ? "Add Package" : "Edit Package"} onClose={() => setModal(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Title" {...f("title")} style={{ gridColumn: "span 2" }} />
            <Input label="City" {...f("city")} />
            <Input label="State" {...f("state")} />
            <Input label="Days" type="number" {...f("days")} />
            <Input label="Nights" type="number" {...f("nights")} />
            <Input label="Price (₹)" type="number" {...f("price")} style={{ gridColumn: "span 2" }} />
          </div>
          <Textarea label="Description" {...f("description")} />
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 6, letterSpacing: .5 }}>PACKAGE IMAGE</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
              style={{ color: C.text, fontSize: 13 }} />
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Btn>
          </div>
        </Modal>
      )}

      {deleteId && <ConfirmDialog msg="Delete this package permanently?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
