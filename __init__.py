import asyncio
from concurrent.futures import ThreadPoolExecutor
import traceback
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
    print(f"🔴🔴[nodecafe-file-manager] Error: Web directory not found: {dist_path}")

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
    files = []

    def traverse_directory(dir_path):
        with os.scandir(dir_path) as entries:
            for entry in entries:
                if entry.name.startswith("."):
                    continue
                if entry.is_dir(follow_symlinks=False):
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
    
    # Determine file path
    if name:
        file_path = os.path.join(folder, name)
    else:
        file_path = folder  # If no name is provided, just use the folder

    print(f"🦄⬇️Downloading file: {url} to {file_path}")
    token = ''
    
    # Set the token based on the URL
    if url.startswith("https://civitai.com/"):
        token = '5cb7046d212403c5ea6c19983122fe15'
    elif url.startswith("https://huggingface.co/"):
        token = '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'
    
    try:
        # Build the curl command
        curl_command = [
            'curl',
            '-L',
            '-#',  # Progress bar
            '-C', '-',  # Resume capability
        ]

        if token:
            curl_command += ['-H', f'Authorization: Bearer {token}']

        if name:
            curl_command += ['-o', file_path]
        else:
            # Change directory to the destination folder
            curl_command += ['-O']  # Download using the default remote name

        curl_command.append(url)
        
        # Execute the curl command
        subprocess.Popen(curl_command, cwd=folder if not name else None)
        
        print(f"✅ Successfully downloaded model to {file_path}")
        return web.json_response({
            'message': f"Successfully downloaded model to {file_path}"
        }, content_type='application/json')
    except subprocess.CalledProcessError as e:
        print(f"❌ Error downloading model: {name if name else 'unknown'} from {url}")
        return web.json_response({
            'error': f"Error downloading model: {name if name else 'unknown'} from {url}"
        }, content_type='application/json')
        
@server.PromptServer.instance.routes.post('/nc_manager/create_folder')
async def create_folder(request):
    data = await request.json()
    folder = data.get('folder')
    name = data.get('name')
    
    if not folder or not name:
        return web.json_response({
            'error': 'Invalid data'
        }, content_type='application/json')
    
    new_folder_path = os.path.join(folder, name)
    
    try:
        os.makedirs(new_folder_path, exist_ok=True)
        print(f"✅ Successfully created folder: {new_folder_path}")
        return web.json_response({
            'message': f"Successfully created folder: {new_folder_path}"
        }, content_type='application/json')
    except Exception as e:
        logging.error(f"Error creating folder: {new_folder_path}", e)
        traceback.print_exc()
        return web.json_response({
            'error': f"Error creating folder: {new_folder_path}"
        }, content_type='application/json')

@server.PromptServer.instance.routes.get('/nc_manager/get_logs')
async def get_logs(request):
    loop = asyncio.get_event_loop()
    log_path = '/comfyui.log'
    if not os.path.exists(log_path):
        log_path = os.path.join(comfy_path, 'comfyui.log')
    if not os.path.exists(log_path):
        return web.Response(text='Logs file not found', content_type='text/plain')

    def read_logs():
        with open(log_path, 'r') as f:
            return f.read()

    logs = await loop.run_in_executor(ThreadPoolExecutor(), read_logs)
    return web.Response(text=logs, content_type='text/plain')

@server.PromptServer.instance.routes.get('/nc_manager/list_custom_nodes')
async def list_custom_nodes(request):
    custom_nodes_path = os.path.join(comfy_path, 'custom_nodes')
    if not os.path.exists(custom_nodes_path):
        return web.json_response([], content_type='application/json')
    custom_nodes = []
    with os.scandir(custom_nodes_path) as entries:
        for entry in entries:
            if entry.is_dir(follow_symlinks=False):
                if entry.name in ignore_folders:
                    continue
                git_url = None
                try:
                    result = subprocess.run(
                        ['git', '-C', entry.path, 'config', '--get', 'remote.origin.url'],
                        capture_output=True,
                        text=True,
                        check=True
                    )
                    git_url = result.stdout
                except Exception as e:
                    git_url = None
                
                custom_nodes.append({
                    'name': entry.name,
                    'path': entry.path,
                    'git_url': git_url
                })
    return web.json_response(custom_nodes, content_type='application/json')

@server.PromptServer.instance.routes.post('/nc_manager/update_custom_node')
async def update_custom_node(request):
    data = await request.json()
    path = data.get('path')
    if not path:
        return web.Response(text='Invalid data', content_type='text/plain')
    print(f"🦄⬇️Updating custom node: {path}")

    loop = asyncio.get_event_loop()

    def run_subprocess(commands):
        for command in commands:
            subprocess.run(command, stdout=None, stderr=None, text=True, bufsize=1)

    commands = [
        ['git', '-C', path, 'pull']
    ]

    if os.path.exists(os.path.join(path, 'requirements.txt')):
        print(f"🦄⬇️Installing requirements: {os.path.join(path, 'requirements.txt')}")
        commands.append(['pip', 'install', '-r', os.path.join(path, 'requirements.txt')])

    if os.path.exists(os.path.join(path, 'install.py')):
        print(f"🦄⬇️Running install.py: {os.path.join(path, 'install.py')}")
        commands.append(['python', '-u', os.path.join(path, 'install.py')])

    await loop.run_in_executor(ThreadPoolExecutor(), run_subprocess, commands)

    print(f"✅ Successfully updated custom node: {path}")
    return web.Response(text='Successfully updated custom node', content_type='text/plain')

 
