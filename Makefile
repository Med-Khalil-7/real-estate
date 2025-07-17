SHELL := /bin/bash # Use bash syntax
ARG := $(word 2, $(MAKECMDGOALS) )

clean:
	@find . -name "*.pyc" -exec rm -rf {} \;
	@find . -name "__pycache__" -delete

test:
	python backend/manage.py test backend/ $(ARG) --parallel --keepdb

test_reset:
	python backend/manage.py test backend/ $(ARG) --parallel

backend_format:
	black backend

upgrade: ## update the *requirements.txt files with the latest packages satisfying *requirements.in
	pip install -U -q pip-tools
	pip-compile --upgrade -o dev-requirements.txt dev-requirements.in
	pip-compile --upgrade -o requirements.txt requirements.in
	# Make everything =>, not ==
	sed 's/==/>=/g' requirements.txt > requirements.tmp
	mv requirements.tmp requirements.txt

compile_install_requirements:
	@echo 'Installing pip-tools...'
	export PIP_REQUIRE_VIRTUALENV=true; \
	pip install pip-tools
	@echo 'Compiling requirements...'
	pip-compile requirements.in > requirements.txt
	pip-compile dev-requirements.in > dev-requirements.txt
	@echo 'Installing requirements...'
	pip install -r requirements.txt && pip install -r dev-requirements.txt


# Commands for Docker version
dc_setup:
	docker volume create real_estate_dbdata
	docker-compose build --no-cache backend
	docker-compose run frontend npm install

dc_test:
	docker-compose run backend python manage.py test $(ARG) --parallel --keepdb

dc_test_reset:
	docker-compose run backend python manage.py test $(ARG) --parallel

dc_up:
	docker-compose up -d

dc_up_app:
	docker-compose up -d db broker frontend backend celery beat mailhog

dc_up_superset:
	docker-compose up -d superset_redis superset_pg superset superset-init superset-worker superset-worker-beat

dc_update_dependencies:
	docker-compose down
	docker-compose up -d --build frontend backend celery beat

dc_down:
	docker-compose down

dc_logs:
	docker-compose logs -f $(ARG)

dc_reset_db:
	docker-compose run --rm backend python manage.py reset_db --noinput

dc_startapp:
	docker-compose run --rm backend python manage.py startapp $(ARG)

dc_show_migrations:
	docker-compose run --rm backend python manage.py showmigrations
	
dc_makemigrations:
	docker-compose run --rm backend python manage.py makemigrations

dc_migrate:
	docker-compose run --rm backend python manage.py migrate

dc_create_superuser:
	docker-compose run --rm backend python manage.py createsuperuser

dc_shell:
	docker-compose run --rm backend python manage.py shell

dc_init_db:
	 docker-compose run --rm backend python manage.py loaddata fixtures/init.yaml