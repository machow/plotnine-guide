#!/usr/bin/env bash

# Compile Tailwind CSS
npx @tailwindcss/cli -i ./homepage/input.css -o ./homepage/homepage.min.css --minify

# Render banner
uv run jinja2 homepage/banner/template.jinja homepage/banner/items.yaml > homepage/banner/output.html

# Render features
uv run jinja2 homepage/features/template.jinja homepage/features/items.yaml > homepage/features/output.html

# Process Python code chunks for features
for file in homepage/features/code/*.py; do
    echo Processing $file...;

    cat $file | \
    sed 's/#skip//g' | \
    uv run pygmentize -f html -l python | \
    sed 's|"err">!!!</span>|"tw:opacity-50">|g;s|<span class="err">???||g;' | \
    sed -re 's^(ggplot|aes|geom_smooth|geom_point|facet_wrap|scale_y_continuous|coord_fixed|labs|theme_tufte|theme)^<a style="color: inherit; text-underline-offset: 0.3em;" href="/reference/\1.html">\1</a>^g' > homepage/features/html/$(basename $file).html
done