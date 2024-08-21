import asyncio
import server
from aiohttp import web
import folder_paths
import shutil
import os
import subprocess
import os
from .service.model_manager.model_installer import *
import logging
import os
import yaml
import folder_paths


WEB_DIRECTORY = "ui/dist"
NODE_CLASS_MAPPINGS = {}
__all__ = ['NODE_CLASS_MAPPINGS']
version = "V1.0.0"
print(f"🦄🦄Loading: Nodecafe File Manager ({version})")

comfy_path = os.path.dirname(folder_paths.__file__)
manager_path = os.path.join(os.path.dirname(__file__))
dist_path = os.path.join(manager_path, 'ui/dist')
if os.path.exists(dist_path):
    server.PromptServer.instance.app.add_routes([
        web.static('/model_manager_dist/', dist_path),
    ])
else:
    print(f"🦄🦄🔴🔴Error: Web directory not found: {dist_path}")

ignore_folders = {".git", ".idea", "__pycache__", "node_modules", "dist", "build", "venv", "env", "temp", "tmp", "logs", "log", "data", "ui", "ui_dist", "dist"}

@server.PromptServer.instance.routes.get('/nc_manager/list_files')
def list_files(request):
    path = request.query.get("path", 'comfyui')
    directory = comfy_path if path == 'comfyui' else path
    files = {}

    def traverse_directory(dir_path):
        with os.scandir(dir_path) as entries:
            for entry in entries:
                if entry.name.startswith("."):
                    continue
                if entry.is_dir(follow_symlinks=False):
                    # Check if the directory should be ignored
                    if entry.name in ignore_folders:
                        continue
                    # Recursively traverse subdirectories
                    traverse_directory(entry.path)
                elif entry.is_file(follow_symlinks=False):
                    relative_path = os.path.relpath(entry.path, directory)
                    size_bytes = entry.stat().st_size
                    size_kb = size_bytes / 1024
                    files[relative_path] = {
                        "sizeB": size_bytes,
                        "sizeKB": size_kb,
                    }

    traverse_directory(directory)
    return web.json_response(files, content_type='application/json')