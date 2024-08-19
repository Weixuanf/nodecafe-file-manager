import logging
import os

import yaml

import folder_paths

comfy_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
print(f"🗂️Loading: Extra Model Folder Helper", comfy_path)
def load_extra_path_config(yaml_path):
    if not os.path.exists(yaml_path):
        logging.warning(f"Extra model paths config file not found: {yaml_path}")
        return
    with open(yaml_path, 'r') as stream:
        config = yaml.safe_load(stream)
    for c in config:
        conf = config[c]
        if conf is None:
            continue
        base_path = None
        if "base_path" in conf:
            base_path = conf.pop("base_path")
            # list all direct folder child of base_path
            for folder in os.listdir(base_path):
                full_path = os.path.join(base_path, folder)
                if os.path.isdir(full_path):
                    logging.info("Adding extra model path {} {}".format(folder, full_path))
                    folder_paths.add_model_folder_path(folder, full_path)

load_extra_path_config(os.path.join(comfy_path, "extra_model_paths.yaml"))