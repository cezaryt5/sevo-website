import os
import re

html_files = [
    r"c:\Users\wwmoh\OneDrive\سطح المكتب\sevo-website\index.html",
    r"c:\Users\wwmoh\OneDrive\سطح المكتب\sevo-website\about.html",
    r"c:\Users\wwmoh\OneDrive\سطح المكتب\sevo-website\impact.html",
    r"c:\Users\wwmoh\OneDrive\سطح المكتب\sevo-website\contact.html",
    r"c:\Users\wwmoh\OneDrive\سطح المكتب\sevo-website\transparency.html"
]

def refactor_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find <nav class="navbar">...</nav> and extract logo, links, donate
    # The structure is:
    # <nav class="navbar">
    #     <div class="logo">SEVO&reg;</div>
    #     <div class="nav-links">
    #         ... links ...
    #         <a href="#donate" class="btn"...>Donate</a>
    #     </div>
    # </nav>

    def replacer(match):
        pre = match.group(1) # opening nav tag + wrapper div etc if we match it, wait, let's match inside nav.
        logo = match.group(2)
        links = match.group(3)
        donate = match.group(4)

        return f'''{pre}
            <div class="navbar-brand">
                {logo}
            </div>
            <div class="navbar-menu">
                <div class="nav-links">
{links}
                </div>
            </div>
            <div class="navbar-actions">
                {donate}
            </div>
        '''

    # For standard sticky navbar and static header navbar
    # We will search for:
    # (<nav[^>]*>\s*)
    # (<div class="logo">.*?</div>)\s*
    # <div class="nav-links">\s*
    # (.*?)
    # (\s*<a href="[^"]*donate[^"]*" class="btn"[^>]*>.*?</a>)
    # \s*</div>\s*
    # (</nav>)

    pattern = r'(<nav[^>]*>\s*)(<div class="logo">.*?</div>)\s*<div class="nav-links">\s*(.*?)\s*(<a href="[^"]*#?donate.*?" class="btn"[^>]*>.*?</a>)\s*</div>\s*'
    content = re.sub(pattern, replacer, content, flags=re.DOTALL | re.IGNORECASE)

    # CSS updates
    css_replacement = '''
        .navbar-brand {
            flex: 1;
            display: flex;
            justify-content: flex-start;
        }

        .navbar-menu {
            flex: 2;
            display: flex;
            justify-content: center;
        }

        .navbar-actions {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 16px;
        }
        
        @media (max-width: 768px) {
            .navbar { padding: 0 24px; border-radius: 0; }
            .navbar-menu, .navbar-actions, .static-header .nav-links { display: none; }
            .navbar-brand { justify-content: flex-start; }
        }
    '''

    # Insert CSS replacement right before "/* Floating Navbar */" or anywhere in style.
    if '.navbar-brand {' not in content:
        content = content.replace('/* Floating Navbar */', css_replacement + '\n        /* Floating Navbar */')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

for html_file in html_files:
    refactor_html(html_file)

# Modify components.js
components_path = r"c:\Users\wwmoh\OneDrive\سطح المكتب\sevo-website\js\components.js"
with open(components_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

js_content = js_content.replace("querySelectorAll('.navbar .nav-links')", "querySelectorAll('.navbar .navbar-actions')")
js_content = js_content.replace("querySelectorAll('.static-header .nav-links')", "querySelectorAll('.static-header .navbar-actions')")

with open(components_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Navbar refactoring completed.")
