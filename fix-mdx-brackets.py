#!/usr/bin/env python3
import os
import re
import glob

# Find all MDX files
mdx_files = glob.glob("src/pages/**/*.mdx", recursive=True)

for filepath in mdx_files:
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # Fix unescaped < characters (but not in imports, HTML tags, or already escaped)
    # Pattern 1: << for bitshift
    content = re.sub(r'([^&<])<< ', r'\1&lt;&lt; ', content)

    # Pattern 2: < followed by digit (like "<1000")
    content = re.sub(r'([^&<])< ?(\d)', r'\1&lt;\2', content)

    # Pattern 3: <= followed by digit
    content = re.sub(r'([^&])<= ?(\d)', r'\1&lt;=\2', content)

    # Pattern 4: "for <" or similar in quotes
    content = re.sub(r'"<"', r'"&lt;"', content)
    content = re.sub(r'for <([^>])', r'for &lt;\1', content)

    if content != original:
        print(f"Fixed: {filepath}")
        with open(filepath, 'w') as f:
            f.write(content)

print("Done!")
