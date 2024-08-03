"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export default function ChatPage() {
  const [models, setModels] = useState([{name:'models/gemini-1.5-flash'}, {name:'models/gemini-1.5-pro'}, {name:'models/gemini-1.0-pro'}]);
  const [selectedModel, setSelectedModel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get('/api/models')
      .then(response => {
        setModels(prev => [...prev, ...response.data.models]);
        setSelectedModel('gemini-1.5-flash');
      })
      .catch(error => console.error('Error fetching models:', error));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const newHistory = [...history, { role: 'user', parts: [{ text: prompt }] }];
    setPrompt('');

    try {
      const result = await axios.post('/api/response', {
        model: selectedModel,
        prompt,
        history: newHistory
      });

      setHistory([...newHistory, { role: 'model', parts: [{ text: result.data.response }] }]);
    } catch (error) {
      console.error('Error fetching response:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderers = {
    code({ node, inline, className, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="relative text-sm">
          <button
            className="absolute top-2 right-2 bg-blue-500 text-white py-1 px-2 rounded"
            onClick={() => navigator.clipboard.writeText(String(props.children))}
          >
            Copy
          </button>
          <SyntaxHighlighter
            style={dracula}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(props.children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className={className} {...props}>
          {props.children}
        </code>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-2">
      <div className="w-full max-w-2xl bg-white py-6 px-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold">Gemini Chat</h1>
        <Link href="/setup" className="text-blue-500 hover:underline">
          Setup API Key
        </Link>
        <div className="mb-4 mt-3">
          <label className="block text-gray-700 mb-2">Select Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="" disabled>Select a model</option>
            {models.map(model => {
              const modelId = model.name.replace('models/', '');
              return (
                <option key={modelId} value={modelId}>
                  {modelId}
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter your prompt here"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full p-2 rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading ? 'Loading...' : 'Send'}
        </button>
        <div className="mt-6 text-sm">
          <h2 className="text-xl font-semibold mb-2">Response</h2>
          <div className="p-4 bg-gray-100 rounded-md">
            {[...history].reverse().map((entry, index) => (
              <div key={index} className={`mb-4 p-2 rounded-md ${entry.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
                <ReactMarkdown
                  className='text-base'
                  remarkPlugins={[remarkGfm]}
                  components={renderers}
                >
                  {entry.parts[0].text}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}