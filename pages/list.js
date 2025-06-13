import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { useRouter } from 'next/router';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getServerSideProps(context) {
  const author = context.query.author || null;

  let query = supabase
    .from('snippets')
    .select('id, title, author')
    .order('created_at', { ascending: false });

  if (author) {
    query = query.eq('author', author);
  }

  const { data, error } = await query;

  return {
    props: {
      snippets: data || [],
      selectedAuthor: author,
    },
  };
}

export default function ListPage({ snippets, selectedAuthor }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const router = useRouter();

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(snippets.map((s) => s.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert('削除する項目が選択されていません');
      return;
    }

    const confirmed = window.confirm('選択した項目をすべて削除しますか？');
    if (!confirmed) return;

    const { error } = await supabase
      .from('snippets')
      .delete()
      .in('id', selectedIds);

    if (error) {
      alert('削除に失敗しました');
    } else {
      alert('削除しました');
      location.reload();
    }
  };

  const handleAuthorChange = (e) => {
    const author = e.target.value;
    router.push(author ? `/list?author=${author}` : '/list');
  };

  const displayName = (author) => {
    return author === 'yo' ? 'y' : author === 'kanako' ? 'k' : author;
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>コード一覧</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          投稿者で絞り込み:{' '}
          <select value={selectedAuthor || ''} onChange={handleAuthorChange}>
            <option value="">すべて</option>
            <option value="yo">y</option>
            <option value="kanako">k</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={selectAll} style={{ marginRight: '0.5rem' }}>
          ✅ 全選択
        </button>
        <button onClick={clearAll} style={{ marginRight: '0.5rem' }}>
          ❌ 全解除
        </button>
        <button
          onClick={handleBulkDelete}
          style={{
            background: '#ff4d4f',
            color: 'white',
            border: 'none',
            padding: '0.4rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🗑 選択した項目を削除
        </button>
      </div>

      <ul>
        {snippets.map((s) => (
          <li key={s.id} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={selectedIds.includes(s.id)}
              onChange={() => toggleSelect(s.id)}
              style={{ marginRight: '0.5rem' }}
            />
            <a href={`/code/${s.id}`} target="_blank" rel="noopener noreferrer" style={{ marginRight: '1rem' }}>
              {s.title || '(無題)'} → /code/{s.id}
            </a>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>({displayName(s.author)})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
