import log from 'electron-log';

const logFormat = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}';

// Console transport configuration
log.transports.console.format = logFormat;

// File transport configuration
log.transports.file.format = logFormat;
log.transports.file.level = 'debug';
