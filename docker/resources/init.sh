#!/bin/sh
set -e
env | awk -F= '{ printf("%s=\"%s\"\n", $1, $2) }' > /etc/environment
exec /usr/bin/supervisord -ns -c /etc/supervisor/supervisord.conf