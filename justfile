set shell := ["bash", "-uc"]

[private]
default:
    @just --list

# Install prerequisites
install:
    uv sync

# Preview site with Quarto
preview:
    uv run quarto preview

# Render site with Quarto
render:
    uv run quarto render

# Open Jupyter Lab to experiment with notes
lab:
    uvx --from jupyter-core jupyter lab

# When you're down
dance:
    open "https://www.youtube.com/watch?v=2Abk1jAONjw&t=56s"
