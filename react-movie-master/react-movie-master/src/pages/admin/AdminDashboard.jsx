import React, { useEffect, useState } from 'react';
import backendClient from '../../api/backendClient';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    tmdbId: '',
    category: 'movie',
    title: '',
    overview: '',
    posterPath: '',
    backdropPath: '',
    isFeatured: true,
  });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await backendClient.get('/movies');
    setMovies(data.movies || []);
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await backendClient.post('/movies', {
        ...form,
        tmdbId: Number(form.tmdbId),
      });
      setForm({ tmdbId: '', category: 'movie', title: '', overview: '', posterPath: '', backdropPath: '', isFeatured: true });
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Lỗi');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    await backendClient.delete(`/movies/${id}`);
    await load();
  };

  return (
    <div className="container" style={{ paddingTop: 120 }}>
      <h2>Admin Dashboard</h2>
      <p>Quản lý dữ liệu phim lưu trong DB (ví dụ: danh sách featured).</p>

      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 360px', maxWidth: 520 }}>
          <h3>Thêm phim</h3>
          <form onSubmit={onSubmit}>
            <Input placeholder="TMDB ID (ví dụ 603)" value={form.tmdbId} onChange={(e) => setForm({ ...form, tmdbId: e.target.value })} />
            <div style={{ marginTop: 12 }}>
              <label>Category:&nbsp;</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="movie">movie</option>
                <option value="tv">tv</option>
              </select>
            </div>
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Overview" value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} />
            <Input placeholder="posterPath (từ TMDB)" value={form.posterPath} onChange={(e) => setForm({ ...form, posterPath: e.target.value })} />
            <Input placeholder="backdropPath (từ TMDB)" value={form.backdropPath} onChange={(e) => setForm({ ...form, backdropPath: e.target.value })} />
            <div style={{ marginTop: 12 }}>
              <label>
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                />
                &nbsp;Featured
              </label>
            </div>

            {error && <p style={{ marginTop: 12 }}>{error}</p>}
            <div style={{ marginTop: 12 }}>
              <Button type="submit">{busy ? 'Đang lưu...' : 'Lưu'}</Button>
            </div>
          </form>
        </div>

        <div style={{ flex: '2 1 520px' }}>
          <h3>Danh sách trong DB</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {movies.map((m) => (
              <div key={m._id} style={{ padding: 12, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <strong>{m.title}</strong> <span style={{ opacity: 0.8 }}>({m.category} / TMDB {m.tmdbId})</span>
                    {m.isFeatured && <span style={{ marginLeft: 8 }}>[featured]</span>}
                    <div style={{ opacity: 0.8, marginTop: 6 }}>{m.overview}</div>
                  </div>
                  <Button onClick={() => remove(m._id)}>Xoá</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
