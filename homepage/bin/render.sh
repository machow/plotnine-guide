#!/usr/bin/env bash

# Compile Tailwind CSS
npx @tailwindcss/cli -i ./homepage/input.css -o ./homepage/homepage.min.css --minify

# Banner
uv run jinja2 homepage/banner/template.jinja homepage/banner/items.yaml > homepage/banner/output.html

# Features
uv run jinja2 homepage/features/template.jinja homepage/features/items.yaml > homepage/features/output.html

# Process Python code chunks for features
for file in homepage/features/code/*.py; do
    echo Processing $file...;

    cat $file | sed 's/#skip//g' | uv run pygmentize -f html -l python | sed 's|"err">!!!</span>|"tw:opacity-50">|g;s|<span class="err">???||g;' > homepage/features/html/$(basename $file).html
done