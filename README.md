# ComfyUI extra model folder helper

this will automaticlaly read the subfolders like "checkpoints", "loras" under the extra model folder path you specify in extra_model_paths.yaml and add them to folder paths, so you don't need to define those subfolders one by one

all you need to do is to put this

```
comfyui:
  base_path: /path/to/extra/comfyui/models
```

in extra_model_paths.yaml
