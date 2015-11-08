import express from 'express';
import app from '../app/server';

const env = process.env;
const host = env.npm_package_config_appServerHost;
const port = env.npm_package_config_appServerPort;

let router = express();
router.use(app);

let server = router.listen(port, host);

export default server;