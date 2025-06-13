import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getServerSideProps() {
  const { data, error } = await supabase
    .from('snippets')
    .select('id, title')
    .order('created_at', { ascending: false });

  return {
    props: {
      snippets: data || [],
    },
  };
}

export default function ListPage({ snippets }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>コード一覧</h1>
      <ul>
        {snippets.map((s) => (
          <li key={s.id} style={{ marginBottom: '1rem' }}>
		<a href={`/code/${s.id}`} target="_blank" rel="noopener noreferrer">
			{s.title || '(無題)'} → /code/{s.id}
		</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
