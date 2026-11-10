"""Checks that your computer has what ATHLETEX AI needs.

Run from the project root:   python scripts/check_environment.py
Uses only the Python standard library, so it works before you install anything.
"""
import shutil
import subprocess
import sys

MIN_PYTHON = (3, 10)
MAX_PYTHON_FOR_AI = (3, 12)  # MediaPipe (used from Milestone 2) may lag behind the newest Python
MIN_NODE_MAJOR = 20


def run(cmd: list[str]) -> str | None:
    """Run a command and return the first line of its output, or None if not installed."""
    if not shutil.which(cmd[0]):
        return None
    result = subprocess.run(cmd, capture_output=True, text=True)
    return (result.stdout or result.stderr).strip().splitlines()[0]


def report(ok: bool, name: str, detail: str, required: bool = True) -> bool:
    mark = "OK  " if ok else ("FAIL" if required else "WARN")
    print(f"[{mark}] {name}: {detail}")
    return ok or not required


def main() -> int:
    results = []

    py = sys.version_info
    results.append(
        report(py >= MIN_PYTHON, "Python", f"{py.major}.{py.minor}.{py.micro} (need {MIN_PYTHON[0]}.{MIN_PYTHON[1]}+)")
    )
    if (py.major, py.minor) > MAX_PYTHON_FOR_AI:
        report(
            False,
            "Python for AI libraries",
            f"{py.major}.{py.minor} is newer than {MAX_PYTHON_FOR_AI[0]}.{MAX_PYTHON_FOR_AI[1]}; "
            "MediaPipe may not install in Milestone 2. Python 3.11 or 3.12 is the safe choice.",
            required=False,
        )

    node = run(["node", "--version"])
    node_ok = bool(node) and int(node.lstrip("v").split(".")[0]) >= MIN_NODE_MAJOR
    results.append(report(node_ok, "Node.js", f"{node or 'not found'} (need v{MIN_NODE_MAJOR}+)"))

    npm = run(["npm", "--version"])
    results.append(report(bool(npm), "npm", npm or "not found (comes with Node.js)"))

    git = run(["git", "--version"])
    results.append(report(bool(git), "Git", git or "not found"))

    ffmpeg = run(["ffmpeg", "-version"])
    results.append(
        report(bool(ffmpeg), "ffmpeg", ffmpeg or "not found (needed from Milestone 5)", required=False)
    )

    print()
    if all(results):
        print("Everything required is ready. Continue with the README.")
        return 0
    print("Fix the FAIL lines above, then run this script again.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
