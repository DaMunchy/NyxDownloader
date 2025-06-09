import { NextRequest, NextResponse } from 'next/server'; 
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Define format type
type Format = {
  url: string;
  ext: string;
  vcodec: string;
  acodec: string;
  format_note?: string;
  height?: number;
  abr?: number;
};

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'URL kosong' }, { status: 400 });
  }

  try {
    const command = `yt-dlp --dump-json "${url}"`;
    const { stdout } = await execAsync(command, { timeout: 60000 });

    const info = JSON.parse(stdout) as {
      title: string;
      thumbnail: string;
      duration: number;
      formats: Format[];
    };

    const mp4Formats = (info.formats || [])
      .filter((f) => f.ext === 'mp4' && f.vcodec !== 'none' && f.acodec !== 'none')
      .map((f) => ({
        url: f.url,
        quality: f.format_note || `${f.height}p`,
        format: 'mp4',
      }));

    const audioFormats = (info.formats || [])
      .filter((f) => f.vcodec === 'none' && f.acodec !== 'none')
      .map((f) => ({
        url: f.url,
        quality: f.abr ? `${f.abr} kbps` : 'audio',
        format: 'mp3',
      }));

    return NextResponse.json({
      title: info.title,
      thumbnail: info.thumbnail,
      duration: `${Math.floor(info.duration / 60)}:${String(info.duration % 60).padStart(2, '0')}`,
      mp4: mp4Formats,
      mp3: audioFormats,
    });
  } catch (err) {
    console.error('[yt-dlp error]', err);
    return NextResponse.json({ error: 'Gagal fetch info video' }, { status: 500 });
  }
}
