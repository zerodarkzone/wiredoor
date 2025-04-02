import child from 'child_process';

export default class CLI {
  static async exec(cmd: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      child.exec(
        cmd,
        {
          shell: 'bash',
        },
        (err, stdout, stderr) => {
          if (err) return reject(err);
          return resolve({
            stdout: String(stdout).trim(),
            stderr: String(stderr).trim(),
          });
        },
      );
    });
  }
}
