
import os
from pathlib import Path

def generate_project_structure(start_path=".", output_file="structure.txt", max_depth=4):
    """
    Generates a text file showing the project directory structure
    """
    with open(output_file, "w", encoding="utf-8") as f:
        for root, dirs, files in os.walk(start_path):
            # Skip node_modules and other unnecessary directories
            dirs[:] = [d for d in dirs if d not in {"node_modules", ".next", ".git"}]

            level = root.replace(start_path, "").count(os.sep)
            if level > max_depth:
                continue

            indent = " " * 4 * level
            f.write(f"{indent}{os.path.basename(root)}/\n")

            subindent = " " * 4 * (level + 1)
            for file in files:
                if not file.endswith((".map", ".log", ".tmp")):
                    f.write(f"{subindent}{file}\n")

if __name__ == "__main__":
    project_root = input("Enter project path (or press Enter for current directory): ") or "."
    generate_project_structure(project_root)
    print(f"Project structure saved to structure.txt")
