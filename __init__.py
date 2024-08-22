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

extra_model_base_path = None
def load_extra_model_paths():
    global extra_model_base_path
    yaml_path = os.path.join(comfy_path, 'extra_model_paths.yaml')
    if not os.path.exists(yaml_path):
        logging.warning(f"Extra model paths config file not found: {yaml_path}")
        return
    with open(yaml_path, 'r') as stream:
        config = yaml.safe_load(stream)
    for c in config:
        conf = config[c]
        if conf is None:
            continue
        
        if "base_path" in conf:
            extra_model_base_path = conf.pop("base_path")
            print('extra_model_base_path', extra_model_base_path)

load_extra_model_paths()

@server.PromptServer.instance.routes.get('/nc_manager/list_files')
async def list_files(request):
    path = request.query.get("path", 'comfyui')
    directory = comfy_path if path == 'comfyui' else folder_paths.models_dir if path == 'models' else extra_model_base_path if path == 'extra_models' else path
    print('directory', directory)
    if not os.path.exists(directory):
        print(f"🦄🦄🔴Error: Directory not found: {directory}")
        return web.json_response(None, content_type='application/json')

    root = {
        "name": directory,
        "type": "folder",
        "abs_path": directory,
        "children": []
    }

    def traverse_directory(root):
        with os.scandir(root['abs_path']) as entries:
            for entry in entries:
                if entry.name.startswith("."):
                    continue
                if entry.is_dir(follow_symlinks=False):
                    # Check if the directory should be ignored
                    if entry.name in ignore_folders:
                        continue
                    folder = {
                        "name": entry.name,
                        "type": "folder",
                        "abs_path": entry.path,
                        "children": []
                    }
                    traverse_directory(folder)
                    root['children'].append(folder)
                elif entry.is_file(follow_symlinks=False):
                    size_bytes = entry.stat().st_size
                    size_kb = size_bytes / 1024
                    root['children'].append({
                        "name": entry.name,
                        "type": "file",
                        "sizeB": size_bytes,
                        "sizeKB": size_kb,
                        "abs_path": entry.path
                    })

    traverse_directory(root)
    return web.json_response(root, content_type='application/json')

@server.PromptServer.instance.routes.get('/nc_manager/list_folder_children')
def list_files(request):
    path = request.query.get("path", 'comfyui')
    directory = comfy_path if path == 'comfyui' else folder_paths.models_dir if path == 'models' else extra_model_base_path if path == 'extra_models' else path
    print('directory', directory)
    files = []

    def traverse_directory(dir_path):
        with os.scandir(dir_path) as entries:
            for entry in entries:
                if entry.name.startswith("."):
                    continue
                if entry.is_dir(follow_symlinks=False):
                    # Check if the directory should be ignored
                    if entry.name in ignore_folders:
                        continue
                    files.append({
                        "name": entry.name,
                        "type": "folder",
                        "abs_path": entry.path
                    })

                elif entry.is_file(follow_symlinks=False):
                    relative_path = os.path.relpath(entry.path, directory)
                    size_bytes = entry.stat().st_size
                    size_kb = size_bytes / 1024
                    files.append({
                        "name": entry.name,
                        "type": "file",
                        "sizeB": size_bytes,
                        "sizeKB": size_kb,
                        "abs_path": entry.path
                    })

    traverse_directory(directory)
    return web.json_response({
        'files': files,
        'root': directory
    }, content_type='application/json')

@server.PromptServer.instance.routes.post('/nc_manager/upload_file')
async def list_files(request):
    data = await request.json()
    folder = data.get('folder')
    name = data.get('name')
    url = data.get('url')
    if not folder or not url:
        return web.json_response({
            'error': 'Invalid data'
        }, content_type='application/json')

    # Ensure the folder exists
    os.makedirs(folder, exist_ok=True)

    # Set up the download path or use the default remote name
    if name:
        file_path = os.path.join(folder, name)
        curl_output_option = ['-o', file_path]
    else:
        curl_output_option = ['-OJ']

    print(f"🦄⬇️Downloading file: {url} to {folder}")
    token = ''
    # Download the model using curl
    if url.startswith("https://civitai.com/"):
        token = '5cb7046d212403c5ea6c19983122fe15'
    elif url.startswith("https://huggingface.co/"):
        token = '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'
    try:
        subprocess.run([
            'curl',
            '-L',
            '-#', # Progress bar
            '-C', '-',  # Resume capability
            '-H', f'Authorization: Bearer {token}',
            *curl_output_option,
            url
        ], check=True, cwd=folder)
        print(f"✅ Successfully downloaded model to {folder}")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error downloading model from {url}")
        raise e
