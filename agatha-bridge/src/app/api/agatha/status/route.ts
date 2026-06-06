import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function GET() {
  return new Promise<Response>((resolve) => {
    // Path to the Python script in agatha-brain
    const scriptPath = path.join(process.cwd(), '..', 'agatha-brain', 'get_agatha_status.py');
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

    exec(`${pythonCmd} ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return resolve(NextResponse.json({ error: 'Failed to fetch Agatha status' }, { status: 500 }));
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
        return resolve(NextResponse.json({ error: 'Failed to parse Agatha status', raw: stdout }, { status: 500 }));
      }
    });
  });
}
