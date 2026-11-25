import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nim: "", nama: "", alamat: "", tgl_lahir: "", jurusan: "" });
  const [editNim, setEditNim] = useState(null);

  const loadData = async () => {
    const res = await fetch("http://localhost:5000/api/mahasiswa");
    const data = await res.json();
    setMahasiswa(data);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editNim
      ? `http://localhost:5000/api/mahasiswa/${editNim}`
      : "http://localhost:5000/api/mahasiswa";
    const method = editNim ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ nim: "", nama: "", alamat: "", tgl_lahir: "", jurusan: "" });
      setEditNim(null);
      loadData();
    } else {
      alert("Gagal simpan! Cek semua field sudah diisi");
    }
  };

  const handleEdit = (mhs) => {
    setForm({ nim: mhs.nim, nama: mhs.nama, alamat: mhs.alamat, tgl_lahir: mhs.tgl_lahir ? mhs.tgl_lahir.slice(0,10) : "", jurusan: mhs.jurusan });
    setEditNim(mhs.nim);
  };

  const handleDelete = async (nim) => {
    if (!confirm("Yakin hapus?")) return;
    await fetch(`http://localhost:5000/api/mahasiswa/${nim}`, { method: "DELETE" });
    loadData();
  };

  const filtered = mahasiswa.filter((m) =>
    (m.nama + m.nim).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Data Mahasiswa</h1>
      <input className="search" placeholder="Cari nama / NIM..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <form onSubmit={handleSubmit} className="form">
        <input placeholder="NIM" value={form.nim} onChange={(e) => setForm({...form, nim: e.target.value})} required />
        <input placeholder="Nama" value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} required />
        <input placeholder="Alamat" value={form.alamat} onChange={(e) => setForm({...form, alamat: e.target.value})} required />
        <input type="date" value={form.tgl_lahir} onChange={(e) => setForm({...form, tgl_lahir: e.target.value})} required />
        <input placeholder="Jurusan" value={form.jurusan} onChange={(e) => setForm({...form, jurusan: e.target.value})} required />
        <button type="submit">{editNim ? "Update" : "Tambah"}</button>
      </form>
      <table>
        <thead><tr><th>NIM</th><th>Nama</th><th>Alamat</th><th>Tgl Lahir</th><th>Jurusan</th><th>Aksi</th></tr></thead>
        <tbody>
          {filtered.map((mhs) => (
            <tr key={mhs.nim}>
              <td>{mhs.nim}</td><td>{mhs.nama}</td><td>{mhs.alamat}</td>
              <td>{mhs.tgl_lahir ? mhs.tgl_lahir.slice(0,10) : ""}</td><td>{mhs.jurusan}</td>
              <td><button onClick={() => handleEdit(mhs)}>Edit</button> <button onClick={() => handleDelete(mhs.nim)}>Hapus</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default App;