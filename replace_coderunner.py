#!/usr/bin/env python3
import os
import re
import sys

def replace_coderunner_in_file(filepath):
    """Replace CodeRunner components with syntax-highlighted code blocks in a single file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match CodeRunner components
    # Handles both self-closing and multi-line formats
    pattern = r'<CodeRunner\s+([^>]*?)\s*/>'
    
    def replace_coderunner(match):
        # Extract attributes from the CodeRunner tag
        attrs_text = match.group(1)
        
        # Parse attributes
        title_match = re.search(r'title="([^"]*)"', attrs_text)
        code_match = re.search(r'code="([^"]*)"', attrs_text, re.DOTALL)
        
        title = title_match.group(1) if title_match else "Assembly Code Example"
        code = code_match.group(1) if code_match else ""
        
        # Clean up the code (handle escaped quotes and newlines)
        code = code.replace('\\"', '"').strip()
        
        # Create replacement
        replacement = f'**{title}:**\n\n```assembly\n{code}\n```'
        
        return replacement
    
    # Replace all CodeRunner instances
    new_content = re.sub(pattern, replace_coderunner, content, flags=re.DOTALL)
    
    # Only write if content changed
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    """Process all lesson files to remove CodeRunner components."""
    base_dir = "/Users/stevehill/Projects/Code198x/new-code198x/src/content/lessons"
    
    files_changed = 0
    total_files = 0
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                total_files += 1
                
                try:
                    if replace_coderunner_in_file(filepath):
                        files_changed += 1
                        print(f"Updated: {filepath}")
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")
    
    print(f"\nProcessed {total_files} files, updated {files_changed} files")

if __name__ == "__main__":
    main()