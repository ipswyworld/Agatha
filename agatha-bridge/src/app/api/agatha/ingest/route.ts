import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { title, content, tags } = await request.json();
    if (!content) {
      return NextResponse.json({ error: 'Content parameter is required' }, { status: 400 });
    }

    return new Promise<Response>((resolve) => {
      // Path to ingest_service.py
      const scriptPath = path.join(process.cwd(), '..', 'agatha-brain', 'knowledge', 'ingest_service.py');
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      
      const payload = {
        content: `${title ? title + ': ' : ''}${content}`,
        metadata: {
          timestamp: new Date().toISOString(),
          tags: tags || []
        }
      };
      
      // Pass the payload as a JSON string argument to Python safely
      const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
      
      // We wrap the payload in a base64 string and decode inside python if needed to be bulletproof.
      // But since we want to run ingest_service.py --json, we can decode it on python's end.
      // Let's modify ingest_service.py slightly to handle base64 JSON payload too if needed, or pass it directly.
      // Passing it as base64 is extremely safe on Windows shells.
      // Let's pass it via stdin to be 100% robust and avoid argument length limit or encoding issues.
      const child = exec(`"${pythonCmd}" "${scriptPath}" --json`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}, stderr: ${stderr}`);
          return resolve(NextResponse.json({ error: 'Failed to run ingest script', details: stderr }, { status: 500 }));
        }
        
        try {
          const startIndex = stdout.indexOf('{');
          const endIndex = stdout.lastIndexOf('}') + 1;
          if (startIndex === -1 || endIndex === 0) {
            throw new Error('No JSON object found in output');
          }
          const jsonStr = stdout.substring(startIndex, endIndex);
          const data = JSON.parse(jsonStr);
          return resolve(NextResponse.json(data));
        } catch (parseError) {
          console.error(`Parse error: ${parseError}, stdout: ${stdout}`);
          return resolve(NextResponse.json({ error: 'Failed to parse ingest output', raw: stdout }, { status: 500 }));
        }
      });

      // Write base64 json payload into process stdin
      if (child.stdin) {
        child.stdin.write(JSON.stringify(payload));
        child.stdin.end();
      }
    });
  } catch (err) {
    console.error('Ingestion API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
