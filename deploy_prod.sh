#!/bin/bash
read -p "Are you sure you want to deploy on prod? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
	ng build && \
	rm -Rf deploy/ && \
	mkdir deploy && \
	cp app.yaml\ _copy_to\ _dist deploy/app.yaml && \
	cp -R dist deploy/ && \
	gcloud config set account abc@sophize.org && \
	gcloud config set project structured-data-extractor && \
	gcloud app deploy ./deploy
fi
