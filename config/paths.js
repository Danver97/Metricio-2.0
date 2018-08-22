import path from 'path';

const rootPath = process.platform === 'win32' ? process.cwd() : process.env.PWD;

const paths = {
  dashboards: path.join(rootPath, 'src/dashboards'),
  styles: path.join(rootPath, 'src/styles'),
  jobs: path.join(rootPath, 'src/jobs'),
  widgets: path.join(rootPath, 'src/widgets'),
  reactviews: path.join(rootPath, 'src/react-views'),
  reactelements: path.join(rootPath, 'src/react-elements'),
  dist: path.join(rootPath, 'dist'),
  lib: path.join(rootPath, 'lib'),
};

export default paths;
