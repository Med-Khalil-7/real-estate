web: gunicorn real_estate.wsgi --chdir backend --limit-request-line 8188 --log-file -
worker: REMAP_SIGTERM=SIGQUIT  celery --workdir backend -A real_estate worker --beat --scheduler redbeat.RedBeatScheduler --loglevel=info --concurrency=2
