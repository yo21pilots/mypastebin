import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [savedUrl, setSavedUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.from('snippets').insert([
      { title, content, author }
    ]).select().single();

    if (error) {
      alert('保存に失敗しました');
      return;
    }

    setSavedUrl(`/code/${data.id}`);
    setTitle('');
    setContent('');
    setAuthor('');
  };

  return (
    <div style={{
      padding: '1rem',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>MyPasteBin</h1>
        <Link href="/list" passHref>
          <button
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.9rem',
              background: '#eaeaea',
              color: '#333',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            一覧を見る
          </button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <select
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            fontSize: '1rem'
          }}
        >
          <option value="">投稿者を選択</option>
          <option value="yo">y</option>
          <option value="kanako">k</option>
        </select>

        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            fontSize: '1rem'
          }}
        />

        <textarea
          placeholder="本文"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            fontSize: '1rem'
          }}
        />

        <button
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#005dc1'}
          onMouseOut={(e) => e.currentTarget.style.background = '#0070f3'}
        >
          保存
        </button>
      </form>

      {savedUrl && (
        <p style={{ marginTop: '1rem' }}>
          ✅ 保存完了！URL:{' '}
          <a
            href={savedUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0070f3', textDecoration: 'underline' }}
          >
            {savedUrl}
          </a>
        </p>
      )}
    </div>
  );
}
