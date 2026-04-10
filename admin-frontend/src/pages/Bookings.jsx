import { useState, useEffect, useCallback } from "react";
import { getBookings, updateBookingStatus, deleteBooking } from "../api/api";
import {
  C, Btn, Select, Modal, Table, TR, TD, Badge, Pagination,
  SearchBar, PageHeader, Avatar, Toast, ConfirmDialog, Spinner,
} from "../components";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewBooking, setViewBooking] = useState(null);
  const [editId, setEditId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.paymentStatus = statusFilter;
      const data = await getBookings(params);
      setBookings(data.bookings);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const t = setTimeout(() => setPage(1), 400); return () => clearTimeout(t); }, [search]);

  async function handleStatusUpdate() {
    try {
      await updateBookingStatus(editId, newStatus);
      showToast("Booking status updated");
      setEditId(null);
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleDelete() {
    try {
      await deleteBooking(deleteId);
      showToast("Booking deleted");
      setDeleteId(null);
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <div>
      <PageHeader title={`Bookings (${total})`} />

      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by user name..." />
        {["", "pending", "paid", "failed", "refunded"].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{
            padding: "8px 16px", borderRadius: 8, border: `1px solid ${statusFilter === s ? C.accent : C.border}`,
            background: statusFilter === s ? C.accent + "20" : "transparent",
            color: statusFilter === s ? C.accent : C.muted, cursor: "pointer", fontSize: 13,
          }}>{s || "All"}</button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <>
          <Table headers={["User", "Package", "Days", "Hotel", "Transport", "Guide", "Travel Date", "Amount", "Status", "Actions"]}
            empty={bookings.length === 0 ? "No bookings found" : null}>
            {bookings.map(b => (
              <TR key={b._id}>
                <TD>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar src={b.userId?.avatar} name={b.userId?.name} size={32} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{b.userId?.name || "Unknown"}</div>
                      <div style={{ color: C.muted, fontSize: 12 }}>{b.userId?.email}</div>
                    </div>
                  </div>
                </TD>
                <TD style={{ color: C.muted, fontSize: 13 }}>{b.packageId || "—"}</TD>
                <TD style={{ color: C.muted }}>{b.days || "—"}</TD>
                <TD style={{ color: C.muted, fontSize: 12 }}>{b.hotel || "—"}</TD>
                <TD style={{ color: C.muted, fontSize: 12 }}>{b.transport || "—"}</TD>
                <TD><Badge status={b.needGuide ? "active" : "inactive"} /></TD>
                <TD style={{ color: C.muted, fontSize: 12 }}>{b.travelDate ? new Date(b.travelDate).toLocaleDateString() : "—"}</TD>
                <TD style={{ color: C.success, fontWeight: 700 }}>₹{b.totalPrice?.toLocaleString()}</TD>
                <TD><Badge status={b.paymentStatus} /></TD>
                <TD>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn size="sm" variant="ghost" onClick={() => { setEditId(b._id); setNewStatus(b.paymentStatus); }}>Update</Btn>
                    <Btn size="sm" variant="danger" onClick={() => setDeleteId(b._id)}>Delete</Btn>
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
          <Pagination page={page} pages={pages} onPage={setPage} />
        </>
      )}

      {/* Update Status Modal */}
      {editId && (
        <Modal title="Update Payment Status" onClose={() => setEditId(null)}>
          <Select label="Payment Status" value={newStatus} onChange={e => setNewStatus(e.target.value)}
            options={["pending", "paid", "failed", "refunded"].map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} />
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setEditId(null)}>Cancel</Btn>
            <Btn onClick={handleStatusUpdate}>Save</Btn>
          </div>
        </Modal>
      )}

      {deleteId && <ConfirmDialog msg="Delete this booking permanently?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
