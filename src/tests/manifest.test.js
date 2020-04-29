import fs from 'fs';
import path from 'path';
import YAML from 'yamljs';

describe('NetlifyChromiumPlugin manifest', () => {

  let manifest;

  beforeAll(() => {
    manifest = YAML.parse(fs.readFileSync(path.join(__dirname, '../manifest.yml')).toString());
  });

  it('exists', () => {
    expect(manifest).toBeDefined();
  });

  it('did not change', () => {
    expect(manifest).toMatchSnapshot();
  });

});
