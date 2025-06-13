// pages/index.js

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの作成
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');

  const saveSnippet = async () => {
    const { data, error } = await supabase
      .from('snippets')
      .insert([{ title, content }])
      .select();

    if (error) {
      alert('保存失敗: ' + error.message);
    } else {
      setUrl(`/code/${data[0].id}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>コード保存フォーム</h1>
      <input
        type="text"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />
      <textarea
        placeholder="コード本文"
        rows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />
      <button onClick={saveSnippet}>保存</button>

      {url && (
        <p>
          ✅ 保存成功！URL: <a href={url}>{url}</a>
        </p>
      )}
    </div>
  );
}
