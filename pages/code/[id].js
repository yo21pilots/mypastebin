import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getServerSideProps(context) {
  const { id } = context.params;

  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return { notFound: true };
  }

  return {
    props: {
      snippet: data,
    },
  };
}

export default function CodePage({ snippet }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content);
    alert('コピーしました！');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{snippet.title}</h1>
      <button onClick={handleCopy} style={{ marginBottom: '1rem' }}>
        📋 コピー
      </button>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '1rem' }}>
        {snippet.content}
      </pre>
    </div>
  );
}
