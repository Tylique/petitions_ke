import os

SIGNATURE = """/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/
"""

def add_signature_to_file(filepath):
    """Adds signature to the beginning of a file if not already present"""
    try:
        # Check if file exists
        if not os.path.isfile(filepath):
            print(f"File not found: {filepath}")
            return

        # Read the existing content
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if signature is already present
        if SIGNATURE in content:
            print(f"Signature already exists in: {filepath}")
            return

        # Add signature to beginning of file
        new_content = SIGNATURE + "\n" + content

        # Write back to file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print(f"Signature added to: {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {str(e)}")

def process_directory(directory, extensions=None):
    """Recursively processes all files with given extensions in directory"""
    if extensions is None:
        extensions = ['.js', '.py', '.java', '.c', '.cpp', '.h', '.html', '.css', '.php', '.ts', '.tsx']

    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, file)
                add_signature_to_file(filepath)

if __name__ == "__main__":
    # Get directory path from user or use current directory
    dir_path = input("Enter directory path (or press Enter for current directory): ").strip()
    if not dir_path:
        dir_path = os.getcwd()

    # Define file extensions to process (now includes .tsx)
    extensions = [
        '.js', '.py', '.java', '.c', '.cpp',
        '.h', '.html', '.css', '.php', '.ts', '.tsx'
    ]

    # Process the directory
    print(f"Processing directory: {dir_path}")
    print(f"File extensions: {', '.join(extensions)}")
    process_directory(dir_path, extensions)
    print("Signature addition process completed.")
