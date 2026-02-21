import re
import sys
from pathlib import Path

VOID_TAGS = set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"])

def strip_comments_and_scripts(text):
    # Remove HTML comments
    text = re.sub(r'<!--.*?-->', '', text, flags=re.S)
    # Remove script and style blocks
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.S|re.I)
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.S|re.I)
    return text

TAG_RE = re.compile(r'<\s*(/?)\s*([a-zA-Z0-9:-]+)([^>]*)>', flags=re.S)

def get_line_col(text, index):
    # return 1-based line, col
    lines = text[:index].splitlines()
    line = len(lines) or 1
    col = len(lines[-1]) + 1 if lines else 1
    return line, col


def validate(path):
    p = Path(path)
    if not p.exists():
        print(f"File not found: {path}")
        return 2
    raw = p.read_text(encoding='utf-8')
    cleaned = strip_comments_and_scripts(raw)
    stack = []
    errors = []

    for m in TAG_RE.finditer(cleaned):
        full = m.group(0)
        closing = bool(m.group(1))
        tag = m.group(2).lower()
        rest = m.group(3) or ''
        start = m.start()
        # Self-closing detection
        self_closing = rest.strip().endswith('/') or full.endswith('/>')

        if closing:
            if stack and stack[-1][0] == tag:
                stack.pop()
            else:
                # Try to find matching opening lower in stack
                found = None
                for i in range(len(stack)-1, -1, -1):
                    if stack[i][0] == tag:
                        found = i
                        break
                line, col = get_line_col(raw, start)
                if found is not None:
                    errors.append((line, col, f"Unexpected closing tag </{tag}> — missing closing for {', '.join([s[0] for s in stack[found+1:]])} before it."))
                    # pop everything up to found
                    stack = stack[:found]
                else:
                    errors.append((line, col, f"Unmatched closing tag </{tag}>"))
        else:
            if tag in VOID_TAGS or self_closing:
                continue
            # special: doctype
            if tag == '!doctype':
                continue
            # push
            line, col = get_line_col(raw, start)
            stack.append((tag, line, col))

    for tag, line, col in stack:
        errors.append((line, col, f"Unclosed tag <{tag}> starting here"))

    if not errors:
        print("No structural tag errors detected.")
        return 0
    else:
        print(f"Found {len(errors)} structural issue(s):\n")
        for line, col, msg in errors:
            print(f"Line {line}, Col {col}: {msg}")
        return 1

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: html_validator.py path/to/file.html")
        sys.exit(2)
    path = sys.argv[1]
    code = validate(path)
    sys.exit(code)
