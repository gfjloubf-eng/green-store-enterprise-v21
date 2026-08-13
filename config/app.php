<?php

return [
    'name' => $_ENV['APP_NAME'] ?? 'Green Store',
    'env' => $_ENV['APP_ENV'] ?? 'production',
    'debug' => (bool)($_ENV['APP_DEBUG'] ?? false),
    'url' => $_ENV['APP_URL'] ?? 'http://localhost',
];
