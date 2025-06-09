'use client';

import { useState } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faHeadphones, faShieldAlt } from '@fortawesome/free-solid-svg-icons';



/**
 * NyxDownloader HomePage
 * Aplikasi pengunduh YouTube (MP3 / MP4) berbasis Next.js.
 * Fitur: Input URL, Fetch dari API, Tampilkan link download.
 */
export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<null | {
    title: string;
    thumbnail: string;
    duration: string;
    mp4: { quality: string; format: string; url: string }[];
    mp3: { quality: string; format: string; url: string }[];
  }>(null);

  /**
   * Submit form: fetch video data dari API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setVideoData(null);

    try {
      const res = await fetch(`/api/yt?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      setVideoData(data);
    } catch (err) {
      console.error('Gagal fetch video:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-950 to-zinc-900 text-white">
      <main className="flex-1 flex flex-col items-center px-4 pt-20 pb-10">
        <h1 className="text-4xl font-bold text-purple-400 mb-2">NyxDownloader</h1>
        <p className="text-zinc-400 mb-6 text-center max-w-xl">
          Unduh video atau audio dari YouTube secara instan tanpa iklan dan ribet.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-xl flex gap-2">
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold transition"
          >
            Download
          </button>
        </form>

        {loading && <p className="mt-6 text-zinc-400 animate-pulse">Mengambil data video...</p>}

        {videoData && (
          <div className="mt-8 w-full max-w-2xl backdrop-blur-md bg-zinc-800/60 border border-zinc-700 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <img
                src={videoData.thumbnail}
                alt="Thumbnail"
                className="w-full sm:w-60 rounded-xl"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{videoData.title}</h2>
                <p className="text-zinc-400 mb-4">Durasi: {videoData.duration}</p>

                {videoData.mp4?.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mb-2 mt-4 text-purple-400">Video (MP4)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {videoData.mp4.map((f, i) => (
                        <a
                          key={`mp4-${i}`}
                          href={f.url}
                          className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg transition"
                          download
                        >
                          <ArrowDownToLine size={18} />
                          <span>{f.format} - {f.quality}</span>
                        </a>
                      ))}
                    </div>
                  </>
                )}

                {videoData.mp3?.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mb-2 mt-6 text-green-400">Audio (MP3)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {videoData.mp3.map((f, i) => (
                        <a
                          key={`mp3-${i}`}
                          href={f.url}
                          className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg transition"
                          download
                        >
                          <ArrowDownToLine size={18} />
                          <span>{f.format} - {f.quality}</span>
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-center">
  <div>
    <FontAwesomeIcon icon={faBolt} size="2x" className="text-yellow-400 mb-2" />
    <p className="text-zinc-300">Cepat & Mudah</p>
  </div>
  <div>
    <FontAwesomeIcon icon={faHeadphones} size="2x" className="text-green-400 mb-2" />
    <p className="text-zinc-300">MP3 / MP4</p>
  </div>
  <div>
    <FontAwesomeIcon icon={faShieldAlt} size="2x" className="text-blue-400 mb-2" />
    <p className="text-zinc-300">Tanpa Iklan</p>
  </div>
</div>

      </main>

      <footer className="border-t border-zinc-800 text-center text-zinc-500 text-sm py-6">
        © 2025 Munchy. All rights reserved.
      </footer>
    </div>
  );
}
