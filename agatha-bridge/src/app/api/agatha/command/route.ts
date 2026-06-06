import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { command } = await request.json();
    if (!command) {
      return NextResponse.json({ error: 'Command parameter is required' }, { status: 400 });
    }

    return new Promise<Response>((resolve) => {
      // Path to run_command.py
      const scriptPath = path.join(process.cwd(), '..', 'agatha-brain', 'run_command.py');
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      
      // Base64 encode the command string to be 100% shell-safe on Windows
      const commandBase64 = Buffer.from(command).toString('base64');
      
      exec(`"${pythonCmd}" "${scriptPath}" --base64 "${commandBase64}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}, stderr: ${stderr}`);
          return resolve(NextResponse.json({ error: 'Failed to run command script', details: stderr }, { status: 500 }));
        }
        
        try {
          // Robust JSON extraction to ignore python package warnings (e.g. RequestsDependencyWarning)
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
          return resolve(NextResponse.json({ error: 'Failed to parse command output', raw: stdout }, { status: 500 }));
        }
      });
    });
  } catch (err) {
    console.error('Command API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
