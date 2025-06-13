import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('snippets').insert([
      { title, content }
    ]).select().single();

    if (error) {
      alert('保存に失敗しました');
      return;
    }

    router.push(`/code/${data.id}`);
  };

  return (
    <div style={{
      padding: '1rem',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>コード保存</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="タイトル（任意）"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
        <textarea
          placeholder="本文（コード）"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
        <button style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}>
          保存
        </button>
      </form>
    </div>
  );
}
