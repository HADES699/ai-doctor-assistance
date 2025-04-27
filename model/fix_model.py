import h5py

input_model_path = "oral.h5"
output_model_path = "oral_fixed.h5"

with h5py.File(input_model_path, mode="r") as f_in:
    with h5py.File(output_model_path, mode="w") as f_out:
        for key in f_in.attrs:
            f_out.attrs[key] = f_in.attrs[key]
        for key in f_in:
            f_in.copy(key, f_out)

        model_config_string = f_out.attrs.get("model_config")
        if isinstance(model_config_string, bytes):
            model_config_string = model_config_string.decode("utf-8")
        if model_config_string.find('"groups": 1,') != -1:
            print("Found 'groups': 1, removing it...")
            model_config_string = model_config_string.replace('"groups": 1,', '')
            f_out.attrs.modify("model_config", model_config_string)
            f_out.flush()
            updated_config = f_out.attrs.get("model_config")
            assert updated_config.find('"groups": 1,') == -1, "Failed to remove 'groups': 1"
            print("Model config updated successfully.")
        else:
            print("No 'groups': 1 found in model config. Copy created without changes.")

print(f"Modified model saved as {output_model_path}")