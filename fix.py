import os
import re

html_files = [
    r"c:\Users\wwmoh\OneDrive\سطح المكتب\sevo-website\index.html",
    r"c:\Users\wwmoh\OneDrive\سطح المكتب\sevo-website\about.html",
    r"c:\Users\wwmoh\OneDrive\سطح المكتب\sevo-website\impact.html",
    r"c:\Users\wwmoh\OneDrive\سطح المكتب\sevo-website\contact.html",
    r"c:\Users\wwmoh\OneDrive\سطح المكتب\sevo-website\transparency.html"
]

css_file = r"c:\Users\wwmoh\OneDrive\سطح المكتب\sevo-website\css\i18n.css"

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements
    # left: 0; then later right: 0;
    content = re.sub(r'left:\s*0;\s*\n\s*right:\s*0;', 'inset-inline: 0;', content)
    content = re.sub(r'left:\s*20%;', 'inset-inline-start: 20%;', content)
    content = re.sub(r'right:\s*20%;', 'inset-inline-end: 20%;', content)
    content = re.sub(r'right:\s*auto;', 'inset-inline-end: auto;', content)
    content = re.sub(r'left:\s*50%;', 'inset-inline-start: 50%;', content)
    content = re.sub(r'left:\s*40px;', 'inset-inline-start: 40px;', content)
    
    # After paired replacement, remaining left: 0;
    content = re.sub(r'left:\s*0;', 'inset-inline-start: 0;', content)
    content = re.sub(r'border-left:', 'border-inline-start:', content)
    content = re.sub(r'text-align:\s*left;', 'text-align: start;', content)
    content = re.sub(r'text-align:\s*right;', 'text-align: end;', content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

with open(css_file, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Replace left: 0; and margins
css_content = re.sub(r'left:\s*0;', 'inset-inline-start: 0;', css_content)
css_content = re.sub(r'margin-right:\s*16px;', 'margin-inline-end: 16px;', css_content)
css_content = re.sub(r'margin-right:\s*8px;', 'margin-inline-end: 8px;', css_content)

# Remove the RTL section
rtl_section_pattern = r'/\* ============================================\s*RTL \(Right-to-Left\) SUPPORT\s*============================================ \*/.*?/\* ============================================\s*LANGUAGE-SPECIFIC TYPOGRAPHY'
css_content = re.sub(rtl_section_pattern, '/* ============================================\n   LANGUAGE-SPECIFIC TYPOGRAPHY', css_content, flags=re.DOTALL)

with open(css_file, 'w', encoding='utf-8') as f:
    f.write(css_content)

print("Replacement complete.")
