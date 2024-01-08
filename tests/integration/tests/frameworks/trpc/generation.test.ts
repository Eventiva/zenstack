import { run } from '@zenstackhq/testtools';
import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

describe('tRPC Routers Generation Tests', () => {
    let origDir: string;

    beforeAll(() => {
        origDir = process.cwd();
    });

    afterEach(() => {
        process.chdir(origDir);
    });

    // deps
    const ver = require('../../../../../package.json').version;
    const depPkgs = [
        `${path.join(__dirname, '../../../../../.build/zenstackhq-language-' + ver + '.tgz')}`,
        `${path.join(__dirname, '../../../../../.build/zenstackhq-sdk-' + ver + '.tgz')}`,
        `${path.join(__dirname, '../../../../../.build/zenstackhq-runtime-' + ver + '.tgz')}`,
        `${path.join(__dirname, '../../../../../.build/zenstackhq-trpc-' + ver + '.tgz')}`,
    ];
    const deps = depPkgs.join(' ');

    it('basic', async () => {
        const testDir = path.join(__dirname, './test-run/basic');
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
        fs.mkdirSync(testDir, { recursive: true });
        fse.copySync(path.join(__dirname, './test-project'), testDir);

        process.chdir(testDir);
        run('npm install');
        run('npm install ' + deps);
        run('npx zenstack generate --no-dependency-check --schema ./todo.zmodel', {
            NODE_PATH: 'node_modules',
        });
        run('npm run build', { NODE_PATH: 'node_modules' });
    });
});
